import {Component} from '@angular/core';
import {BreadcrumbService, RoutesService} from "@services/core";
import {
  IdButtonActionEnum,
  BreadcrumbEnum,
  IconButtonActionEnum,
  ClassButtonActionEnum,
  LabelButtonActionEnum
} from "@shared/enums";

@Component({
  selector: 'app-enrollment-subject-list',
  templateUrl: './enrollment-subject-list.component.html',
  styleUrls: ['./enrollment-subject-list.component.scss']
})
export class EnrollmentSubjectListComponent {
  protected readonly BreadcrumbEnum = BreadcrumbEnum;

  constructor(private readonly breadcrumbService: BreadcrumbService,
              private readonly routesService: RoutesService,) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.ENROLLMENT_SUBJECTS},
    ]);
    console.log('asd');
  }
}
