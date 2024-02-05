import { Component } from '@angular/core';
import {BreadcrumbService} from "@services/core";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent {
  constructor(private breadcrumbService:BreadcrumbService) {
    breadcrumbService.setItems([{label: 'Dashboard'}])
  }
}
