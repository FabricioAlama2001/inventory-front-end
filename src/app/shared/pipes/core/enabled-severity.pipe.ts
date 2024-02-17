import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'enabledSeverity'
})
export class EnabledSeverityPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? '' : 'danger';
  }

}
