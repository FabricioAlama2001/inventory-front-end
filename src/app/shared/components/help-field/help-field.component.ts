import { Component } from '@angular/core';
import {PrimeIcons} from "primeng/api";

@Component({
  selector: 'app-help-field',
  templateUrl: './help-field.component.html',
  styleUrls: ['./help-field.component.scss']
})
export class HelpFieldComponent {

    protected readonly PrimeIcons = PrimeIcons;
}
