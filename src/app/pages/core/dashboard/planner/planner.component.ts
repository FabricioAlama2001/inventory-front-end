import { Component } from '@angular/core';
import {BreadcrumbService} from "@services/core";

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent {
  constructor(private breadcrumbService:BreadcrumbService) {
    breadcrumbService.setItems([{label: 'Dashboard'}])
  }
}
