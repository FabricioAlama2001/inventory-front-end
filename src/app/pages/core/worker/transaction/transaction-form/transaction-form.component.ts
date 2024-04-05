import { Component, Input, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '@models/auth';
import { CategoryModel } from '@models/core';
import { TransactionModel } from '@models/core/transaction.model';
import { UsersHttpService } from '@services/auth';
import {
  BreadcrumbService,
  CategoriesHttpService,
  CoreService,
  MessageService,
  ProductsHttpService,
  RoutesService,
} from '@services/core';
import { TransactionsHttpService } from '@services/core/transactions-http.service';
import {
  BreadcrumbEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  RoleEnum,
  RoutesEnum,
  SkeletonEnum,
} from '@shared/enums';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
})
export class TransactionFormComponent implements OnInit {
  private readonly transactionsHttpService = inject(TransactionsHttpService);
  private readonly usersHttpService = inject(UsersHttpService);
  private readonly productsHttpService = inject(ProductsHttpService);
  private readonly categoriesHttpService = inject(CategoriesHttpService);
  private readonly breadcrumbService = inject(BreadcrumbService); //
  private readonly formBuilder = inject(FormBuilder); //Ayuda a crear - Formulario Reactivos
  private readonly router = inject(Router); //Redireccionar
  private readonly routesService = inject(RoutesService); //Ruta de la aplicacion
  protected readonly coreService = inject(CoreService); //Funcionalidades Generalidades que se utilizan en todos los componente
  protected readonly messageService = inject(MessageService); //

  @Input() id!: string;
  protected form!: FormGroup;
  protected formErrors!: string[];
  protected types!: any[];
  protected users!: UserModel[];
  protected clients!: UserModel[];
  protected client!: string;

  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;

  protected helpText!: string;
  private saving: boolean = true;

  constructor() {
    this.breadcrumbService.setItems([
      {
        label: BreadcrumbEnum.TRANSACTIONS,
        routerLink: [this.routesService.transactionsList],
      },
      {
        label: BreadcrumbEnum.FORM,
      },
    ]);

    this.form = this.buildForm;
    this.checkValueChanges();
  }

  ngOnInit(): void {
    this.loadTypes();
    this.loadUsers();

    if (this.id != RoutesEnum.NEW) {
      this.findTransaction();
    }
  }

  //metodo validación de emulación de foringkey
  loadTypes() {
    this.types = [
      { name: 'Ingresos', type: true },
      { name: 'Egresos', type: false },
    ];
  }

  //metodo
  loadUsers() {
    this.usersHttpService.findCatalogues().subscribe((users) => {
      this.users = users.filter((user) =>
        user.roles.some((role) => role.code === RoleEnum.APPROVER)
      );

      if (this.typeField.value && this.typeField.value.type) {
        this.client='Proveedor';

        this.clients = users.filter((user) =>
          user.roles.some((role) => role.code === RoleEnum.PROVIDER)
        );
      } else {
        this.client='Cliente';

        this.clients = users.filter((user) =>
          user.roles.some((role) => role.code === RoleEnum.CUSTOMER)
        );
      }
    });
  }

  //método
  loadAuthorizer() {
    this.usersHttpService.findCatalogues().subscribe((users) => {
      this.users = users;
    });
  }

  //Este metodo Construir el formulario reactivo
  get buildForm() {
    return this.formBuilder.group({
      code: [null, Validators.required],
      description: [null, Validators.required],
      date: [null, Validators.required],
      type: [null, Validators.required],
      user: [null, Validators.required],
      client: [null, Validators.required],
    });
  }
  checkValueChanges() {
    this.typeField.valueChanges.subscribe((value) => {
      this.loadUsers();
    });
  }

  findTransaction(): void {
    this.transactionsHttpService.findOne(this.id!).subscribe((data) => {
      this.form.patchValue(data);
    });
  }

  get validateFormErrors() {
    this.formErrors = [];

    if (this.codeField.errors) {
      this.formErrors.push('Código');
    }
    this.formErrors.sort();

    return this.formErrors.length === 0 && this.form.valid;
  }

  back(): void {
    this.router.navigate([this.routesService.transactionsList]);
  }

  create(payload: TransactionModel): void {
    this.transactionsHttpService
      .create(payload)
      .subscribe((applicationStatus) => {
        this.saving = false;
        this.back();
      });
  }

  update(payload: TransactionModel): void {
    this.transactionsHttpService
      .update(this.id!, payload)
      .subscribe((applicationStatus) => {
        this.saving = false;
        this.back();
      });
  }

  onSubmit() {
    if (this.validateFormErrors) {
      this.typeField.patchValue(this.typeField.value.type);
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

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }
  get descriptionField(): AbstractControl {
    return this.form.controls['description'];
  }
  get dateField(): AbstractControl {
    return this.form.controls['date'];
  }

  get typeField(): AbstractControl {
    return this.form.controls['type'];
  }

  get userField(): AbstractControl {
    return this.form.controls['user'];
  }

  get clientField(): AbstractControl {
    return this.form.controls['client'];
  }
}
