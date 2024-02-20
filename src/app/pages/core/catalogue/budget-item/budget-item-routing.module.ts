import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { BudgetItemFormComponent } from './budget-item-form/budget-item-form.component';
import { BudgetItemListComponent } from './budget-item-list/budget-item-list.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetItemListComponent
  },
  {
    path: ':id',
    component: BudgetItemFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetItemRoutingModule {
}
