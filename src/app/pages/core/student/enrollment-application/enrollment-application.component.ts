import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PrimeIcons, MenuItem} from "primeng/api";
import {EnrollmentModel, StudentModel} from "@models/core";
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  MessageService,
  RoutesService, SchoolPeriodsService,
  StudentsHttpService
} from "@services/core";
import {BreadcrumbEnum, CatalogueEnrollmentStateEnum, SkeletonEnum} from '@shared/enums';
import {AuthService} from "@services/auth";
import {isAfter, isBefore, isEqual} from "date-fns";

@Component({
  selector: 'app-enrollment-application',
  templateUrl: './enrollment-application.component.html',
  styleUrls: ['./enrollment-application.component.scss']
})
export class EnrollmentApplicationComponent implements OnInit {
  protected readonly CatalogueEnrollmentStateEnum = CatalogueEnrollmentStateEnum;
  protected readonly PrimeIcons = PrimeIcons;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected id: string | null = null;
  protected items: MenuItem[] = [];
  protected enrollment!: EnrollmentModel;
  protected student!: StudentModel;
  protected activeIndex: number = 0;
  protected enabled: boolean = true;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly cataloguesHttpService: CataloguesHttpService,
    protected readonly coreService: CoreService,
    protected readonly schoolPeriodsService: SchoolPeriodsService,
    protected readonly messageService: MessageService,
    private readonly router: Router,
    private readonly routesService: RoutesService,
    private readonly studentsHttpService: StudentsHttpService
  ) {
    this.breadcrumbService.setItems([{label: BreadcrumbEnum.ENROLLMENT_REQUEST}]);

    this.student = authService.auth.student;

    const currentDate = new Date();
    const especialEndedAt = new Date(`${schoolPeriodsService.openSchoolPeriod.especialEndedAt} 00:00:00`);
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);

    especialEndedAt.setHours(0);
    especialEndedAt.setMinutes(0);
    especialEndedAt.setSeconds(0);

    if (isAfter(currentDate, especialEndedAt)
      || isEqual(currentDate, especialEndedAt)
    ) {
      this.enabled = false;
    }
  }

  ngOnInit(): void {
    this.findEnrollmentByStudent();
  }

  /** Load Data **/
  findEnrollmentByStudent() {
    this.studentsHttpService.findEnrollmentByStudent(this.student.id)
      .subscribe(enrollment => {
        this.enrollment = enrollment;
      });
  }

  next() {
    this.activeIndex++;
  }

  previous() {
    this.activeIndex--;
  }
}
