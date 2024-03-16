import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionListComponent
  },
  {
    path: ':id',
    component: TransactionFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule {
}
