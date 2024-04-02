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
import { ProductFormComponent } from './product-form/product-form.component';
import {DividerModule} from "primeng/divider";
import {InputSwitchModule} from "primeng/inputswitch";
import {KeyFilterModule} from "primeng/keyfilter";
import {MessageModule} from "primeng/message";
import {MultiSelectModule} from "primeng/multiselect";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {PanelMenuModule} from "primeng/panelmenu";
import {PanelModule} from "primeng/panel";
import {RippleModule} from "primeng/ripple";
import {SidebarModule} from "primeng/sidebar";
import {SplitButtonModule} from "primeng/splitbutton";
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [ProductListComponent, ProductFormComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DividerModule,
    InputSwitchModule,
    InputTextModule,
    KeyFilterModule,
    MessageModule,
    MultiSelectModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelMenuModule,
    PanelModule,
    RippleModule,
    SidebarModule,
    SplitButtonModule,
    TableModule,
    TagModule,
    ToolbarModule,
    InputGroupModule

  ]
})

export class ProductModule { }
