import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailRoutingModule } from './transaction-detail-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import {SharedModule} from "@shared/shared.module";
import {InputGroupModule} from "primeng/inputgroup";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TransactionDetailListComponent } from './transaction-detail-list/transaction-detail-list.component';
import { TransactionDetailFormComponent } from './transaction-detail-form/transaction-detail-form.component';




@NgModule({
  declarations: [TransactionDetailListComponent,TransactionDetailFormComponent],
  imports: [
    CommonModule,
    TransactionDetailRoutingModule,
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
    InputTextareaModule
  ]
})
export class TransactionDetailModule { }
