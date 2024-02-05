import { Component } from '@angular/core';
import {BreadcrumbService} from "@services/core";

@Component({
  selector: 'app-coordinator-administrative',
  templateUrl: './coordinator-administrative.component.html',
  styleUrls: ['./coordinator-administrative.component.scss']
})
export class CoordinatorAdministrativeComponent {
  constructor(private breadcrumbService:BreadcrumbService) {
    breadcrumbService.setItems([{label: 'Dashboard'}])
  }
}
