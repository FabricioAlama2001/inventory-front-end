import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import {SharedModule} from "@shared/shared.module";
import {InputGroupModule} from "primeng/inputgroup";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";


@NgModule({
  declarations: [TransactionListComponent],
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
    InputTextModule
    //--------------

  ]
})
export class TransactionModule { }
