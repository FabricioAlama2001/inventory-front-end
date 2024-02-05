import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {EnrollmentRoutingModule} from './enrollment-routing.module';
import {SharedModule} from "@shared/shared.module";

// PrimeNg Modules
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MessageModule} from "primeng/message";
import {ToolbarModule} from "primeng/toolbar";
import {PaginatorModule} from "primeng/paginator";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {SplitButtonModule} from "primeng/splitbutton";
import {InputTextModule} from "primeng/inputtext";
import {SidebarModule} from "primeng/sidebar";
import {PanelMenuModule} from "primeng/panelmenu";
import {PanelModule} from "primeng/panel";
import {DividerModule} from "primeng/divider";
import {InputSwitchModule} from "primeng/inputswitch";
import {TabViewModule} from "primeng/tabview";
import {CalendarModule} from "primeng/calendar";
import {AccordionModule} from "primeng/accordion";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {BadgeModule} from "primeng/badge";
import {OverlayPanelModule} from "primeng/overlaypanel";

// Components
import {EnrollmentDetailListComponent} from './enrollment-detail-list/enrollment-detail-list.component';
import {EnrollmentDetailFormComponent} from './enrollment-detail-form/enrollment-detail-form.component';
import {EnrollmentListComponent} from "./enrollment-list/enrollment-list.component";
import {EnrollmentFormComponent} from './enrollment-form/enrollment-form.component';

@NgModule({
  declarations: [
    EnrollmentFormComponent,
    EnrollmentListComponent,
    EnrollmentDetailFormComponent,
    EnrollmentDetailListComponent,
  ],
  imports: [
    NgCommonModule,
    EnrollmentRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    AccordionModule,
    BadgeModule,
    ButtonModule,
    CalendarModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    MessageModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelMenuModule,
    PanelModule,
    RippleModule,
    SidebarModule,
    SplitButtonModule,
    TableModule,
    TableModule,
    TabViewModule,
    TagModule,
    ToolbarModule,
  ]
})
export class EnrollmentModule {
}
