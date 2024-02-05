import { Component } from '@angular/core';
import {BreadcrumbService} from "@services/core";

@Component({
  selector: 'app-rector',
  templateUrl: './rector.component.html',
  styleUrls: ['./rector.component.scss']
})
export class RectorComponent {
  constructor(private breadcrumbService:BreadcrumbService) {
    breadcrumbService.setItems([{label: 'Dashboard'}])
  }
}
