import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'selected'
})
export class SelecetedPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Seleccionado' : '';
  }

}
