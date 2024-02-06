import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard, TokenGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'dashboards',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [TokenGuard]
  },
  {
    path: 'coordinator-career',
    loadChildren: () => import('./coordinator-career/coordinator-career.module').then(m => m.CoordinatorCareerModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
  {
    path: 'events',
    loadChildren: () => import('./event/event.module').then(m => m.EventModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
