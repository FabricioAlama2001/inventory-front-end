import {Component, Input} from '@angular/core';
import {PrimeIcons} from "primeng/api";

@Component({
  selector: 'app-visible',
  templateUrl: './visible.component.html',
  styleUrls: ['./visible.component.scss']
})
export class VisibleComponent {

  @Input() isVisible: boolean = false;
  protected readonly PrimeIcons = PrimeIcons;
}
