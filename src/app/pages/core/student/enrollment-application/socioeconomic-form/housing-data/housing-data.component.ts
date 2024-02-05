import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {PrimeIcons, MenuItem} from 'primeng/api';
import {CatalogueModel, EnrollmentModel, StudentModel} from '@models/core';
import {
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
  selector: 'app-housing-data',
  templateUrl: './housing-data.component.html',
  styleUrls: ['./housing-data.component.scss']
})
export class HousingDataComponent {
  @Input() student!: StudentModel;
  @Input() id!: string;
  @Input() enrollment!: EnrollmentModel;
  @Output() next: EventEmitter<StudentModel> = new EventEmitter<StudentModel>();
  @Output() previous: EventEmitter<number> = new EventEmitter<number>();
  @Output() validForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected readonly Validators = Validators;
  protected readonly PrimeIcons = PrimeIcons;
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected consumeNewsTypes: CatalogueModel[] = [];
  protected economicContributions: CatalogueModel[] = [];
  protected electricServiceBlackouts: CatalogueModel[] = [];
  protected homeFloors: CatalogueModel[] = [];
  protected homeOwnerships: CatalogueModel[] = [];
  protected homeRoofs: CatalogueModel[] = [];
  protected homeTypes: CatalogueModel[] = [];
  protected homeWalls: CatalogueModel[] = [];
  protected sewerageServiceTypes: CatalogueModel[] = [];
  protected studentLives: CatalogueModel[] = [];
  protected waterServiceTypes: CatalogueModel[] = [];
  protected yesNo: CatalogueModel[] = [];

  constructor(
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private studentsHttpService: StudentsHttpService
  ) {

    this.form = this.newForm;
    this.applyValidations();
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

    this.loadConsumeNewsTypes();
    this.loadEconomicContributions();
    this.loadElectricServiceBlackouts();
    this.loadHomeFloors();
    this.loadHomeOwnerships();
    this.loadHomeRoofs();
    this.loadHomeTypes();
    this.loadHomeWalls();
    this.loadSewerageServiceTypes();
    this.loadStudentLives();
    this.loadWaterServiceTypes();
    this.loadYesNo();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      informationStudent: this.newInformationStudentForm,
    });
  }

  get newInformationStudentForm(): FormGroup {
    return this.formBuilder.group({
      studentLive: [null, [Validators.required]],
      homeOwnership: [null, [Validators.required]],
      homeType: [null, [Validators.required]],
      homeRoof: [null, [Validators.required]],
      homeFloor: [null, [Validators.required]],
      homeWall: [null, [Validators.required]],
      isWaterService: [null, [Validators.required]],
      waterServiceType: [null],
      isElectricService: [null, [Validators.required]],
      electricServiceBlackout: [null],
      isPhoneService: [null, [Validators.required]],
      isSewerageService: [null, [Validators.required]],
      sewerageServiceType: [null],
      economicContribution: [null, [Validators.required]],
      isFamilyEconomicAid: [null, [Validators.required]],
      consumeNewsType: [null, [Validators.required]]
    });
  }


  applyValidations() {
    this.isWaterServiceField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.waterServiceTypeField.addValidators(Validators.required);
      } else {
        this.waterServiceTypeField.removeValidators(Validators.required);
      }
      this.waterServiceTypeField.updateValueAndValidity();
    })

    this.isElectricServiceField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.electricServiceBlackoutField.addValidators(Validators.required);
      } else {
        this.electricServiceBlackoutField.removeValidators(Validators.required);
      }
      this.electricServiceBlackoutField.updateValueAndValidity();
    })

    this.isSewerageServiceField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.sewerageServiceTypeField.addValidators(Validators.required);
      } else {
        this.sewerageServiceTypeField.removeValidators(Validators.required);
      }
      this.sewerageServiceTypeField.updateValueAndValidity();
    })
  }

  loadConsumeNewsTypes(): void {
    this.consumeNewsTypes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.CONSUME_NEWS_TYPE
    );
  }

  loadEconomicContributions(): void {
    this.economicContributions = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.ECONOMIC_CONTRIBUTION
    );
  }

  loadElectricServiceBlackouts(): void {
    this.electricServiceBlackouts = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.ELECTRIC_SERVICE_BLACKOUT
    );
  }

  loadHomeFloors(): void {
    this.homeFloors = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.HOME_FLOOR
    );
  }

  loadHomeOwnerships(): void {
    this.homeOwnerships = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.HOME_OWNERSHIP
    );
  }

  loadHomeRoofs(): void {
    this.homeRoofs = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.HOME_ROOF
    );
  }

  loadHomeTypes(): void {
    this.homeTypes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.HOME_TYPE
    );
  }

  loadHomeWalls(): void {
    this.homeWalls = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.HOME_WALL
    );
  }

  loadSewerageServiceTypes(): void {
    this.sewerageServiceTypes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.SEWERAGE_SERVICE_TYPE
    );
  }

  loadStudentLives(): void {
    this.studentLives = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.STUDENT_LIVE
    );
  }

  loadWaterServiceTypes(): void {
    this.waterServiceTypes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.WATER_SERVICE_TYPE
    );
  }

  loadYesNo(): void {
    this.yesNo = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.YES_NO
    );
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
    this.studentsHttpService.updateHousingData(
      this.id,
      this.form.value
    ).subscribe(() => this.next.emit());
  }


  validateForm() {
    this.formErrors = [];

    if (this.studentLiveField.errors) this.formErrors.push('Con quien vive el estudiante');
    if (this.homeOwnershipField.errors) this.formErrors.push('Tipo de vivienda');
    if (this.homeTypeField.errors) this.formErrors.push('Tipo de casa');
    if (this.homeRoofField.errors) this.formErrors.push('Tipo de techo');
    if (this.homeFloorField.errors) this.formErrors.push('Tipo de piso');
    if (this.homeWallField.errors) this.formErrors.push('Tipo de pared');
    if (this.isWaterServiceField.errors) this.formErrors.push('posee servicio de agua');
    if (this.waterServiceTypeField.errors) this.formErrors.push('TIpo de servicio de aguas');
    if (this.isSewerageServiceField.errors) this.formErrors.push('Posee servicio de alcantarillado');
    if (this.sewerageServiceTypeField.errors) this.formErrors.push('Tipo de servicio de alcantarillado');
    if (this.isElectricServiceField.errors) this.formErrors.push('Posee servicio electrico');
    if (this.electricServiceBlackoutField.errors) this.formErrors.push('Frecuencia de apagones');
    if (this.isPhoneServiceField.errors) this.formErrors.push('Posee servicio telefonico');
    if (this.economicContributionField.errors) this.formErrors.push('Recibe aportes');
    if (this.isFamilyEconomicAidField.errors) this.formErrors.push('Beca o bono');
    if (this.consumeNewsTypeField.errors) this.formErrors.push('En que medios consume noticias');

    this.formErrors.sort();
    this.validForm.emit(this.formErrors.length === 0 && this.form.valid);
    return this.formErrors.length === 0 && this.form.valid;
  }

  get informationStudentForm(): FormGroup {
    return this.form.controls['informationStudent'] as FormGroup;
  }

  get studentLiveField(): AbstractControl {
    return this.informationStudentForm.controls['studentLive'];
  }

  get homeOwnershipField(): AbstractControl {
    return this.informationStudentForm.controls['homeOwnership'];
  }

  get homeTypeField(): AbstractControl {
    return this.informationStudentForm.controls['homeType'];
  }

  get homeRoofField(): AbstractControl {
    return this.informationStudentForm.controls['homeRoof'];
  }

  get homeFloorField(): AbstractControl {
    return this.informationStudentForm.controls['homeFloor'];
  }

  get homeWallField(): AbstractControl {
    return this.informationStudentForm.controls['homeWall'];
  }

  get isWaterServiceField(): AbstractControl {
    return this.informationStudentForm.controls['isWaterService'];
  }

  get waterServiceTypeField(): AbstractControl {
    return this.informationStudentForm.controls['waterServiceType'];
  }

  get isSewerageServiceField(): AbstractControl {
    return this.informationStudentForm.controls['isSewerageService'];
  }

  get sewerageServiceTypeField(): AbstractControl {
    return this.informationStudentForm.controls['sewerageServiceType'];
  }

  get isElectricServiceField(): AbstractControl {
    return this.informationStudentForm.controls['isElectricService'];
  }

  get electricServiceBlackoutField(): AbstractControl {
    return this.informationStudentForm.controls['electricServiceBlackout'];
  }

  get isPhoneServiceField(): AbstractControl {
    return this.informationStudentForm.controls['isPhoneService'];
  }

  get economicContributionField(): AbstractControl {
    return this.informationStudentForm.controls['economicContribution'];
  }

  get isFamilyEconomicAidField(): AbstractControl {
    return this.informationStudentForm.controls['isFamilyEconomicAid'];
  }

  get consumeNewsTypeField(): AbstractControl {
    return this.informationStudentForm.controls['consumeNewsType'];
  }
}
