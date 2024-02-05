import {Pipe, PipeTransform} from '@angular/core';
import {CatalogueModel} from "@models/core";

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(value: string): string {
    return value === 'enabled' ? 'HABILITADO' : 'INHABILITADO';
  }

}
