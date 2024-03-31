import { CategoryListComponent } from './category-list/category-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRoutingModule } from './category-routing.module';
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [CategoryListComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    TagModule,
    SharedModule
  ]
})
export class CategoryModule { }
