import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard, TokenGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [TokenGuard]
  },
  {
    path: 'dashboards',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [TokenGuard]
  },
  {
    path: 'planner',
    loadChildren: () => import('./planner/planner.module').then(m => m.PlannerModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
