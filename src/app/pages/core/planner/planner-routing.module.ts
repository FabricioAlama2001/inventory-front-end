import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RoleEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'subactivities',
    loadChildren: () => import('./subactivity/subactivity.module').then(m => m.SubactivityModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.PLANNER]}
  },
  {
    path: 'projects',
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.PLANNER]}
  },
  {
    path: 'components',
    loadChildren: () => import('./component/component.module').then(m => m.ComponentModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.PLANNER]}
  },
  {
    path: 'activities',
    loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.PLANNER]}
  },
  {
    path: 'poas',
    loadChildren: () => import('./poa/poa.module').then(m => m.PoaModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.PLANNER]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule {
}
