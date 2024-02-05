import {Pipe, PipeTransform} from '@angular/core';
import {CatalogueModel} from "@models/core";

@Pipe({
  name: 'requiredSeverity'
})
export class RequiredSeverityPipe implements PipeTransform {

  transform(value: boolean): string {
    return value  ? 'danger' : 'info';
  }

}
