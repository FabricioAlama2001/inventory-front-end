import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PrimeIcons} from 'primeng/api';
import {EnrollmentModel, StudentModel} from '@models/core';
import {
  BreadcrumbService,
  CataloguesHttpService,
  CoreService,
  MessageService,
  RoutesService,
  StudentsHttpService,
} from '@services/core';
import {CatalogueEnrollmentStateEnum, SkeletonEnum,} from '@shared/enums';
import {AuthService} from '@services/auth';
import {EnrollmentStateModel} from "@models/core/enrollment-state.model";

@Component({
  selector: 'app-socioeconomic-form',
  templateUrl: './socioeconomic-form.component.html',
  styleUrls: ['./socioeconomic-form.component.scss'],
})
export class SocioeconomicFormComponent implements OnInit {
  @Output() nextOut: EventEmitter<number> = new EventEmitter<number>();
  protected readonly CatalogueEnrollmentStateEnum = CatalogueEnrollmentStateEnum;
  protected readonly SkeletonEnum = SkeletonEnum;
  protected student!: StudentModel | null;
  protected readonly PrimeIcons = PrimeIcons;
  protected id: string | null = null;
  protected enrollment!: EnrollmentModel;
  protected isNew: boolean = true;
  protected registered: boolean = false;
  protected activeIndex: number = 0;
  protected enrollmentState!: EnrollmentStateModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    protected coreService: CoreService,
    protected messageService: MessageService,
    private router: Router,
    private routesService: RoutesService,
    private studentsHttpService: StudentsHttpService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.get();
    this.findEnrollmentByStudent();
  }

  /** Load Data **/
  get(): void {
    this.student = null;
    this.studentsHttpService
      .findOne(this.authService.auth.student.id)
      .subscribe((student) => {
        this.student = student;
      });
  }

  findEnrollmentByStudent() {
    this.studentsHttpService.findEnrollmentByStudent(this.authService.auth.student.id)
      .subscribe(enrollment => {
        this.enrollment = enrollment;

        this.isNew = !enrollment;

        if (this.enrollment?.enrollmentStates) {
          this.registered = true;
          this.enrollmentState = this.enrollment?.enrollmentStates[0]!;
        }
      });
  }

  next() {
    this.activeIndex++;
  }

  previous() {
    this.activeIndex--;
  }
}
