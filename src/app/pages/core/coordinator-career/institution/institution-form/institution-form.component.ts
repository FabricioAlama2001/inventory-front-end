import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PrimeIcons} from "primeng/api";
import {OnExitInterface} from "@shared/interfaces";
import {CatalogueModel, InstitutionModel} from "@models/core";
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  MessageService,
  RoutesService,
  InstitutionsHttpService
} from "@services/core";
import {
    BreadcrumbEnum,
    CatalogueTypeEnum,
    ClassButtonActionEnum,
    IconButtonActionEnum, LabelButtonActionEnum,
    SkeletonEnum
} from "@shared/enums";
import {Expressions} from "@shared/regular-expresions";

@Component({
  selector: 'app-institution-form',
  templateUrl: './institution-form.component.html',
  styleUrls: ['./institution-form.component.scss']
})
export class InstitutionFormComponent implements OnInit, OnExitInterface {
  protected readonly SkeletonEnum = SkeletonEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected id: string | null = null;
  protected form: FormGroup;
  protected formErrors: string[] = [];

  // Foreign Keys
  protected states: CatalogueModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private institutionsHttpService: InstitutionsHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONS, routerLink: [this.routesService.institutions]},
      {label: BreadcrumbEnum.FORM},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = this.activatedRoute.snapshot.params['id'];
    }

    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  back(): void {
    this.router.navigate([this.routesService.institutions]);
  }

  ngOnInit(): void {
    this.loadStates();

    if (this.id) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      acronym: [null, [Validators.required]],
      cellphone: [null, [Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      code: [null, [Validators.required]],
      codeSniese: [null, []],
      denomination: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      isVisible: [true, [Validators.required]],
      logo: [null],
      name: [null, [Validators.required]],
      phone: [null, [Validators.required,Validators.minLength(9),Validators.maxLength(9)]],
      shortName: [null, [Validators.required]],
      slogan: [null],
      state: [null, [Validators.required]],
      web: ['https://', [Validators.pattern(Expressions.url)]],
    });
  }

  onSubmit(): void {
    if (this.validateForm()) {
      if (this.id) {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  /** Actions **/
  create(item: InstitutionModel): void {
    this.institutionsHttpService.create(item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  update(item: InstitutionModel): void {
    this.institutionsHttpService.update(this.id!, item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  /** Load Data **/
  get(): void {
    this.institutionsHttpService.findOne(this.id!).subscribe((item) => {
      this.form.patchValue(item);
    });
  }

  loadStates(): void {
    this.states = this.cataloguesHttpService.findByType(CatalogueTypeEnum.INSTITUTIONS_STATE);
  }

  /** Validations **/
  validateForm() {
    this.formErrors = [];

    if (this.acronymField.errors) this.formErrors.push('Siglas');
    if (this.cellphoneField.errors) this.formErrors.push('Teléfono Celular');
    if (this.codeField.errors) this.formErrors.push('Código');
    if (this.codeSnieseField.errors) this.formErrors.push('Código SNIESE');
    if (this.denominationField.errors) this.formErrors.push('Denominación');
    if (this.emailField.errors) this.formErrors.push('Correo Electrónico');
    if (this.isVisibleField.errors) this.formErrors.push('Es Visible');
    if (this.logoField.errors) this.formErrors.push('Logo');
    if (this.nameField.errors) this.formErrors.push('Nombre');
    if (this.phoneField.errors) this.formErrors.push('Teléfono Fijo');
    if (this.shortNameField.errors) this.formErrors.push('Nombre Corto');
    if (this.sloganField.errors) this.formErrors.push('Slogan');
    if (this.stateField.errors) this.formErrors.push('Estado');
    if (this.webField.errors) this.formErrors.push('Página Web');

    this.formErrors.sort();
    return this.formErrors.length === 0 && this.form.valid;
  }

  /** Form Getters **/
  get acronymField(): AbstractControl {
    return this.form.controls['acronym'];
  }

  get cellphoneField(): AbstractControl {
    return this.form.controls['cellphone'];
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get codeSnieseField(): AbstractControl {
    return this.form.controls['codeSniese'];
  }

  get denominationField(): AbstractControl {
    return this.form.controls['denomination'];
  }

  get emailField(): AbstractControl {
    return this.form.controls['email'];
  }

  get isVisibleField(): AbstractControl {
    return this.form.controls['isVisible'];
  }

  get logoField(): AbstractControl {
    return this.form.controls['logo'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get phoneField(): AbstractControl {
    return this.form.controls['phone'];
  }

  get shortNameField(): AbstractControl {
    return this.form.controls['shortName'];
  }

  get sloganField(): AbstractControl {
    return this.form.controls['slogan'];
  }

  get stateField(): AbstractControl {
    return this.form.controls['state'];
  }

  get webField(): AbstractControl {
    return this.form.controls['web'];
  }

    protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
    protected readonly IconButtonActionEnum = IconButtonActionEnum;
    protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
}
