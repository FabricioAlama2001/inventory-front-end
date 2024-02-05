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
  selector: 'app-family-health',
  templateUrl: './family-health.component.html',
  styleUrls: ['./family-health.component.scss'],
})
export class FamilyHealthComponent {
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

  protected familyKinshipCatastrophicIllness: CatalogueModel[] = [];
  protected familyKinshipDisabilities: CatalogueModel[] = [];
  protected yesNo: CatalogueModel[] = [];

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
      }else{
        this.form.disable();
      }
    }

    this.loadFamilyKinshipCatastrophicIllness();
    this.loadFamilyKinshipDisabilities();
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
    this.studentsHttpService.updateFamilyHealth(
      this.id,
      this.form.value
    ).subscribe(() => this.next.emit());
  }

  validateForm() {
    this.formErrors = [];

    if (this.isFamilyCatastrophicIllnessField.errors) this.formErrors.push('Algun familiar tiene una enfermedad catastrofica');
    if (this.familyKinshipCatastrophicIllnessField.errors) this.formErrors.push('Que familiar tiene enfermedad');
    if (this.familyCatastrophicIllnessField.errors) this.formErrors.push('Tipo de enfemedad');
    if (this.isFamilyDisabilityField.errors) this.formErrors.push('Algun familiar tiene discapacidad');
    if (this.familyDisabilityPercentageField.errors) this.formErrors.push('Porcentaje');
    if (this.familyKinshipDisabilityField.errors) this.formErrors.push('Que familiar tiene discapacidad');

    this.formErrors.sort();

    this.validForm.emit(this.formErrors.length === 0 && this.form.valid);
    return this.formErrors.length === 0 && this.form.valid;
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      informationStudent: this.newInformationStudent,
    });
  }

  get newInformationStudent(): FormGroup {
    return this.formBuilder.group({
      isFamilyCatastrophicIllness: [null, [Validators.required]],
      familyKinshipCatastrophicIllness: [null],
      familyCatastrophicIllness: [null],
      isFamilyDisability: [null, [Validators.required]],
      familyDisabilityPercentage: [null],
      familyKinshipDisability: [null],
    });
  }

  loadFamilyKinshipCatastrophicIllness(): void {
    this.familyKinshipCatastrophicIllness = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.FAMILY_KINSHIP_CATASTROPHIC_ILLNESS
    );
  }

  loadFamilyKinshipDisabilities(): void {
    this.familyKinshipDisabilities = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY
    );
  }

  loadYesNo(): void {
    this.yesNo = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.YES_NO
    );
  }

  applyValidations() {
    this.isFamilyCatastrophicIllnessField.valueChanges.subscribe((value) => {
      if (value?.code === '1') {
        this.familyKinshipCatastrophicIllnessField.addValidators(Validators.required);
        this.familyCatastrophicIllnessField.addValidators(Validators.required);
      } else {
        this.familyKinshipCatastrophicIllnessField.removeValidators(Validators.required);
        this.familyCatastrophicIllnessField.removeValidators(Validators.required);
      }
      this.familyKinshipCatastrophicIllnessField.updateValueAndValidity();
      this.familyCatastrophicIllnessField.updateValueAndValidity();
    });

    this.isFamilyDisabilityField.valueChanges.subscribe((value) => {
      if (value?.code === '1') {
        this.familyDisabilityPercentageField.addValidators(Validators.required);
        this.familyKinshipDisabilityField.addValidators(Validators.required);
      } else {
        this.familyDisabilityPercentageField.removeValidators(Validators.required);
        this.familyKinshipDisabilityField.removeValidators(Validators.required);
      }
      this.familyDisabilityPercentageField.updateValueAndValidity();
      this.familyKinshipDisabilityField.updateValueAndValidity();
    });
  }

  get InformationStudentForm(): FormGroup {
    return this.form.controls['informationStudent'] as FormGroup;
  }

  get isFamilyCatastrophicIllnessField(): AbstractControl {
    return this.InformationStudentForm.controls['isFamilyCatastrophicIllness'];
  }

  get familyKinshipCatastrophicIllnessField(): AbstractControl {
    return this.InformationStudentForm.controls['familyKinshipCatastrophicIllness'];
  }

  get familyCatastrophicIllnessField(): AbstractControl {
    return this.InformationStudentForm.controls['familyCatastrophicIllness'];
  }

  get isFamilyDisabilityField(): AbstractControl {
    return this.InformationStudentForm.controls['isFamilyDisability'];
  }

  get familyDisabilityPercentageField(): AbstractControl {
    return this.InformationStudentForm.controls['familyDisabilityPercentage'];
  }

  get familyKinshipDisabilityField(): AbstractControl {
    return this.InformationStudentForm.controls['familyKinshipDisability'];
  }
}
