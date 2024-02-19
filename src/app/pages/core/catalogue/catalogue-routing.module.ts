import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'expense-types',
    loadChildren: () => import('./expense-type/expense-type.module').then(m => m.ExpenseTypeModule),
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
