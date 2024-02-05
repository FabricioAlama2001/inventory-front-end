import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {CalendarModule} from "primeng/calendar";
import {DividerModule} from "primeng/divider";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {PaginatorModule} from "primeng/paginator";
import {PanelMenuModule} from "primeng/panelmenu";
import {PanelModule} from "primeng/panel";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "@shared/shared.module";
import {SidebarModule} from "primeng/sidebar";
import {SplitButtonModule} from "primeng/splitbutton";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ToolbarModule} from "primeng/toolbar";
import {ReactiveFormsModule} from '@angular/forms';
import {EnrollmentApplicationRoutingModule} from './enrollment-application-routing.module';
import {EnrollmentApplicationComponent} from './enrollment-application.component';
import {TabViewModule} from 'primeng/tabview';
import {AccordionModule} from 'primeng/accordion';
import {SocioeconomicFormModule} from './socioeconomic-form/socioeconomic-form.module';
import {SocioeconomicReportComponent} from './socioeconomic-report/socioeconomic-report.component';
import {ApplicationAttachmentComponent} from './application-attachment/application-attachment.component';
import {ApplicationComponent} from './application/application.component';
import {MessagesModule} from "primeng/messages";
import {ApplicationReportComponent} from './application-report/application-report.component';


@NgModule({
  declarations: [
    EnrollmentApplicationComponent,
    SocioeconomicReportComponent,
    ApplicationAttachmentComponent,
    ApplicationComponent,
    ApplicationReportComponent,
  ],
  imports: [
    NgCommonModule,
    ReactiveFormsModule,
    EnrollmentApplicationRoutingModule,
    AccordionModule,
    NgCommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    RippleModule,
    MessageModule,
    ToolbarModule,
    PaginatorModule,
    TableModule,
    TabViewModule,
    TagModule,
    SplitButtonModule,
    InputTextModule,
    SidebarModule,
    PanelMenuModule,
    SharedModule,
    PanelModule,
    DividerModule,
    InputSwitchModule,
    SocioeconomicFormModule,
    MessagesModule,
    PdfViewerModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
})
export class EnrollmentApplicationModule {
}
