import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionDetailListComponent } from './transaction-detail-list/transaction-detail-list.component';
import { TransactionDetailFormComponent } from './transaction-detail-form/transaction-detail-form.component';

const routes: Routes = [
  {
    path:'',
    component:TransactionDetailListComponent
  },
  {
    path:':id',
    component: TransactionDetailFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionDetailRoutingModule { }
