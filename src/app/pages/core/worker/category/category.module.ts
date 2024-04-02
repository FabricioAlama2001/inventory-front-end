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
import { SplitButtonModule } from 'primeng/splitbutton';
import { SidebarModule } from 'primeng/sidebar';
import { ProductRoutingModule } from '../product/product-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';


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
    InputTextModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    CheckboxModule,
    DividerModule,
    InputSwitchModule,
    KeyFilterModule,
    MessageModule,
    MultiSelectModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelMenuModule,
    PanelModule,
    RippleModule,
    SidebarModule,
    SplitButtonModule
  ]
})
export class CategoryModule { }
