import { Component } from '@angular/core';
import {BreadcrumbEnum} from "@shared/enums";
import {BreadcrumbService, RoutesService} from "@services/core";

@Component({
  selector: 'app-parallel-capacity',
  templateUrl: './parallel-capacity.component.html',
  styleUrls: ['./parallel-capacity.component.scss']
})
export class ParallelCapacityComponent {

  constructor(private breadcrumbService: BreadcrumbService,private routesService: RoutesService,) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONS, routerLink: routesService.institutions},
      {label: BreadcrumbEnum.CAREERS, routerLink: [this.routesService.careers]},
      {label: BreadcrumbEnum.PARALLEL},
    ]);
  }
}
