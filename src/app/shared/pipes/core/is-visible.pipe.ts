import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'isVisible'
})
export class IsVisiblePipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Es Visible' : 'Oculto';
  }

}
