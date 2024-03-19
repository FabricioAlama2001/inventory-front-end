import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { TransactionDetailFormComponent } from './transaction-detail-form/transaction-detail-form.component';
import { TransactionDetailListComponent } from './transaction-detail-list/transaction-detail-list.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionDetailListComponent
  },
  {
    path: ':id',
    component: TransactionDetailFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionDetailRoutingModule {
}
