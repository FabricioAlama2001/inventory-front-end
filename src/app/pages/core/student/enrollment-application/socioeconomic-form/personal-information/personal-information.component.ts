import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
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
import {CatalogueEnrollmentStateEnum, CatalogueEthnicOriginEnum, CatalogueTypeEnum, UsersFormEnum} from '@shared/enums';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit {
  @Input() student!: StudentModel;
  @Input() id!: string;
  @Input() enrollment!: EnrollmentModel;
  @Output() next: EventEmitter<StudentModel> = new EventEmitter<StudentModel>();
  @Output() validForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected form: FormGroup;
  protected formErrors: string[] = [];

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly CatalogueEthnicOriginEnum = CatalogueEthnicOriginEnum;
  protected readonly UsersFormEnum = UsersFormEnum;
  protected readonly Validators = Validators;

  protected ancestralLanguageNames: CatalogueModel[] = [];
  protected bloodTypes: CatalogueModel[] = [];
  protected contactEmergencyKinship: CatalogueModel[] = [];
  protected disabilityTypes: CatalogueModel[] = [];
  protected ethnicOrigins: CatalogueModel[] = [];
  protected foreignLanguageNames: CatalogueModel[] = [];
  protected genders: CatalogueModel[] = [];
  protected identificationTypes: CatalogueModel[] = [];
  protected indigenousNationalities: CatalogueModel[] = [];
  protected maritalStatus: CatalogueModel[] = [];
  protected monthlySalaries: CatalogueModel[] = [];
  protected nationalities: CatalogueModel[] = [];
  protected sexes: CatalogueModel[] = [];
  protected towns: CatalogueModel[] = [];
  protected workingHours: CatalogueModel[] = [];
  protected yesNo: CatalogueModel[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private studentsHttpService: StudentsHttpService
  ) {
    this.form = this.newForm;
    this.applyFormValidations();
  }

  ngOnInit(): void {
    this.form.patchValue(this.student);

    this.validateForm;

    if (this.enrollment?.enrollmentState) {
      if (this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REGISTERED ||
        this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REJECTED) { //reviewer
        this.form.enable();
      }else{
        this.form.disable();
      }
    }

    this.loadAncestralLanguageNames();
    this.loadBloodTypes();
    this.loadContactEmergencyKinship();
    this.loadDisabilityTypes();
    this.loadEthnicOrigins();
    this.loadForeignLanguageNames();
    this.loadGenders();
    this.loadIdentificationTypes();
    this.loadIndigenousNationalities();
    this.loadMaritalStatus();
    this.loadMonthlySalaries();
    this.loadNationalities();
    this.loadSexes();
    this.loadTowns();
    this.loadWorkingHours();
    this.loadYesNo();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      informationStudent: this.informationStudentForm,
      user: this.userForm,
    });
  }

  get informationStudentForm(): FormGroup {
    return this.formBuilder.group({
      contactEmergencyKinship: [null, [Validators.required]],
      contactEmergencyName: [null, [Validators.required]],
      contactEmergencyPhone: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      isDisability: [null, [Validators.required]],
      disabilityPercentage: [null],
      disabilityType: [null],
      isAncestralLanguage: [null, [Validators.required]],
      ancestralLanguageName: [null],
      isCatastrophicIllness: [null, [Validators.required]],
      catastrophicIllness: [null],
      isForeignLanguage: [null, [Validators.required]],
      foreignLanguageName: [null],
      isHasChildren: [null, [Validators.required]],
      childrenTotal: [null],
      isHouseHead: [null, [Validators.required]],
      isPrivateSecurity: [null, [Validators.required]],
      isSocialSecurity: [null, [Validators.required]],
      isWork: [null, [Validators.required]],
      monthlySalary: [null],
      workAddress: [null],
      workingHours: [null],
      workPosition: [null],
      town: [null],
      indigenousNationality: [null],
    });
  }

  get userForm(): FormGroup {
    return this.formBuilder.group({
      birthdate: [null, [Validators.required]],
      cellPhone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: [null, [Validators.required]],
      ethnicOrigin: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      identification: [null, [Validators.required]],
      identificationType: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      name: [null, [Validators.required]],
      nationality: [null, [Validators.required]],
      personalEmail: [null, [Validators.required]],
      phone: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      sex: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.validateForm) {
      this.update();
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  update() {
    this.studentsHttpService.updatePersonalInformation(
      this.id,
      this.form.value
    ).subscribe(() => this.next.emit());
  }

  get validateForm() {
    this.formErrors = [];

    if (this.isSocialSecurityField.errors) this.formErrors.push('Posee seguro social');
    if (this.isWorkField.errors) this.formErrors.push('El estudiante trabaja?');
    if (this.workAddressField.errors) this.formErrors.push('Direccion de la empresa');
    if (this.workPositionField.errors) this.formErrors.push('Cargo que posee');
    if (this.workingHoursField.errors) this.formErrors.push('Horario de trabajo');
    if (this.monthlySalaryField.errors) this.formErrors.push('Salario');
    if (this.isDisabilityField.errors) this.formErrors.push('Posee discapacidad');
    if (this.disabilityPercentageField.errors) this.formErrors.push('Porcentaje de discapacidad');
    if (this.disabilityTypeField.errors) this.formErrors.push('Tipo de discapacidad');
    if (this.isCatastrophicIllnessField.errors) this.formErrors.push('Posee enfermedades catastróficas');
    if (this.catastrophicIllnessField.errors) this.formErrors.push('Nombre de la enfermedad catastrofica');
    if (this.isHouseHeadField.errors) this.formErrors.push('Es jefe de familia?');
    if (this.isPrivateSecurityField.errors) this.formErrors.push('Posee seguro privado');
    if (this.contactEmergencyNameField.errors) this.formErrors.push('Nombre del contacto de emergencia');
    if (this.contactEmergencyKinshipField.errors) this.formErrors.push('Parentesco');
    if (this.contactEmergencyPhoneField.errors) this.formErrors.push('Numero de telefono de emergencia');
    if (this.isHasChildrenField.errors) this.formErrors.push('Tiene hijos');
    if (this.childrenTotalField.errors) this.formErrors.push('Numero de hijos');
    if (this.isAncestralLanguageField.errors) this.formErrors.push('Habla un lenguaje ancestral');
    if (this.ancestralLanguageNameField.errors) this.formErrors.push('Nombre del lenguaje ancestral');
    if (this.isForeignLanguageField.errors) this.formErrors.push('Habla un lenguaje extranjero');
    if (this.foreignLanguageNameField.errors) this.formErrors.push('Lenguaje extrajero');
    if (this.indigenousNationalityField.errors) this.formErrors.push('Nacionalidad indígena');
    if (this.townField.errors) this.formErrors.push('Pueblo');

    if (this.emailField.errors) this.formErrors.push('Correo');
    if (this.personalEmailField.errors) this.formErrors.push('Correo personal');
    if (this.cellPhoneField.errors) this.formErrors.push('Telefono celular');
    if (this.phoneField.errors) this.formErrors.push('Telefono Convencional');
    if (this.birthdateField.errors) this.formErrors.push('Fecha de nacimiento');
    if (this.maritalStatusField.errors) this.formErrors.push('Estado civil');
    if (this.identificationTypeField.errors) this.formErrors.push('Tipo de identificacion');
    if (this.lastnameField.errors) this.formErrors.push('Apellido');
    if (this.nameField.errors) this.formErrors.push('Nombre');
    if (this.nationalityField.errors) this.formErrors.push('Nacionalidad');
    if (this.identificationField.errors) this.formErrors.push('Identificación');
    if (this.ethnicOriginField.errors) this.formErrors.push(UsersFormEnum.ethnicOrigin);
    if (this.genderField.errors) this.formErrors.push('Genero');
    if (this.sexField.errors) this.formErrors.push('Sexo');

    this.formErrors.sort();
    this.validForm.emit(this.formErrors.length === 0 && this.form.valid);
    return this.formErrors.length === 0 && this.form.valid;
  }

  applyFormValidations() {
    this.isDisabilityField.valueChanges.subscribe((value) => {
      if (value?.code === '1') {
        this.disabilityPercentageField.addValidators(Validators.required);
        this.disabilityTypeField.addValidators(Validators.required);
      } else {
        this.disabilityPercentageField.removeValidators(Validators.required);
        this.disabilityTypeField.removeValidators(Validators.required);
      }
      this.disabilityPercentageField.updateValueAndValidity();
      this.disabilityTypeField.updateValueAndValidity();
    });

    this.ethnicOriginField.valueChanges.subscribe((value) => {
      if (value?.code === CatalogueEthnicOriginEnum.INDIGENOUS) {
        // this.indigenousNationalityField.addValidators(Validators.required);
        // this.townField.addValidators(Validators.required);
      } else {
        this.indigenousNationalityField.removeValidators(Validators.required);
        this.townField.removeValidators(Validators.required);
      }
      this.indigenousNationalityField.updateValueAndValidity();
      this.townField.updateValueAndValidity();
    });

    this.isCatastrophicIllnessField.valueChanges.subscribe((value) => {
      if (value?.code === '1') {
        this.catastrophicIllnessField.addValidators(Validators.required);
      } else {
        this.catastrophicIllnessField.removeValidators(Validators.required);
      }
      this.catastrophicIllnessField.updateValueAndValidity();
    });

    this.isAncestralLanguageField.valueChanges.subscribe((value) => {
      if (value?.code === '1') {
        this.ancestralLanguageNameField.addValidators(Validators.required);
      } else {
        this.ancestralLanguageNameField.removeValidators(Validators.required);
      }
      this.ancestralLanguageNameField.updateValueAndValidity();
    });

    this.isForeignLanguageField.valueChanges.subscribe((value) => {
      if (value?.code === '1') {
        this.foreignLanguageNameField.addValidators(Validators.required);
      } else {
        this.foreignLanguageNameField.removeValidators(Validators.required);
      }
      this.foreignLanguageNameField.updateValueAndValidity();
    });

    this.isWorkField.valueChanges.subscribe((value) => {
      if (value?.code === '1') {
        this.workAddressField.addValidators(Validators.required);
        this.monthlySalaryField.addValidators(Validators.required);
        this.workingHoursField.addValidators(Validators.required);
        this.workPositionField.addValidators(Validators.required);
      } else {
        this.workAddressField.removeValidators(Validators.required);
        this.monthlySalaryField.removeValidators(Validators.required);
        this.workingHoursField.removeValidators(Validators.required);
        this.workPositionField.removeValidators(Validators.required);
      }
      this.workAddressField.updateValueAndValidity();
      this.monthlySalaryField.updateValueAndValidity();
      this.workingHoursField.updateValueAndValidity();
      this.workPositionField.updateValueAndValidity();
    });

    this.isHasChildrenField.valueChanges.subscribe((value) => {
      if (value?.code === '1') {
        this.childrenTotalField.addValidators([Validators.required, Validators.min(1)]);
      } else {
        this.childrenTotalField.removeValidators([Validators.required, Validators.min(1)]);
      }
      this.childrenTotalField.updateValueAndValidity();
    });
  }

  loadAncestralLanguageNames() {
    this.ancestralLanguageNames = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME
    );
  }

  loadBloodTypes(): void {
    this.bloodTypes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.BLOOD_TYPE
    );
  }

  loadContactEmergencyKinship() {
    this.contactEmergencyKinship = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP
    );
  }

  loadDisabilityTypes(): void {
    this.disabilityTypes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.DISABILITY_TYPE
    );
  }

  loadEthnicOrigins(): void {
    this.ethnicOrigins = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.ETHNIC_ORIGIN
    );
  }

  loadForeignLanguageNames() {
    this.foreignLanguageNames = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME
    );
  }

  loadGenders(): void {
    this.genders = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.GENDER
    );
  }

  loadIdentificationTypes(): void {
    this.identificationTypes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.IDENTIFICATION_TYPE
    );
  }

  loadIndigenousNationalities() {
    this.indigenousNationalities = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.INDIGENOUS_NATIONALITY
    );
  }

  loadMaritalStatus(): void {
    this.maritalStatus = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.MARITAL_STATUS
    );
  }

  loadMonthlySalaries() {
    this.monthlySalaries = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.MONTHLY_SALARY
    );
  }

  loadNationalities() {
    this.nationalities = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.NATIONALITY
    );
  }

  loadSexes(): void {
    this.sexes = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.SEX
    );
  }

  loadTowns() {
    this.towns = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.TOWN
    );
  }

  loadWorkingHours() {
    this.workingHours = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.WORKING_HOURS
    );
  }

  loadYesNo() {
    this.yesNo = this.cataloguesHttpService.findByType(
      CatalogueTypeEnum.YES_NO
    );
  }

  // Getters Form
  get personalInformationField(): FormGroup {
    return this.form.controls['informationStudent'] as FormGroup;
  }

  get isSocialSecurityField(): AbstractControl {
    return this.personalInformationField.controls['isSocialSecurity'];
  }

  get workPositionField(): AbstractControl {
    return this.personalInformationField.controls['workPosition'];
  }

  get workingHoursField(): AbstractControl {
    return this.personalInformationField.controls['workingHours'];
  }

  get isDisabilityField(): AbstractControl {
    return this.personalInformationField.controls['isDisability'];
  }

  get disabilityPercentageField(): AbstractControl {
    return this.personalInformationField.controls['disabilityPercentage'];
  }

  get isCatastrophicIllnessField(): AbstractControl {
    return this.personalInformationField.controls['isCatastrophicIllness'];
  }

  get catastrophicIllnessField(): AbstractControl {
    return this.personalInformationField.controls['catastrophicIllness'];
  }

  get disabilityTypeField(): AbstractControl {
    return this.personalInformationField.controls['disabilityType'];
  }

  get isHasChildrenField(): AbstractControl {
    return this.personalInformationField.controls['isHasChildren'];
  }

  get isHouseHeadField(): AbstractControl {
    return this.personalInformationField.controls['isHouseHead'];
  }

  get isPrivateSecurityField(): AbstractControl {
    return this.personalInformationField.controls['isPrivateSecurity'];
  }

  get carnetNumberField(): AbstractControl {
    return this.personalInformationField.controls['carnetNumber'];
  }

  get contactEmergencyNameField(): AbstractControl {
    return this.personalInformationField.controls['contactEmergencyName'];
  }

  get contactEmergencyKinshipField(): AbstractControl {
    return this.personalInformationField.controls['contactEmergencyKinship'];
  }

  get contactEmergencyPhoneField(): AbstractControl {
    return this.personalInformationField.controls['contactEmergencyPhone'];
  }

  get isWorkField(): AbstractControl {
    return this.personalInformationField.controls['isWork'];
  }

  get workAddressField(): AbstractControl {
    return this.personalInformationField.controls['workAddress'];
  }

  get childrenTotalField(): AbstractControl {
    return this.personalInformationField.controls['childrenTotal'];
  }

  get monthlySalaryField(): AbstractControl {
    return this.personalInformationField.controls['monthlySalary'];
  }

  get isAncestralLanguageField(): AbstractControl {
    return this.personalInformationField.controls['isAncestralLanguage'];
  }

  get ancestralLanguageNameField(): AbstractControl {
    return this.personalInformationField.controls['ancestralLanguageName'];
  }

  get isForeignLanguageField(): AbstractControl {
    return this.personalInformationField.controls['isForeignLanguage'];
  }

  get foreignLanguageNameField(): AbstractControl {
    return this.personalInformationField.controls['foreignLanguageName'];
  }

  get indigenousNationalityField(): AbstractControl {
    return this.personalInformationField.controls['indigenousNationality'];
  }

  get townField(): AbstractControl {
    return this.personalInformationField.controls['town'];
  }

  get userField(): FormGroup {
    return this.form.controls['user'] as FormGroup;
  }

  get emailField(): AbstractControl {
    return this.userField.controls['email'];
  }

  get personalEmailField(): AbstractControl {
    return this.userField.controls['personalEmail'];
  }

  get cellPhoneField(): AbstractControl {
    return this.userField.controls['cellPhone'];
  }

  get phoneField(): AbstractControl {
    return this.userField.controls['phone'];
  }

  get birthdateField(): AbstractControl {
    return this.userField.controls['birthdate'];
  }

  get maritalStatusField(): AbstractControl {
    return this.userField.controls['maritalStatus'];
  }

  get identificationTypeField(): AbstractControl {
    return this.userField.controls['identificationType'];
  }

  get lastnameField(): AbstractControl {
    return this.userField.controls['lastname'];
  }

  get nameField(): AbstractControl {
    return this.userField.controls['name'];
  }

  get nationalityField(): AbstractControl {
    return this.userField.controls['nationality'];
  }

  get identificationField(): AbstractControl {
    return this.userField.controls['identification'];
  }

  get ethnicOriginField(): AbstractControl {
    return this.userField.controls['ethnicOrigin'];
  }

  get genderField(): AbstractControl {
    return this.userField.controls['gender'];
  }

  get sexField(): AbstractControl {
    return this.userField.controls['sex'];
  }
}
