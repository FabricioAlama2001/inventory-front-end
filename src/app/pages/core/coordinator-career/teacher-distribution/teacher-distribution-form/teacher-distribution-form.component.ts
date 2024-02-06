import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PrimeIcons} from 'primeng/api';
import {OnExitInterface} from '@shared/interfaces';
import {
  CatalogueModel,
  CareerModel,
  TeacherDistributionModel,
  TeacherModel,
  SchoolPeriodModel,
  SubjectModel
} from '@models/core';
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  MessageService,
  RoutesService,
  TeacherDistributionsHttpService,
  TeacherDistributionsService,
  SchoolPeriodsHttpService,
  SchoolPeriodsService,
  SubjectsHttpService,
  SubjectsService,
  TeachersHttpService,
  TeachersService,
  CareersHttpService,
  CareersService,
} from '@services/core';
import {BreadcrumbEnum, CatalogueTypeEnum, SkeletonEnum} from '@shared/enums';

@Component({
  selector: 'app-teacher-distribution-form',
  templateUrl: './teacher-distribution-form.component.html',
  styleUrls: ['./teacher-distribution-form.component.scss']
})
export class TeacherDistributionFormComponent implements OnInit, OnExitInterface {
  protected PrimeIcons = PrimeIcons;
  protected id: string | null = null;
  protected form: FormGroup;

  // Foreign Keys
  protected schoolPeriods: SchoolPeriodModel[] = [];
  protected subjects: SubjectModel[] = [];
  protected teachers: TeacherModel[] = [];
  protected careers: CareerModel[] = [];
  protected parallels: CatalogueModel[] = [];
  protected workdays: CatalogueModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    private formBuilder: FormBuilder,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private teacherDistributionsHttpService: TeacherDistributionsHttpService,
    private schoolPeriodsHttpService: SchoolPeriodsHttpService,
    private schoolPeriodsService: SchoolPeriodsService,
    private subjectsHttpService: SubjectsHttpService,
    private subjectsService: SubjectsService,
    private teachersService: TeachersService,
    private careersService: CareersService,
    private careersHttpService: CareersHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.TEACHER_DISTRIBUTIONS, routerLink: [this.routesService.teacherDistributions]},
      {label: BreadcrumbEnum.FORM},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
    }

    this.form = this.newForm;
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched && this.form.dirty) {
      return await this.messageService.questionOnExit().then((result: { isConfirmed: any; }) => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadParallels();
    this.loadWorkdays();
    this.loadTeachersByCareer();
    this.loadSchoolPeriods();
    this.loadSubjects();
    this.loadCareers();

    if (this.id) {
      this.get();
    }
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      parallel: [null, [Validators.required]],
      teacher: [this.teachersService.teacher, [Validators.required]],
      schoolPeriod: [this.schoolPeriodsService.openSchoolPeriod, [Validators.required]],
      subject: [this.subjectsService.subject, [Validators.required]],
      career: [this.careersService.career, [Validators.required]],
      workday: [null, [Validators.required]],
      hours: [null, []],
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
      this.messageService.errorsFields;
    }
  }

  back(): void {
    this.router.navigate([this.routesService.teacherDistributions]);
  }


  /** Actions **/
  create(item: TeacherDistributionModel): void {
    this.teacherDistributionsHttpService.create(item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  update(item: TeacherDistributionModel): void {
    this.teacherDistributionsHttpService.update(this.id!, item).subscribe(() => {
      this.form.reset();
      this.back();
    });
  }

  /** Load Data **/
  get(): void {
    this.teacherDistributionsHttpService.findOne(this.id!).subscribe((item: { [key: string]: any; }) => {
      this.form.patchValue(item);
    });
  }

  loadParallels(): void {
    this.parallels = this.cataloguesHttpService.findByType(CatalogueTypeEnum.PARALLEL);
  }

  loadWorkdays(): void {
    this.workdays = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ENROLLMENTS_WORKDAY);
  }

  loadTeachersByCareer(): void {
    this.careersHttpService.findTeachersByCareer('0b54590b-4822-4c18-91b0-24e8ef4627de')
      .subscribe((items: TeacherModel[]) => this.teachers = items);
  }

  loadSchoolPeriods(): void {
    this.schoolPeriodsHttpService.getAllSchoolPeriods()
      .subscribe((items: SchoolPeriodModel[]) => this.schoolPeriods = items);
  }

  loadSubjects(): void {
    this.subjectsHttpService.getAllSubjects()
      .subscribe((items: SubjectModel[]) => this.subjects = items);
  }

  loadCareers(): void {
    this.careersHttpService.getAllCareers()
      .subscribe((items: CareerModel[]) => this.careers = items);
  }

  /** Form Getters **/
  get hoursField(): AbstractControl {
    return this.form.controls['hours'];
  }

  get parallelField(): AbstractControl {
    return this.form.controls['parallel'];
  }

  get teacherField(): AbstractControl {
    return this.form.controls['teacher'];
  }

  get schoolPeriodField(): AbstractControl {
    return this.form.controls['schoolPeriod'];
  }

  get subjectField(): AbstractControl {
    return this.form.controls['subject'];
  }

  get careerField(): AbstractControl {
    return this.form.controls['career'];
  }

  get workdayField(): AbstractControl {
    return this.form.controls['workday'];
  }

  protected readonly SkeletonEnum = SkeletonEnum;
}
