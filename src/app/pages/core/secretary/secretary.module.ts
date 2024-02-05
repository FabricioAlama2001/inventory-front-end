import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

// PrimeNg Modules
import { CalendarModule } from 'primeng/calendar';
import { SecretaryFormComponent } from './secretary-form/secretary-form.component';
import { SecretaryRoutingModule } from './secretary-routing.module';
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {PaginatorModule} from "primeng/paginator";
import {PanelMenuModule} from "primeng/panelmenu";
import {PanelModule} from "primeng/panel";
import {RippleModule} from "primeng/ripple";
import {SidebarModule} from "primeng/sidebar";
import {SplitButtonModule} from "primeng/splitbutton";
import {TableModule} from "primeng/table";
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from "primeng/tag";
import {ToolbarModule} from "primeng/toolbar";
import {SharedModule} from "@shared/shared.module";

@NgModule({
  declarations: [
    SecretaryFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SecretaryRoutingModule,
    SharedModule,
    ButtonModule,
    CalendarModule,
    DividerModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    PaginatorModule,
    PanelMenuModule,
    PanelModule,
    RippleModule,
    SidebarModule,
    SplitButtonModule,
    TableModule,
    TabViewModule,
    TagModule,
    ToolbarModule,
  ]
})
export class SecretaryModule { }
