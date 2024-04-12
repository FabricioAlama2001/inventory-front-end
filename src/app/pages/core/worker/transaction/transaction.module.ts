import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionRoutingModule} from './transaction-routing.module';
import {TransactionListComponent} from './transaction-list/transaction-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ToolbarModule} from 'primeng/toolbar';
import {SharedModule} from "@shared/shared.module";
import {InputGroupModule} from "primeng/inputgroup";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";
import {TransactionFormComponent} from './transaction-form/transaction-form.component';
import {DividerModule} from 'primeng/divider';
import {PanelModule} from 'primeng/panel';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputSwitchModule} from 'primeng/inputswitch';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {TransactionDetailModule} from "../transaction-detail/transaction-detail.module";
import {TabViewModule} from 'primeng/tabview';
import {IncomeListComponent} from './transaction-list/income-list/income-list.component';
import {ExpenseListComponent} from './transaction-list/expense-list/expense-list.component';

@NgModule({
  declarations: [TransactionListComponent, TransactionFormComponent, IncomeListComponent, ExpenseListComponent],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    SharedModule,
    SharedModule,
    TableModule,
    TagModule,
    ToolbarModule,
    SharedModule,
    SharedModule,
    SharedModule,
    SharedModule,
    InputGroupModule,
    PaginatorModule,
    InputTextModule,
    DividerModule,
    PanelModule,
    OverlayPanelModule,
    InputSwitchModule,
    CalendarModule,
    InputTextareaModule,
    RippleModule,
    DialogModule,
    TransactionDetailModule,
    TabViewModule
  ]
})
export class TransactionModule {
}
