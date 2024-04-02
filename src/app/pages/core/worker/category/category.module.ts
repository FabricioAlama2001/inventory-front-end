import { CategoryListComponent } from './category-list/category-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRoutingModule } from './category-routing.module';
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {SharedModule} from "@shared/shared.module";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import { CategoryFormComponent } from './category-form/category-form.component';


@NgModule({
  declarations: [CategoryListComponent, CategoryFormComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    TagModule,
    SharedModule,
    InputGroupModule,
    InputTextModule
  ]
})
export class CategoryModule { }
