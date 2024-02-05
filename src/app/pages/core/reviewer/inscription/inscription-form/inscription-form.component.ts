import {Location} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {FormBuilder, AbstractControl, Validators, FormGroup} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {CatalogueModel, EnrollmentModel, SelectEnrollmentDto} from '@models/core';
import {OnExitInterface} from '@shared/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  EnrollmentsHttpService,
  MessageService,
  RoutesService,
} from '@services/core';
import {
  BreadcrumbEnum,
  CatalogueTypeEnum,
  ClassButtonActionEnum,
  SkeletonEnum,
  LabelButtonActionEnum,
  IconButtonActionEnum, CatalogueEnrollmentStateEnum
} from '@shared/enums';

@Component({
  selector: 'app-inscription-form',
  templateUrl: './inscription-form.component.html',
  styleUrls: ['./inscription-form.component.scss']
})
export class InscriptionFormComponent implements OnInit, OnExitInterface {
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected id: string | null = null;
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected selectedItem: SelectEnrollmentDto = {};
  protected selectedItems: EnrollmentModel[] = [];
  protected items: EnrollmentModel[] = [];

  // Foreign Keys
  protected academicPeriods: CatalogueModel[] = [];
  protected parallels: CatalogueModel[] = [];
  protected states: CatalogueModel[] = [];
  protected types: CatalogueModel[] = [];
  protected workdays: CatalogueModel[] = [];

  protected enrolled: boolean = false;
  protected approved: boolean = false;
  protected revoked: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private location: Location,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSCRIPTIONS, routerLink: [this.routesService.inscriptions]},
      {label: BreadcrumbEnum.FORM},
    ]);

    this.form = this.newForm;

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched && this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadAcademicPeriods();
    this.loadParallels();
    this.loadStates();
    this.loadWorkdays();
    this.loadTypes();

    if (this.id) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      student: this.newStudentForm,
      states: this.newStateForm,
      date: [{value: null, disabled: true}],
      academicPeriod: [null, [Validators.required]],
      type: [null, [Validators.required]],
      workday: [null, [Validators.required]],
      parallel: [null, [Validators.required]],
      code: [{value: null, disabled: true}],
      observation: [null],
      socioeconomicCategory: [{value: null, disabled: true}],
      socioeconomicPercentage: [{value: null, disabled: true}],
      socioeconomicScore: [{value: null, disabled: true}],
      enrollmentState: [{value: null, disabled: true}],
    });
  }

  get newStudentForm(): FormGroup {
    return this.formBuilder.group({
      informationStudent: [{value: null, disabled: true}],
      user: this.newUserForm,
    });
  }

  get newUserForm(): FormGroup {
    return this.formBuilder.group({
      identification: [{value: null, disabled: true}],
      lastname: [{value: null, disabled: true}],
      name: [{value: null, disabled: true}],
      email: [{value: null, disabled: true}],
      personalEmail: [{value: null, disabled: true}],
      cellPhone: [{value: null, disabled: true}],
      phone: [{value: null, disabled: true}],
    });
  }

  get newStateForm(): FormGroup {
    return this.formBuilder.group({
      state: [{value: null, disabled: true}],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id) {
        if (this.enrollmentStateField.value)
          this.update();
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  back(): void {
    this.router.navigate([this.routesService.inscriptions]);
  }

  /** Actions **/
  create(enrollment: EnrollmentModel): void {
    this.enrollmentsHttpService.create(enrollment).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  update(): void {
    this.enrollmentsHttpService.update(this.id!, this.form.value).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  updateApproved(): void {
    this.enrollmentsHttpService.updateEnrolled(this.id!, this.form.value).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  updateEnrolled(): void {
    this.enrollmentsHttpService.updateEnrolled(this.id!, this.form.value).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  approve() {
    this.enrollmentsHttpService.approve(this.id!).subscribe(item => {
      this.back();
    });
  }

  reject() {
    this.enrollmentsHttpService.reject(this.id!).subscribe(item => {
      this.back();
    });
  }

  get(): void {
    this.enrollmentsHttpService.findOne(this.id!).subscribe((enrollment) => {
      this.form.patchValue(enrollment);
      if (this.dateField.value)
        this.dateField.setValue(new Date(this.dateField.value));

      this.validateEnrollmentState(enrollment);
    });
  }

  /** Load Enrollment Details Data **/

  loadStates(): void {
    this.states = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENTS_STATE);
  }

  loadParallels(): void {
    this.parallels = this.cataloguesHttpService.findByType(CatalogueTypeEnum.PARALLEL);
  }

  loadAcademicPeriods(): void {
    this.academicPeriods = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ACADEMIC_PERIOD);
  }

  loadWorkdays(): void {
    this.workdays = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENTS_WORKDAY);
  }

  loadTypes(): void {
    this.types = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENTS_TYPE);
  }

  validateForm() {
    this.formErrors = [];
    if (this.identificationField.errors) this.formErrors.push('identification');
    if (this.lastnameField.errors) this.formErrors.push('lastname');
    if (this.nameField.errors) this.formErrors.push('name');
    if (this.emailField.errors) this.formErrors.push('email');
    if (this.personalEmailField.errors) this.formErrors.push('personalEmail');
    if (this.cellPhoneField.errors) this.formErrors.push('cellPhone');
    if (this.phoneField.errors) this.formErrors.push('phone');
    if (this.academicPeriodField.errors) this.formErrors.push('academicPeriod');
    if (this.dateField.errors) this.formErrors.push('date');
    if (this.typeField.errors) this.formErrors.push('type');
    if (this.workdayField.errors) this.formErrors.push(' workday');
    if (this.parallelField.errors) this.formErrors.push('parallel');
    if (this.codeField.errors) this.formErrors.push('code');

    this.formErrors.sort();
    return this.formErrors.length === 0 && this.form.valid;
  }

  validateEnrollmentState(enrollment: EnrollmentModel) {
    if (enrollment.enrollmentState) {
      this.approved = enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.APPROVED;

      this.enrolled = enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.ENROLLED;

      this.revoked = enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REVOKED;

      if (this.approved) {
        this.form.disable();
        this.parallelField.enable();
        this.workdayField.enable();
      }

      if (this.enrolled || this.revoked) {
        this.form.disable();
      }
    }
  }

  /** Form Getters **/
  get academicPeriodField(): AbstractControl {
    return this.form.controls['academicPeriod'];
  }

  get dateField(): AbstractControl {
    return this.form.controls['date'];
  }

  get typeField(): AbstractControl {
    return this.form.controls['type'];
  }

  get workdayField(): AbstractControl {
    return this.form.controls['workday'];
  }

  get parallelField(): AbstractControl {
    return this.form.controls['parallel'];
  }

  get codeField(): AbstractControl {
    return this.form.controls['code'];
  }

  get observationField(): AbstractControl {
    return this.form.controls['observation'];
  }

  get enrollmentStateField(): AbstractControl {
    return this.form.controls['enrollmentState'];
  }

  get studentForm(): FormGroup {
    return this.form.controls['student'] as FormGroup;
  }

  get userForm(): FormGroup {
    return this.studentForm.controls['user'] as FormGroup;
  }

  get identificationField(): AbstractControl {
    return this.userForm.controls['identification'];
  }

  get lastnameField(): AbstractControl {
    return this.userForm.controls['lastname'];
  }

  get nameField(): AbstractControl {
    return this.userForm.controls['name'];
  }

  get emailField(): AbstractControl {
    return this.userForm.controls['email'];
  }

  get personalEmailField(): AbstractControl {
    return this.userForm.controls['personalEmail'];
  }

  get cellPhoneField(): AbstractControl {
    return this.userForm.controls['cellPhone'];
  }

  get phoneField(): AbstractControl {
    return this.userForm.controls['phone'];
  }

  get stateForm(): FormGroup {
    return this.form.controls['states'] as FormGroup;
  }

  get stateField(): AbstractControl {
    return this.stateForm.controls['state'];
  }

  get socioeconomicCategoryField(): AbstractControl {
    return this.form.controls['socioeconomicCategory'];
  }

  get socioeconomicPercentageField(): AbstractControl {
    return this.form.controls['socioeconomicPercentage'];
  }

  get socioeconomicScoreField(): AbstractControl {
    return this.form.controls['socioeconomicScore'];
  }
}
