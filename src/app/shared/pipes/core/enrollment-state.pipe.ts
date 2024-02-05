import {Pipe, PipeTransform} from '@angular/core';
import {CatalogueModel} from "@models/core";
import {CatalogueEnrollmentStateEnum} from "@shared/enums";

@Pipe({
  name: 'enrollmentState'
})
export class EnrollmentStatePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case CatalogueEnrollmentStateEnum.REGISTERED:
        return 'warning';
      case CatalogueEnrollmentStateEnum.REQUEST_SENT:
        return 'info';
      case CatalogueEnrollmentStateEnum.APPROVED:
        return '';
      case CatalogueEnrollmentStateEnum.REJECTED:
        return 'danger';
      case CatalogueEnrollmentStateEnum.ENROLLED:
        return 'success';
      default:
        return 'secondary'
    }
  }

}
