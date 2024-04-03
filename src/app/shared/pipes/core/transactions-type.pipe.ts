import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'transactionType'
})
export class TransactionTypePipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'INGRESOS' : 'EGRESOS';
  }

}
