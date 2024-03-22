import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard, TokenGuard} from "@shared/guards";
import {RoleEnum} from "@shared/enums";

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
    data: {roles: [RoleEnum.PLANNER]}
  },
  {
    path: 'applicant',
    loadChildren: () => import('./applicant/applicant.module').then(m => m.ApplicantModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.APPLICANT]}
  },
  {
    path: 'catalogue',
    loadChildren: () => import('./catalogue/catalogue.module').then(m => m.CatalogueModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.CATALOGUE, RoleEnum.PLANNER]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
