import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PrimeIcons, MenuItem} from 'primeng/api';
import {OnExitInterface} from '@shared/interfaces';
import {CatalogueModel, EnrollmentModel, StudentModel} from '@models/core';
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  MessageService,
  RoutesService,
  StudentsHttpService,
} from '@services/core';
import {
  BreadcrumbEnum, CatalogueEnrollmentStateEnum,
  CatalogueTypeEnum,
  SkeletonEnum,
} from '@shared/enums';

@Component({
  selector: 'app-psychosocial-section',
  templateUrl: './psychosocial-section.component.html',
  styleUrls: ['./psychosocial-section.component.scss']
})
export class PsychosocialSectionComponent implements OnInit{
  @Output() next: EventEmitter<number> = new EventEmitter<number>();
  @Input() student!: StudentModel;
  @Input() id!: string;
  @Input() enrollment!: EnrollmentModel;
  @Output() previous: EventEmitter<number> = new EventEmitter<number>();
  @Output() validForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly Validators = Validators;
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected pandemicPsychologicalEffects: CatalogueModel[] = []
  protected socialGroups: CatalogueModel[] = [];
  protected typeDiscriminations: CatalogueModel[] = [];
  protected typeGenderViolences: CatalogueModel[] = [];
  protected typeInjuries: CatalogueModel[] = [];
  protected yesNo: CatalogueModel[] = []

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
    this.applyValidations();
  }

  ngOnInit(): void {
    this.form.patchValue(this.student);

    this.validateForm();

    if (this.enrollment?.enrollmentStates) {
      if (this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REGISTERED ||
        this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REJECTED) { //reviewer
        this.form.enable();
      }else{
        this.form.disable();
      }
    }

    this.loadPandemicPsychologicalEffects();
    this.loadSocialGroups();
    this.loadTypeDiscriminations();
    this.loadTypeGenderViolences();
    this.loadTypeInjuries();
    this.loadYesNo();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      informationStudent: this.newInformationStudentForm,
    });
  }

  get newInformationStudentForm(): FormGroup {
    return this.formBuilder.group({
      additionalInformation: [null],
      isDiscrimination: [null, [Validators.required]],
      isGenderViolence: [null, [Validators.required]],
      isInjuries: [null, [Validators.required]],
      pandemicPsychologicalEffect: [null, [Validators.required]],
      socialGroup: [null, [Validators.required]],
      typeDiscrimination: [null],
      typeGenderViolence: [null],
      typeInjuries: [null],
    });
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
    this.studentsHttpService.updatePsychosocialSection(
      this.id,
      this.form.value
    ).subscribe(() => this.next.emit());
  }

  validateForm() {
    this.formErrors = [];

    if (this.additionalInformationField.errors) this.formErrors.push('Información Adcional');
    if (this.isDiscriminationField.errors) this.formErrors.push('Alguna vez ha sido usted objeto de discriminación');
    if (this.isGenderViolenceField.errors) this.formErrors.push('Usted alguna vez ha sido víctima de violencia de género');
    if (this.isInjuriesField.errors) this.formErrors.push('Alguna vez ha tenido pensamientos o ha intentado hacerse daño a sí mismo');
    if (this.pandemicPsychologicalEffectField.errors) this.formErrors.push('¿Qué efectos psicosociales le dejo la pandemia (COVID-19)?');
    if (this.socialGroupField.errors) this.formErrors.push('Tribu urbana o grupo social pertenece');
    if (this.typeDiscriminationField.errors) this.formErrors.push('Tipo de discriminación');
    if (this.typeGenderViolenceField.errors) this.formErrors.push('Tipo de violencia');
    if (this.typeInjuriesField.errors) this.formErrors.push('Tipo de autolesiones');

    this.formErrors.sort();

    this.validForm.emit(this.formErrors.length === 0 && this.form.valid);
    return this.formErrors.length === 0 && this.form.valid;
  }

  loadPandemicPsychologicalEffects(): void {
    this.pandemicPsychologicalEffects = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT
    );
  }

  loadSocialGroups(): void {
    this.socialGroups = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.SOCIAL_GROUP
    );
  }

  loadTypeDiscriminations(): void {
    this.typeDiscriminations = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.TYPE_DISCRIMINATION
    );
  }

  loadTypeGenderViolences(): void {
    this.typeGenderViolences = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.TYPE_GENDER_VIOLENCE
    );
  }

  loadTypeInjuries(): void {
    this.typeInjuries = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.TYPE_INJURIES
    );
  }

  loadYesNo(): void {
    this.yesNo = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.YES_NO
    );
  }

  applyValidations() {
    this.isDiscriminationField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.typeDiscriminationField.addValidators(Validators.required);
      } else {
        this.typeDiscriminationField.removeValidators(Validators.required);
      }
      this.typeDiscriminationField.updateValueAndValidity();
    })

    this.isGenderViolenceField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.typeGenderViolenceField.addValidators(Validators.required);
      } else {
        this.typeGenderViolenceField.removeValidators(Validators.required);
      }
      this.typeGenderViolenceField.updateValueAndValidity();
    })

    this.isInjuriesField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.typeInjuriesField.addValidators(Validators.required);
      } else {
        this.typeInjuriesField.removeValidators(Validators.required);
      }
      this.typeInjuriesField.updateValueAndValidity();
    })
  }

  get informationStudentForm(): FormGroup {
    return this.form.controls['informationStudent'] as FormGroup;
  }

  get additionalInformationField(): AbstractControl {
    return this.informationStudentForm.controls['additionalInformation'];
  }

  get isDiscriminationField(): AbstractControl {
    return this.informationStudentForm.controls['isDiscrimination'];
  }

  get isGenderViolenceField(): AbstractControl {
    return this.informationStudentForm.controls['isGenderViolence'];
  }

  get isInjuriesField(): AbstractControl {
    return this.informationStudentForm.controls['isInjuries'];
  }

  get pandemicPsychologicalEffectField(): AbstractControl {
    return this.informationStudentForm.controls['pandemicPsychologicalEffect'];
  }

  get socialGroupField(): AbstractControl {
    return this.informationStudentForm.controls['socialGroup'];
  }

  get typeDiscriminationField(): AbstractControl {
    return this.informationStudentForm.controls['typeDiscrimination'];
  }

  get typeGenderViolenceField(): AbstractControl {
    return this.informationStudentForm.controls['typeGenderViolence'];
  }

  get typeInjuriesField(): AbstractControl {
    return this.informationStudentForm.controls['typeInjuries'];
  }
}
