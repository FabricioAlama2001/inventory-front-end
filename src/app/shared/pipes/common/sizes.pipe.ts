import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fileSizes'
})
export class SizesPipe implements PipeTransform {

  transform(value: string): string {
    const size = parseFloat(value) / 1024;
    if (size > 1024) {
      return `${(size / 1024).toFixed(2)} MB`
    } else {
      return `${size.toFixed(2)} KB`;
    }
  }

}
