import {Pipe, PipeTransform} from '@angular/core';
import {CatalogueSchoolPeriodStateEnum} from "@shared/enums";

@Pipe({
  name: 'schoolPeriodsState'
})
export class SchoolPeriodsStatePipe implements PipeTransform {

  transform(value: string): string {
    return value === CatalogueSchoolPeriodStateEnum.OPEN ? 'info' : 'warning';
  }

}
