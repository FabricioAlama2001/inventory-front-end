import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {FormBuilder, AbstractControl, Validators, FormGroup} from '@angular/forms';
import {
  CatalogueModel,
  EnrollmentDetailModel,
  SelectEnrollmentDetailDto,
  SubjectModel
} from '@models/core';
import {OnExitInterface} from '@shared/interfaces';
import {PrimeIcons} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  EnrollmentsHttpService,
  MessageService,
  RoutesService,
  SubjectsHttpService,
} from '@services/core';

import {
  BreadcrumbEnum,
  CatalogueTypeEnum,
  ClassButtonActionEnum,
  SkeletonEnum,
  LabelButtonActionEnum,
  IconButtonActionEnum, CatalogueEnrollmentStateEnum
} from '@shared/enums';
import {EnrollmentDetailsHttpService} from '@services/core';

@Component({
  selector: 'app-inscription-detail-form',
  templateUrl: './inscription-detail-form.component.html',
  styleUrls: ['./inscription-detail-form.component.scss']
})
export class InscriptionDetailFormComponent implements OnInit, OnExitInterface {
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected enrollmentId!: string;
  protected id: string | null = null;
  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected selectedItem: SelectEnrollmentDetailDto = {};
  protected selectedItems: EnrollmentDetailModel[] = [];
  protected items: EnrollmentDetailModel[] = [];

  // Foreign Keys
  protected parallels: CatalogueModel[] = [];
  protected states: CatalogueModel[] = [];
  protected types: CatalogueModel[] = [];
  protected workdays: CatalogueModel[] = [];
  protected subjects: SubjectModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private location: Location,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private enrollmentDetailsHttpService: EnrollmentDetailsHttpService,
    private subjectsHttpService: SubjectsHttpService,
  ) {
    this.enrollmentId = activatedRoute.snapshot.params['enrollmentId'];

    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSCRIPTIONS, routerLink: [this.routesService.inscriptions]},
      {
        label: BreadcrumbEnum.INSCRIPTION_DETAILS,
        routerLink: [this.routesService.inscriptionsDetailList(this.enrollmentId)]
      },
      {label: BreadcrumbEnum.FORM},
    ]);

    this.form = this.newForm;

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.subjectField.disable();
      this.observationField.removeValidators(Validators.required);
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched && this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadParallels();
    this.loadStates();
    this.loadWorkdays();
    this.loadTypes();
    this.loadSubjects();

    if (this.id) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      number: [null, [Validators.required, Validators.min(1), Validators.maxLength(3)]],
      date: [{value: null, disabled: true}],
      enrollmentId: this.enrollmentId,
      subject: [null],
      type: [null, [Validators.required]],
      workday: [null, [Validators.required]],
      parallel: [null, [Validators.required]],
      observation: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
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

  back(): void {
    this.router.navigate([this.routesService.inscriptionsDetailList(this.enrollmentId)]);
  }

  /** Actions **/
  create(enrollmentDetail: EnrollmentDetailModel): void {
    this.enrollmentDetailsHttpService.create(enrollmentDetail).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  update(enrollmentDetail: EnrollmentDetailModel): void {
    this.enrollmentDetailsHttpService.update(this.id!, enrollmentDetail).subscribe(() => {
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
    this.enrollmentDetailsHttpService.findOne(this.id!).subscribe((enrollment) => {
      this.form.patchValue(enrollment);
      if (this.dateField.value)
        this.dateField.setValue(new Date(this.dateField.value));

      if (enrollment.enrollmentDetailState.state.code === CatalogueEnrollmentStateEnum.ENROLLED ||
        enrollment.enrollmentDetailState.state.code === CatalogueEnrollmentStateEnum.REVOKED) {
        this.form.disable();
      }
    });
  }

  /** Load Enrollment Details Data **/

  loadStates(): void {
    this.states = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENTS_STATE);
  }

  loadParallels(): void {
    this.parallels = this.cataloguesHttpService.findByType(CatalogueTypeEnum.PARALLEL);
  }

  loadWorkdays(): void {
    this.workdays = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENTS_WORKDAY);
  }

  loadTypes(): void {
    this.types = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENTS_TYPE);
  }

  loadSubjects(): void {
    this.subjectsHttpService.getAllSubjects()
      .subscribe((items) => this.subjects = items);
  }

  validateForm() {
    this.formErrors = [];
    if (this.dateField.errors) this.formErrors.push('Fecha');
    if (this.typeField.errors) this.formErrors.push('Tipo');
    if (this.workdayField.errors) this.formErrors.push(' Jornada');
    if (this.parallelField.errors) this.formErrors.push('Paralelo');
    if (this.observationField.errors) this.formErrors.push('Observación');
    if (this.numberField.errors) this.formErrors.push('Número');

    this.formErrors.sort();
    return this.formErrors.length === 0 && this.form.valid;
  }


  /** Form Getters **/
  get subjectField(): AbstractControl {
    return this.form.controls['subject'];
  }

  get dateField(): AbstractControl {
    return this.form.controls['date'];
  }

  get numberField(): AbstractControl {
    return this.form.controls['number'];
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

  get observationField(): AbstractControl {
    return this.form.controls['observation'];
  }

  protected readonly Validators = Validators;
}
