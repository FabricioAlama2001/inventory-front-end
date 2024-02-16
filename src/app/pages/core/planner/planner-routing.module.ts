import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'subactivities',
    loadChildren: () => import('./subactivity/subactivity.module').then(m => m.SubactivityModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.PLANNER]}
  },
  {
    path: 'project',
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.PLANNER]}
  },
  {
    path: 'component',
    loadChildren: () => import('./component/component.module').then(m => m.ComponentModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.PLANNER]}
  },
  {
    path: 'budget-items',
    loadChildren: () => import('./budget-item/budget-item.module').then(m => m.BudgetItemModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.PLANNER]}
  },
  {
    path: 'activity',
    loadChildren: () => import('./activity/activity.module').then(m => m.ActivityModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.PLANNER]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule {
}
