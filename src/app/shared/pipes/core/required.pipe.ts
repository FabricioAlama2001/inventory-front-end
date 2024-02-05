import {Pipe, PipeTransform} from '@angular/core';
import {CatalogueModel} from "@models/core";

@Pipe({
  name: 'required'
})
export class RequiredPipe implements PipeTransform {

  transform(value: boolean): string {
    return value  ? 'Obligatorio' : 'Opcional';
  }

}
