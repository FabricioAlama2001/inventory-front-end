import { Component, Input, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import {
  BreadcrumbService,
  CategoriesHttpService,
  CoreService,
  MessageService,
  ProductsHttpService,
  RoutesService,
} from '@services/core';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  SkeletonEnum,
  RoutesEnum,
  ApplicationStatusFormEnum,
} from '@shared/enums';
import { getSlug } from '@shared/helpers';
import { CatalogueModel, CategoryModel, ProductModel } from '@models/core';
//---------------------------------------------------------


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {

  private readonly productsHttpService = inject(ProductsHttpService);
  private readonly categoriesHttpService = inject(CategoriesHttpService);
  private readonly breadcrumbService = inject(BreadcrumbService); //
  private readonly formBuilder = inject(FormBuilder); //Ayuda a crear - Formulario Reactivos
  private readonly router = inject(Router); //Redireccionar
  private readonly routesService = inject(RoutesService); //Ruta de la aplicacion
  protected readonly coreService = inject(CoreService); //Funcionalidades Generalidades que se utilizan en todos los componente
  protected readonly messageService = inject(MessageService); //

  //Decorador que agrega funcionalidad- en esta caso de atributo
  //Decoradores agregan funcionalidad a tres cosas clases,metodos y atributos
  @Input() id!: string;
  protected form!: FormGroup;
  protected formErrors!: string[];

  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;

  protected helpText!: string;
  private saving: boolean = true;

  protected categories!: CategoryModel[];

  constructor() {
    this.breadcrumbService.setItems([
      {
        label: BreadcrumbEnum.CATEGORIES,
        routerLink: [this.routesService.productsList],
      },
      {
        label: BreadcrumbEnum.FORM,
      },
    ]);

    this.form = this.buildForm;
    this.checkValueChanges();
  }

  ngOnInit(): void {
    this.loadCategories();

    if (this.id != RoutesEnum.NEW) {
      this.findProdcut();
    }
  }

  //Este metodo Construir el formulario reactivo
  get buildForm() {
    return this.formBuilder.group({
      code: ['', Validators.required],
      enabled: true,
      name: ['', Validators.required],
      description: ['', Validators.required],
      
    });
  }

  checkValueChanges() {}

  findProdcut(): void {
    this.categoriesHttpService
      .findOne(this.id!)
      .subscribe((applicationStatus) => {
        this.form.patchValue(applicationStatus);
      });
  }

  loadCategories() {
    this.categoriesHttpService.findCatalogues().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSubmit() {
    if (this.validateFormErrors) {
      if (this.id === RoutesEnum.NEW) {
        this.create(this.form.value);
      } else {
        this.update(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.codeField.errors) {
      this.formErrors.push('Código');
    }
    if (this.nameField.errors) {
      this.formErrors.push('Nombre');
    }
    if (this.enabledField.errors) {
      this.formErrors.push('Estado');
    }

    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  back(): void {
    this.router.navigate([this.routesService.productsList]);
  }

  create(payload: CategoryModel): void {
    this.categoriesHttpService.create(payload).subscribe((applicationStatus) => {
      this.saving = false;
      this.back();
    });
  }

  update(payload: CategoryModel): void {
    this.categoriesHttpService
      .update(this.id!, payload)
      .subscribe((applicationStatus) => {
        this.saving = false;
        this.back();
      });
  }


  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get enabledField(): AbstractControl {
    return this.form.controls['enabled'];
  }

  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }

}