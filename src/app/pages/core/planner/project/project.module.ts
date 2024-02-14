import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";


// PrimeNg Modules
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {DividerModule} from "primeng/divider";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {KeyFilterModule} from "primeng/keyfilter";
import {MessageModule} from "primeng/message";
import {MultiSelectModule} from "primeng/multiselect";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {PaginatorModule} from "primeng/paginator";
import {PanelMenuModule} from "primeng/panelmenu";
import {PanelModule} from "primeng/panel";
import {RippleModule} from "primeng/ripple";
import {SidebarModule} from "primeng/sidebar";
import {SplitButtonModule} from "primeng/splitbutton";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ToolbarModule} from "primeng/toolbar";
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectListComponent } from './project-list/project-list.component';

// Components



@NgModule({
  declarations: [
    ProjectFormComponent,
    ProjectListComponent,
  ],
  imports: [
    NgCommonModule,
    ProjectRoutingModule,
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
  ]
})
export class ProjectModule {
}
