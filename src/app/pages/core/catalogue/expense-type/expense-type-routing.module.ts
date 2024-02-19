import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { ExpenseTypeFormComponent } from './expense-type-form/expense-type-form.component';
import { ExpenseTypeListComponent } from './expense-type-list/expense-type-list.component';


const routes: Routes = [
  {
    path: '',
    component: ExpenseTypeListComponent
  },
  {
    path: ':id',
    component: ExpenseTypeFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseTypeRoutingModule {
}
