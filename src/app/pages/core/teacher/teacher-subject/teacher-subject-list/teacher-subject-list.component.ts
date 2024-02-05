import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {MenuItem, PrimeIcons} from "primeng/api";

import { 
  ColumnModel,
  InstitutionModel,
  PaginatorModel,
  SelectEnrollmentDto,
  EnrollmentModel,
  SubjectModel,
  CareerModel,
  CatalogueModel,
  SchoolPeriodModel,
  TeacherDistributionModel
} from '@models/core';
import {
  BreadcrumbService,
  CareersHttpService,
  CareersService,
  CataloguesHttpService,
  CoreService,
  EnrollmentsHttpService,
  MessageService,
  RoutesService,
  SchoolPeriodsHttpService, SchoolPeriodsService, TeacherDistributionsHttpService, TeacherDistributionsService, TeachersHttpService
} from '@services/core';
import {
  IdButtonActionEnum,
  BreadcrumbEnum,
  CatalogueTypeEnum,
  ClassButtonActionEnum,
  IconButtonActionEnum,
  LabelButtonActionEnum,
  CatalogueEnrollmentStateEnum
} from "@shared/enums";
import { AuthService } from '@services/auth';
@Component({
  selector: 'app-teacher-subject-list',
  templateUrl: './teacher-subject-list.component.html',
  styleUrls: ['./teacher-subject-list.component.scss']
})
export class TeacherSubjectListComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;  
  
  protected readonly IconButtonActionEnum = IconButtonActionEnum;
  protected readonly LabelButtonActionEnum = LabelButtonActionEnum;
  protected readonly ClassButtonActionEnum = ClassButtonActionEnum;
  protected readonly BreadcrumbEnum = BreadcrumbEnum;
  // protected buttonActions: MenuItem[] = this.buildButtonActions;
  //protected columns: ColumnModel[] = this.buildColumns;
  protected isButtonActions: boolean = false;
  protected paginator: PaginatorModel;
  protected search: FormControl = new FormControl('');
  protected selectedItem: SelectEnrollmentDto = {};
  protected selectedItems: EnrollmentModel[] = [];
  protected items: TeacherDistributionModel[] = [];
  protected schoolPeriods: SchoolPeriodModel[] = [];
  protected careers: CareerModel[] = [];
  protected academicPeriods: CatalogueModel[] = [];
  protected selectedCareer: FormControl = new FormControl();
  protected selectedSchoolPeriod: FormControl = new FormControl();
  protected selectedAcademicPeriod: FormControl = new FormControl();
  protected state: CatalogueModel[] = [];
  protected isVisible: boolean = false;
  protected isFileList: boolean = false;
  protected fileTypes: CatalogueModel[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    public coreService: CoreService,
    public messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private enrollmentsHttpService: EnrollmentsHttpService,
    private cataloguesHttpService: CataloguesHttpService,
    private schoolPeriodsHttpService: SchoolPeriodsHttpService,
    private careersService: CareersService,
    private teacherDistributionsHttpService: TeacherDistributionsHttpService,
    private TeacherDistributionsService:TeacherDistributionsService,
    private schoolPeriodsService: SchoolPeriodsService,
    private authService: AuthService,
    private teachersHttpService:TeachersHttpService,
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.INSCRIPTIONS}]);

    this.paginator = this.coreService.paginator;

    this.search.valueChanges.subscribe(value => {
      if (value.length === 0) {
        this.findTeacherDistributionByTeacher();
      }
    });

    this.selectedSchoolPeriod.valueChanges.subscribe(value => {
      this.findTeacherDistributionByTeacher();
    });


    this.selectedAcademicPeriod.valueChanges.subscribe(value => {
      this.findTeacherDistributionByTeacher();
    });

    this.selectedSchoolPeriod.patchValue(this.schoolPeriodsService.openSchoolPeriod);

    this.selectedCareer.patchValue(this.careersService.career);
  }

  ngOnInit() {
    this.findTeacherDistributionByTeacher();
    this.findSchoolPeriods();
    this.findAcademicPeriods();
   
  }

  // findCareers() {
  //   this.careers = this.careersService.careers;
  // }

  //para llenar los selects o filtros
  findSchoolPeriods() {
    this.schoolPeriodsHttpService.findAll().subscribe(
      schoolPeriods => {
        this.schoolPeriods = schoolPeriods;
      }
    )
  }
  //para llenar los selects o filtros
  findAcademicPeriods() {
    this.academicPeriods = this.cataloguesHttpService.findByType(CatalogueTypeEnum.ACADEMIC_PERIOD);
  }

  /** Load Data **/
  findTeacherDistributionByTeacher(page: number = 0) {
    if (this.selectedSchoolPeriod.value) {
      this.teachersHttpService.findTeacherDistributionByTeacher( this.authService.auth.teacher.id!,this.selectedSchoolPeriod.value.id)
        .subscribe((data) => {
          this.items = data;
        });
    }
  } 

}