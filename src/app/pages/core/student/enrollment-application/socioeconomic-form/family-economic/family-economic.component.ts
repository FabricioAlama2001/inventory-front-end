import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PrimeIcons} from 'primeng/api';
import {CatalogueModel, EnrollmentModel, StudentModel} from '@models/core';
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  MessageService,
  RoutesService,
  StudentsHttpService,
} from '@services/core';
import {CatalogueEnrollmentStateEnum, CatalogueTypeEnum} from '@shared/enums';

@Component({
  selector: 'app-family-economic',
  templateUrl: './family-economic.component.html',
  styleUrls: ['./family-economic.component.scss']
})
export class FamilyEconomicComponent {
  @Input() student!: StudentModel;
  @Input() id!: string;
  @Input() enrollment!: EnrollmentModel;
  @Output() next: EventEmitter<StudentModel> = new EventEmitter<StudentModel>();
  @Output() previous: EventEmitter<number> = new EventEmitter<number>();
  @Output() validForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly Validators = Validators;
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected yesNo: CatalogueModel[] = [];
  protected familyProperties: CatalogueModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private studentsHttpService: StudentsHttpService
  ) {
    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
    }

    this.form = this.newForm;
    this.applyValidations()
  }

  ngOnInit(): void {
    this.form.patchValue(this.student);

    this.validateForm();

    if (this.enrollment?.enrollmentState) {
      if (this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REGISTERED ||
        this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REJECTED) { //reviewer
        this.form.enable();
      } else {
        this.form.disable();
      }
    }

    this.loadFamilyProperties();
    this.loadYesNo();
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.update();
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  update() {
    this.studentsHttpService.updateFamilyEconomic(
      this.id,
      this.form.value
    ).subscribe(() => this.next.emit());
  }

  validateForm() {
    this.formErrors = [];

    if (this.isFamilyVehicleField.errors) this.formErrors.push('Posee vehiculos');
    if (this.isFamilyPropertiesField.errors) this.formErrors.push('Posee propiedades');
    if (this.familyPropertiesField.errors) this.formErrors.push('Que propiedades');

    this.formErrors.sort();

    this.validForm.emit(this.formErrors.length === 0 && this.form.valid);
    return this.formErrors.length === 0 && this.form.valid;
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      informationStudent: this.newInformationStudentForm,
    });
  }

  get newInformationStudentForm(): FormGroup {
    return this.formBuilder.group({
      isFamilyVehicle: [null, [Validators.required]],
      isFamilyProperties: [null, [Validators.required]],
      familyProperties: [null],
    });
  }

  loadFamilyProperties(): void {
    this.familyProperties = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.FAMILY_PROPERTIES
    );
  }

  loadYesNo(): void {
    this.yesNo = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.YES_NO
    );
  }

  applyValidations() {
    this.isFamilyPropertiesField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.familyPropertiesField.addValidators(Validators.required);
      } else {
        this.familyPropertiesField.removeValidators(Validators.required);
      }
      this.familyPropertiesField.updateValueAndValidity();
    });
  }

  get informationStudentForm(): FormGroup {
    return this.form.controls['informationStudent'] as FormGroup;
  }

  get isFamilyVehicleField(): AbstractControl {
    return this.informationStudentForm.controls['isFamilyVehicle'];
  }

  get isFamilyPropertiesField(): AbstractControl {
    return this.informationStudentForm.controls['isFamilyProperties'];
  }

  get familyPropertiesField(): AbstractControl {
    return this.informationStudentForm.controls['familyProperties'];
  }
}
