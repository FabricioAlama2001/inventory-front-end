import { Component } from '@angular/core';
import {BreadcrumbService} from "@services/core";

@Component({
  selector: 'app-coordinator-career',
  templateUrl: './coordinator-career.component.html',
  styleUrls: ['./coordinator-career.component.scss']
})
export class CoordinatorCareerComponent {
  constructor(private breadcrumbService:BreadcrumbService) {
    breadcrumbService.setItems([{label: 'Dashboard'}])
  }
}
