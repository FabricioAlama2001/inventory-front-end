import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators,} from '@angular/forms';
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
import {CatalogueEnrollmentStateEnum, CatalogueTypeEnum,} from '@shared/enums';

@Component({
  selector: 'app-other-academic-data',
  templateUrl: './other-academic-data.component.html',
  styleUrls: ['./other-academic-data.component.scss'],
})
export class AdditionalDataFormComponent {
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

  protected electronicDevices: CatalogueModel[] = [];
  protected internetTypes: CatalogueModel[] = [];
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

    this.loadElectronicDevices();
    this.loadInternetTypes();
    this.loadYesNo();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      informationStudent: this.newInformationStudentForm,
    });
  }

  get newInformationStudentForm(): FormGroup {
    return this.formBuilder.group({
      isElectronicDevice: [null, [Validators.required]],
      electronicDevice: [null],
      isInternet: [null, [Validators.required]],
      internetType: [null],
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
    this.studentsHttpService.updateAdittionalEconomicData(
      this.id,
      this.form.value
    ).subscribe(() => this.next.emit());
  }

  validateForm() {
    this.formErrors = [];

    if (this.isElectronicDeviceField.errors) this.formErrors.push('Posee dispositivos electronicos');
    if (this.electronicDeviceField.errors) this.formErrors.push('Nombre del dispositvo');
    if (this.isInternetField.errors) this.formErrors.push('Posee internete');
    if (this.internetTypeField.errors) this.formErrors.push('Tipo de internet');

    this.formErrors.sort();

    this.validForm.emit(this.formErrors.length === 0 && this.form.valid);
    return this.formErrors.length === 0 && this.form.valid;
  }

  loadElectronicDevices(): void {
    this.electronicDevices = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.ELECTRONIC_DEVICE
    );
  }

  loadInternetTypes(): void {
    this.internetTypes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.INTERNET_TYPE
    );
  }

  loadYesNo(): void {
    this.yesNo = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.YES_NO
    );
  }

  applyValidations() {
    this.isElectronicDeviceField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.electronicDeviceField.addValidators(Validators.required);
      } else {
        this.electronicDeviceField.removeValidators(Validators.required);
      }
      this.electronicDeviceField.updateValueAndValidity();
    })

    this.isInternetField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.internetTypeField.addValidators(Validators.required);
      } else {
        this.internetTypeField.removeValidators(Validators.required);
      }
      this.internetTypeField.updateValueAndValidity();
    })
  }

  get informationStudentForm(): FormGroup {
    return this.form.controls['informationStudent'] as FormGroup;
  }

  get isElectronicDeviceField(): AbstractControl {
    return this.informationStudentForm.controls['isElectronicDevice'];
  }

  get electronicDeviceField(): AbstractControl {
    return this.informationStudentForm.controls['electronicDevice'];
  }

  get isInternetField(): AbstractControl {
    return this.informationStudentForm.controls['isInternet'];
  }

  get internetTypeField(): AbstractControl {
    return this.informationStudentForm.controls['internetType'];
  }
}
