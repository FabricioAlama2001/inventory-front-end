import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  CareersService, CataloguesHttpService,
  CoreService,
  CurriculumsHttpService,
  CurriculumsService,
  EnrollmentsHttpService,
  MessageService, SchoolPeriodsService, StudentsHttpService, SubjectsService
} from "@services/core";
import {MenuItem, PrimeIcons} from 'primeng/api';
import {
  ColumnModel,
  SubjectModel,
  CurriculumModel,
  CareerModel,
  StudentModel,
  CatalogueModel,
  EnrollmentModel,
  SchoolPeriodModel
} from '@models/core';
import {
  IdButtonActionEnum,
  LabelButtonActionEnum,
  IconButtonActionEnum,
  ClassButtonActionEnum,
  CatalogueTypeEnum, CatalogueEnrollmentStateEnum
} from "@shared/enums";
import {AuthService} from "@services/auth";

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  @Output() nextOut: EventEmitter<number> = new EventEmitter<number>();
  @Output() previousOut: EventEmitter<number> = new EventEmitter<number>();
  // Reference Prime Icons
  protected readonly PrimeIcons = PrimeIcons;

  // Button Actions Enum
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;

  protected buttonActions: MenuItem[] = [];

  // Columns of table
  protected columns: ColumnModel[] = this.buildColumns;

  // Flag actions buttons is enabled
  protected isButtonActions: boolean = false;

  // Flag upload files is enabled
  protected isFileList: boolean = false;

  // Administrator Data
  protected selectedItem!: SubjectModel;
  protected selectedItems: SubjectModel[] = [];
  protected items: SubjectModel[] = [];

  // Foreign Keys
  protected selectedCurriculum: FormControl = new FormControl();
  protected careers: CareerModel[] = [];
  protected curriculums: CurriculumModel[] = [];
  protected workdays: CatalogueModel[] = [];
  protected parallels: CatalogueModel[] = [];
  protected schoolPeriods: SchoolPeriodModel[] = [];

  protected student!: StudentModel;
  protected totalCredits: number = 0;
  protected enrollment!: EnrollmentModel;

  protected form: FormGroup;
  protected formErrors: string[] = [];

  constructor(
    private readonly authService: AuthService,
    protected readonly coreService: CoreService,
    private readonly careersService: CareersService,
    private readonly cataloguesHttpService: CataloguesHttpService,
    private readonly curriculumsHttpService: CurriculumsHttpService,
    private readonly curriculumsService: CurriculumsService,
    private readonly subjectsService: SubjectsService,
    private readonly enrollmentsHttpService: EnrollmentsHttpService,
    private readonly formBuilder: FormBuilder,
    private readonly studentsHttpService: StudentsHttpService,
    protected readonly messageService: MessageService,
    protected readonly schoolPeriodsService: SchoolPeriodsService,
  ) {
    this.student = authService.auth.student;
    if (subjectsService.enrollmentSubjects)
      this.selectedItems = subjectsService.enrollmentSubjects;

    this.careers = this.careersService.careers;

    this.form = this.newForm;

    this.careerField.patchValue(this.careersService.career);

    this.curriculums = this.careersService.career.curriculums;

    this.schoolPeriods = [this.schoolPeriodsService.openSchoolPeriod];
    this.schoolPeriodField.patchValue(this.schoolPeriodsService.openSchoolPeriod);

    if (this.curriculums.length > 0) {
      this.selectedCurriculum.patchValue(this.curriculums[0]);
      this.curriculumsService.curriculum = this.curriculums[0];
      this.findSubjectsAllByCurriculum();
    }

    this.careerField.valueChanges.subscribe(selectedCareer => {
      this.items = [];
      this.curriculumsService.curriculum = {};

      if (selectedCareer.curriculums.length > 0) {
        this.selectedCurriculum.patchValue(selectedCareer.curriculums[0]);
        this.curriculumsService.curriculum = selectedCareer.curriculums[0];
        this.curriculums = selectedCareer.curriculums;
        this.findSubjectsAllByCurriculum();
      }
    });

    this.workdayField.valueChanges.subscribe(value => {
      this.parallels = this.cataloguesHttpService.findByType(CatalogueTypeEnum.PARALLEL).filter(parallel => parallel.parentId === value.id);
    });
  }

  ngOnInit(): void {
    this.findEnrollmentByStudent();

    this.loadWorkdays();
  }

  get newForm() {
    return this.formBuilder.group({
      student: [this.student, [Validators.required]],
      academicPeriod: [null, [Validators.required]],
      career: [null, [Validators.required]],
      enrollmentDetails: [[], [Validators.required]],
      parallel: [null, [Validators.required]],
      schoolPeriod: [null, [Validators.required]],
      workday: [null, [Validators.required]],
    })
  }

  get buildColumns(): ColumnModel[] {
    return [
      {field: 'code', header: 'Código'},
      {field: 'name', header: 'Nombre'},
      {field: 'hours', header: 'Horas Doc. / Prac. / Aut.'},
      {field: 'academicPeriod', header: 'Periodo académico'},
      {field: 'academicState', header: 'Estado académico'},
      {field: 'state', header: 'Estado matrícula'}
    ];
  }

  get buildButtonActions() {
    return [
      {
        id: IdButtonActionEnum.UPDATE,
        label: LabelButtonActionEnum.UPDATE,
        icon: IconButtonActionEnum.UPDATE,
        command: () => {
          // if (this.selectedItem?.id) this.redirectEditForm(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.HIDE,
        label: LabelButtonActionEnum.HIDE,
        icon: IconButtonActionEnum.HIDE,
        command: () => {
          // if (this.selectedItem?.id) this.hide(this.selectedItem.id);
        },
      },
      {
        id: IdButtonActionEnum.REACTIVATE,
        label: LabelButtonActionEnum.REACTIVATE,
        icon: IconButtonActionEnum.REACTIVATE,
        command: () => {
          // if (this.selectedItem?.id) this.reactivate(this.selectedItem.id);
        },

      },
      {
        id: IdButtonActionEnum.FILE_LIST,
        label: LabelButtonActionEnum.FILE_LIST,
        icon: IconButtonActionEnum.FILE_LIST,
        command: () => {
          if (this.selectedItem?.id) this.isFileList = true;
        },

      }
    ];
  }

  /** Load Data **/
  findSubjectsAllByCurriculum() {
    this.curriculumsHttpService.findSubjectsAllByCurriculum(this.selectedCurriculum.value.id)
      .subscribe(subjects => {
        this.items = subjects.sort(function (a, b) {
          if (a.academicPeriod.code > b.academicPeriod.code) {
            return 1;
          }
          if (a.academicPeriod.code < b.academicPeriod.code) {
            return -1;
          }
          return 0;
        });
        this.findEnrollmentDetailByStudent();
      });
  }

  findEnrollmentDetailByStudent() {
    this.selectedItems = [];
    this.studentsHttpService.findEnrollmentDetailsByStudent(this.student.id)
      .subscribe(enrollmentDetails => {
        for (const item of this.items) {
          for (const enrollmentDetail of enrollmentDetails) {
            if (item.id === enrollmentDetail.subjectId) {
              item.academicState = enrollmentDetail.academicState?.code;
              item.enrollmentStates = enrollmentDetail.enrollmentDetailStates;
              this.selectedItems.push(item);
            }
          }
        }

        const enrollmentDetailLeveling = this.items.filter(enrollmentDetail => enrollmentDetail.type.code === 'leveling');

        const approvedLeveling = enrollmentDetailLeveling.every(enrollmentDetail => enrollmentDetail.academicState === 'a');

        if (enrollmentDetailLeveling.length === 0 || !approvedLeveling) {
          this.items = this.items.filter(item => item.type.code === 'leveling');
          this.selectedItems = this.items;
        }

        // this.items = subjects.sort(function (a, b) {
        //   if (a.academicPeriod.code > b.academicPeriod.code) {
        //     return 1;
        //   }
        //   if (a.academicPeriod.code < b.academicPeriod.code) {
        //     return -1;
        //   }
        //   return 0;
        // });

        this.selectItems();
      });
  }

  findEnrollmentByStudent() {
    this.studentsHttpService.findEnrollmentByStudent(this.student.id)
      .subscribe(enrollment => {
        this.enrollment = enrollment;
        if (this.enrollment) {
          this.workdayField.patchValue(enrollment.workday);
          this.parallelField.patchValue(enrollment.parallel);

          if (this.enrollment?.enrollmentState) {
            const registeredState = this.enrollment.enrollmentState.state.code === CatalogueEnrollmentStateEnum.REGISTERED;

            if (registeredState) { //reviewer
              this.form.enable();
              this.schoolPeriodField.enable();
              this.careerField.enable();
              this.selectedCurriculum.enable();
              this.workdayField.enable();
              this.parallelField.enable();
            } else {
              this.form.disable();
              this.schoolPeriodField.disable();
              this.careerField.disable();
              this.selectedCurriculum.disable();
              this.workdayField.disable();
              this.parallelField.disable();
            }
          }
        }
      });
  }

  loadWorkdays(): void {
    this.workdays = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENTS_WORKDAY);
  }

  /** Actions **/
  onSubmit(): void {
    this.enrollmentDetailsField.patchValue(this.selectedItems);
    this.calculateAcademicPeriod();

    if (this.validateForm()) {
      this.sendRegistration();
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields(this.formErrors);
    }
  }

  validateForm() {
    this.formErrors = [];

    // if (this.academicPeriodField.errors) this.formErrors.push('Nivel Académico');
    if (this.careerField.errors) this.formErrors.push('Carrera');
    if (this.enrollmentDetailsField.errors) this.formErrors.push('Asignaturas');
    if (this.workdayField.errors) this.formErrors.push('Jornada');
    if (this.parallelField.errors) this.formErrors.push('Paralelo');
    if (this.schoolPeriodField.errors) this.formErrors.push('Periodo Lectivo');
    // if (this.studentField.errors) this.formErrors.push('Estudiante');

    this.formErrors.sort();
    return this.formErrors.length === 0 && this.form.valid;
  }

  sendRegistration() {
    this.enrollmentsHttpService.sendRegistration(this.form.value).subscribe(enrollment => {
      this.findSubjectsAllByCurriculum();
      this.next();
    });
  }

  calculateAcademicPeriod() {
    this.selectedItems.sort(function (a, b) {
      if (a.academicPeriod.code > b.academicPeriod.code) {
        return 1;
      }
      if (a.academicPeriod.code < b.academicPeriod.code) {
        return -1;
      }
      return 0;
    });

    if (this.selectedItems.length > 0)
      this.academicPeriodField.patchValue(this.selectedItems[0].academicPeriod);
  }

  /** Select **/
  selectItem(item: SubjectModel) {
    this.isButtonActions = true;
    this.selectedItem = item;
    // this.subjectsService.subject = item;
    // this.validateButtonActions(item);
  }

  selectItems() {
    this.selectedItems = [...(new Set(this.selectedItems))];
    // this.totalCredits = this.selectedItems.reduce((accumulator, currentValue) => accumulator + currentValue.credits, 0);
    this.subjectsService.enrollmentSubjects = this.selectedItems;
  }

  previous() {
    this.previousOut.emit(-1);
  }

  next() {
    this.nextOut.emit(1);
  }

  /** Getteres Form **/

  get academicPeriodField() {
    return this.form.controls['academicPeriod'];
  }

  get careerField() {
    return this.form.controls['career'];
  }

  get parallelField() {
    return this.form.controls['parallel'];
  }

  get schoolPeriodField() {
    return this.form.controls['schoolPeriod'];
  }

  get workdayField() {
    return this.form.controls['workday'];
  }

  get enrollmentDetailsField() {
    return this.form.controls['enrollmentDetails'];
  }

  get studentField() {
    return this.form.controls['student'];
  }
}
