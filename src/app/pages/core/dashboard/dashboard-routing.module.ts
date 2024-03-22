import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./admin/admin.component";
import {PlannerComponent} from "./planner/planner.component";
import {DashboardComponent} from "./dashboard.component";
import {ApplicantComponent} from "./applicant/applicant.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'planner',
    component: PlannerComponent
  },
  {
    path: 'applicant',
    component: ApplicantComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
