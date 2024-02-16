import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { ExpenseGroupListComponent } from './expense-group-list/expense-group-list.component';
import { ExpenseGroupFormComponent } from './expense-group-form/expense-group-form.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseGroupListComponent
  },
  {
    path: ':id',
    component: ExpenseGroupFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseGroupRoutingModule {
}
