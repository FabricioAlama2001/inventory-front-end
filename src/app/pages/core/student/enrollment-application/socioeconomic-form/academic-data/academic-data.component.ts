import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PrimeIcons} from "primeng/api";
import {CatalogueModel, EnrollmentModel, StudentModel} from "@models/core";
import {CataloguesHttpService, CoreService, MessageService, RoutesService, StudentsHttpService} from "@services/core";
import {CatalogueEnrollmentStateEnum, CatalogueTypeEnum} from '@shared/enums';

@Component({
  selector: 'app-academic-data',
  templateUrl: './academic-data.component.html',
  styleUrls: ['./academic-data.component.scss']
})

export class AcademicDataComponent implements OnInit {
  @Input() student!: StudentModel;
  @Input() id!: string;
  @Input() enrollment!: EnrollmentModel;
  @Output() next: EventEmitter<number> = new EventEmitter<number>();
  @Output() previous: EventEmitter<number> = new EventEmitter<number>();
  @Output() validForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly Validators = Validators;
  protected form: FormGroup;
  protected formErrors: string[] = [];

  // Foreign Keys
  protected yesNo: CatalogueModel[] = [];
  protected universityCareers: CatalogueModel[] = [];
  protected typeSchools: CatalogueModel[] = [];
  protected degreeSuperiors: CatalogueModel[] = [];
  protected typeStudyOtherCareers: CatalogueModel[] = [];

  constructor(
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
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

    this.loadDegreeSuperiors();
    this.loadTypeSchools();
    this.loadTypeStudyOtherCareers();
    this.loadUniversityCareers();
    this.loadYesNo();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      informationStudent: this.newInformationStudentForm,
    });
  }

  get newInformationStudentForm(): FormGroup {
    return this.formBuilder.group({
      universityCareer: [null, [Validators.required]],
      isDegreeSuperior: [null, [Validators.required]],
      degreeSuperior: [null],
      isStudyOtherCareer: [null, [Validators.required]],
      nameStudyOtherCareer: [null],
      typeStudyOtherCareer: [null],
      typeSchool: [null, [Validators.required]]
    });
  }

  /** Actions **/

  onSubmit(): void {
    if (this.validateForm()) {
      this.update();
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  update() {
    this.studentsHttpService.updateAcademicData(
      this.id,
      this.form.value
    ).subscribe(() => this.next.emit());
  }

  validateForm() {
    this.formErrors = [];

    if (this.universityCareerField.errors) this.formErrors.push('Trayectoria universitaria');
    if (this.isDegreeSuperiorField.errors) this.formErrors.push('Tiene otro titulo');
    if (this.degreeSuperiorField.errors) this.formErrors.push('Que titulo posee');
    if (this.isStudyOtherCareerField.errors) this.formErrors.push('Estudia otra carrera?');
    if (this.nameStudyOtherCareerField.errors) this.formErrors.push('Nombre de la carrera');
    if (this.typeStudyOtherCareerField.errors) this.formErrors.push('Tipo de carrera');
    if (this.typeSchoolField.errors) this.formErrors.push('Tipo de colegio');

    this.formErrors.sort();

    this.validForm.emit(this.formErrors.length === 0 && this.form.valid);
    return this.formErrors.length === 0 && this.form.valid;
  }

  loadDegreeSuperiors(): void {
    this.degreeSuperiors = this.cataloguesHttpService.findByType(CatalogueTypeEnum.DEGREE_SUPERIOR);
  }

  loadTypeSchools(): void {
    this.typeSchools = this.cataloguesHttpService.findByType(CatalogueTypeEnum.TYPE_SCHOOL);
  }

  loadTypeStudyOtherCareers(): void {
    this.typeStudyOtherCareers = this.cataloguesHttpService.findByType(CatalogueTypeEnum.TYPE_STUDY_OTHER_CAREER);
  }

  loadUniversityCareers(): void {
    this.universityCareers = this.cataloguesHttpService.findByType(CatalogueTypeEnum.UNIVERSITY_CAREER);
  }

  loadYesNo(): void {
    this.yesNo = this.cataloguesHttpService.findByType(CatalogueTypeEnum.YES_NO);
  }

  applyValidations() {
    this.isDegreeSuperiorField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.degreeSuperiorField.addValidators(Validators.required);
      } else {
        this.degreeSuperiorField.removeValidators(Validators.required);
      }
      this.degreeSuperiorField.updateValueAndValidity();
    })

    this.isStudyOtherCareerField.valueChanges.subscribe(value => {
      if (value?.code === '1') {
        this.nameStudyOtherCareerField.addValidators(Validators.required);
        this.typeStudyOtherCareerField.addValidators(Validators.required);
      } else {
        this.nameStudyOtherCareerField.removeValidators(Validators.required);
        this.typeStudyOtherCareerField.removeValidators(Validators.required);

      }
      this.nameStudyOtherCareerField.updateValueAndValidity();
      this.typeStudyOtherCareerField.updateValueAndValidity();
    })
  }

  /** Form Getters **/
  /** Student Form **/
  get informationStudentForm(): FormGroup {
    return this.form.controls['informationStudent'] as FormGroup;
  }

  /** Information Student Form **/
  get universityCareerField(): AbstractControl {
    return this.informationStudentForm.controls['universityCareer'];
  }

  get isDegreeSuperiorField(): AbstractControl {
    return this.informationStudentForm.controls['isDegreeSuperior'];
  }

  get degreeSuperiorField(): AbstractControl {
    return this.informationStudentForm.controls['degreeSuperior'];
  }

  get isStudyOtherCareerField(): AbstractControl {
    return this.informationStudentForm.controls['isStudyOtherCareer'];
  }

  get nameStudyOtherCareerField(): AbstractControl {
    return this.informationStudentForm.controls['nameStudyOtherCareer'];
  }

  get typeStudyOtherCareerField(): AbstractControl {
    return this.informationStudentForm.controls['typeStudyOtherCareer'];
  }

  get typeSchoolField(): AbstractControl {
    return this.informationStudentForm.controls['typeSchool'];
  }
}
