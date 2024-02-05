import { Component, OnInit } from '@angular/core';
import {format} from "date-fns";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  protected readonly Date = Date;
  protected readonly format = format;
}
