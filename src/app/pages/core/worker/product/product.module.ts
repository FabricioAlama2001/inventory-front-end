import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import {ButtonModule} from "primeng/button";
import {SharedModule} from "@shared/shared.module";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ToolbarModule} from "primeng/toolbar";
import {InputGroupModule} from "primeng/inputgroup";
import {ReactiveFormsModule} from "@angular/forms";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";

@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
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
  ]
})

export class ProductModule { }
