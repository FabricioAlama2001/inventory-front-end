import {Component} from '@angular/core';
import {RoleModel} from "@models/auth";
import {AuthService} from "@services/auth";
import {RoleEnum} from "@shared/enums";
import {Router} from "@angular/router";
import {RoutesService} from "@services/core";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  protected role!: RoleModel;

  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly routesService: RoutesService,
  ) {
    this.role = authService.role;

    this.redirectDashboard();
  }

  redirectDashboard() {
    switch (this.role.code) {
      case RoleEnum.ADMIN:
        this.routesService.dashboardAdmin();
        break;
      case RoleEnum.PLANNER:
        this.routesService.dashboardPlanner();
        break;
      case RoleEnum.APPLICANT:
        this.routesService.dashboardApplicant();
        break;
    }
  }
}
