import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-errors-field',
  templateUrl: './errors-field.component.html',
  styleUrls: ['./errors-field.component.scss']
})
export class ErrorsFieldComponent {
  @Input() errors: string[] = [];
}
