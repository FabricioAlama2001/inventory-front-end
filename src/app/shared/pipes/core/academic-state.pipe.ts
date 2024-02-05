import {Pipe, PipeTransform} from '@angular/core';
import {CatalogueModel} from "@models/core";

@Pipe({
  name: 'academicState'
})
export class AcademicStatePipe implements PipeTransform {

  transform(value: string): string {
    return value === 'a' ? 'Aprobado' : value === 'r' ? 'Reprobado' : 'Sin Estado';
  }

}
