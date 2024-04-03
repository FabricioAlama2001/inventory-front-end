import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'transactionTypeSeverity'
})
export class TransactionTypeSeverityPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'success' : '';
  }

}
