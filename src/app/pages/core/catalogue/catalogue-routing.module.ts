import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'budget-items',
    loadChildren: () => import('./budget-item/budget-item.module').then(m => m.BudgetItemModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'expense-groups',
    loadChildren: () => import('./expense-group/expense-group.module').then(m => m.ExpenseGroupModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'expense-types',
    loadChildren: () => import('./expense-type/expense-type.module').then(m => m.ExpenseTypeModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'pnd-objectives',
    loadChildren: () => import('./pnd-objective/pnd-objective.module').then(m => m.PndObjectiveModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'pnd-polices',
    loadChildren: () => import('./pnd-police/pnd-police.module').then(m => m.PndPoliceModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'indicator-components',
    loadChildren: () => import('./indicator-component/indicator-component.module').then(m => m.IndicatorComponentModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'funding-sources',
    loadChildren: () => import('./funding-source/funding-source.module').then(m => m.FundingSourceModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'institutional-strategic-plans',
    loadChildren: () => import('./institutional-strategic-plan/institutional-strategic-plan.module').then(m => m.InstitutionalStrategicPlanModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'strategic-axes',
    loadChildren: () => import('./strategic-axis/strategic-axis.module').then(m => m.StrategicAxisModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'strategies',
    loadChildren: () => import('./strategy/strategy.module').then(m => m.StrategyModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'indicator-subactivities',
    loadChildren: () => import('./indicator-subactivity/indicator-subactivity.module').then(m => m.IndicatorSubactivityModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
  {
    path: 'continents',
    loadChildren: () => import('./continent/continent.module').then(m => m.ContinentModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.CATALOGUE]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule {
}
