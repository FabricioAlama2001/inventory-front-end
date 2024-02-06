import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PrimeIcons} from "primeng/api";
import {OnExitInterface} from "@shared/interfaces";
import {CatalogueModel, TeacherModel} from "@models/core";
import {UserModel} from '@models/auth';
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  MessageService,
  RoutesService,
  TeachersHttpService
} from "@services/core";
import {BreadcrumbEnum, CatalogueTypeEnum, SkeletonEnum} from "@shared/enums";

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit, OnExitInterface {
  protected readonly PrimeIcons = PrimeIcons;
  protected id: string | null = null;
  protected form: FormGroup;

  // Foreign Keys Information Teacher
  protected states: CatalogueModel[] = [];
  protected teacher: TeacherModel[] = [];
  protected countryHigherEducation: CatalogueModel[] = [];
  protected higherEducation: CatalogueModel[] = [];
  protected scholarship: CatalogueModel[] = [];
  protected scholarshipType: CatalogueModel[] = [];
  protected teachingLadder: CatalogueModel[] = [];

  // Foreign Keys User
  protected bloodTypes: CatalogueModel[] = [];
  protected ethnicOrigins: CatalogueModel[] = [];
  protected genders: CatalogueModel[] = [];
  protected sexes: CatalogueModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private teachersHttpService: TeachersHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.TEACHERS, routerLink: [this.routesService.teachersCoordinatorCareer]},
      {label: BreadcrumbEnum.FORM},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
    }

    this.form = this.teacherForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched && this.form.dirty) {
      return await this.messageService.questionOnExit().then((result: { isConfirmed: any; }) => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    if (this.id) {
      this.get();
    }
    this.loadBloodTypes();
    this.loadEthnicOrigins();
    this.loadGenders();
    this.loadSexes();
  }

  get teacherForm(): FormGroup {
    return this.formBuilder.group({
      informationTeacher: this.informationTeacherForm,
      user: this.userForm,
    });
  }

  get informationTeacherForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],

      countryHigherEducation: [null, [Validators.required]],
      higherEducation: [null, [Validators.required]],
      scholarship: [null, [Validators.required]],
      scholarshipType: [null, [Validators.required]],
      teachingLadder: [null, [Validators.required]],

      academicUnit: [null, [Validators.required]],
      administrativeHours: [null, [Validators.required]],
      classHours: [null, [Validators.required]],
      communityHours: [null, [Validators.required]],
      degreeHigherEducation: [null, [Validators.required]],
      hoursWorked: [null, [Validators.required]],
      holidays: [null, [Validators.required]],
      homeVacation: [null, [Validators.required]],
      institutionHigherEducation: [null, [Validators.required]],
      investigationHours: [null, [Validators.required]],
      otherHours: [null, [Validators.required]],
      publications: [null, [Validators.required]],
      scholarshipAmount: [null, [Validators.required]],
      totalSubjects: [null, [Validators.required]],
      technical: [null, [Validators.required]],
      technology: [null, [Validators.required]],
      totalPublications: [null, [Validators.required]],
    })
  }

  get userForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      email: [null, [Validators.email, Validators.required]],
      birthdate: [null, [Validators.required]],
      identification: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      personalEmail: [null, [Validators.email, Validators.required]],
      phone: [null, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      bloodType: [null, [Validators.required]],
      ethnicOrigin: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      sex: [null, [Validators.required]]
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
      this.messageService.errorsFields();
    }
  }

  back(): void {
    this.router.navigate([this.routesService.teachersCoordinatorCareer]);
  }

  /** Actions **/
  create(item: TeacherModel): void {
    this.teachersHttpService.create(item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  update(item: TeacherModel): void {
    this.teachersHttpService.update(this.id!, item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  /** Load Data **/
  get(): void {
    this.teachersHttpService.findOne(this.id!).subscribe((teacher: { [key: string]: any; }) => {
      this.form.patchValue(teacher);
    });
  }

  loadBloodTypes(): void {
    this.bloodTypes = this.cataloguesHttpService.findByType(CatalogueTypeEnum.BLOOD_TYPE);
  }

  loadEthnicOrigins(): void {
    this.ethnicOrigins = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ETHNIC_ORIGIN);
  }

  loadGenders(): void {
    this.genders = this.cataloguesHttpService.findByType(CatalogueTypeEnum.GENDER);
  }

  loadSexes(): void {
    this.sexes = this.cataloguesHttpService.findByType(CatalogueTypeEnum.SEX);
  }

  /** Form Getters **/

  /** Teachers Form **/
  get informationTeachersField(): FormGroup {
    return this.form.controls['informationTeacher'] as FormGroup;
  }

  get userField(): FormGroup {
    return this.form.controls['user'] as FormGroup;
  }

  /** Information Teachers Form **/

  get teacherField(): AbstractControl {
    return this.informationTeachersField.controls['teacher'];
  }

  get countryHigherEducationField(): AbstractControl {
    return this.informationTeachersField.controls['countryHigherEducation'];
  }

  get higherEducationField(): AbstractControl {
    return this.informationTeachersField.controls['higherEducation'];
  }

  get scholarshipField(): AbstractControl {
    return this.informationTeachersField.controls['scholarship'];
  }

  get scholarshipTypeField(): AbstractControl {
    return this.informationTeachersField.controls['scholarshipType'];
  }

  get teachingLadderField(): AbstractControl {
    return this.informationTeachersField.controls['teachingLadder'];
  }

  get academicUnitField(): AbstractControl {
    return this.informationTeachersField.controls['academicUnit'];
  }

  get administrativeHoursField(): AbstractControl {
    return this.informationTeachersField.controls['administrativeHours'];
  }

  get classHoursField(): AbstractControl {
    return this.informationTeachersField.controls['classHours'];
  }

  get communityHoursField(): AbstractControl {
    return this.informationTeachersField.controls['communityHours'];
  }

  get degreeHigherEducationField(): AbstractControl {
    return this.informationTeachersField.controls['degreeHigherEducation'];
  }

  get hoursWorkedField(): AbstractControl {
    return this.informationTeachersField.controls['hoursWorked'];
  }

  get holidaysField(): AbstractControl {
    return this.informationTeachersField.controls['holidays'];
  }

  get publicationsField(): AbstractControl {
    return this.informationTeachersField.controls['publications'];
  }

  get homeVacationField(): AbstractControl {
    return this.informationTeachersField.controls['homeVacation'];
  }

  get institutionHigherEducationField(): AbstractControl {
    return this.informationTeachersField.controls['institutionHigherEducation'];
  }

  get investigationHoursField(): AbstractControl {
    return this.informationTeachersField.controls['investigationHours'];
  }

  get otherHoursField(): AbstractControl {
    return this.informationTeachersField.controls['otherHours'];
  }

  get scholarshipAmountField(): AbstractControl {
    return this.informationTeachersField.controls['scholarshipAmount'];
  }

  get stateField(): AbstractControl {
    return this.informationTeachersField.controls['state'];
  }

  get totalSubjectsField(): AbstractControl {
    return this.informationTeachersField.controls['totalSubjects'];
  }

  get technicalField(): AbstractControl {
    return this.informationTeachersField.controls['technical'];
  }

  get technologyField(): AbstractControl {
    return this.informationTeachersField.controls['technology'];
  }

  get totalPublicationsField(): AbstractControl {
    return this.informationTeachersField.controls['totalPublications'];
  }

  /** User Form **/

  get emailField(): AbstractControl {
    return this.userField.controls['email'];
  }

  get birthdateField(): AbstractControl {
    return this.userField.controls['birthdate'];
  }

  get identificationField(): AbstractControl {
    return this.userField.controls['identification'];
  }

  get lastnameField(): AbstractControl {
    return this.userField.controls['lastname'];
  }

  get personalEmailField(): AbstractControl {
    return this.userField.controls['personalEmail'];
  }

  get phoneField(): AbstractControl {
    return this.userField.controls['phone'];
  }

  get nameField(): AbstractControl {
    return this.userField.controls['name'];
  }

  get usernameField(): AbstractControl {
    return this.userField.controls['username'];
  }

  get bloodTypeField(): AbstractControl {
    return this.userField.controls['bloodType'];
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

  get passwordField(): AbstractControl {
    return this.userField.controls['password'];
  }

  get passwordChangedField(): AbstractControl {
    return this.userField.controls['passwordChanged'];
  }

  protected readonly SkeletonEnum = SkeletonEnum;
}



