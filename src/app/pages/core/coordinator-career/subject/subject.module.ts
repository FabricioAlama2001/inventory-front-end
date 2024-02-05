import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {SubjectRoutingModule} from './subject-routing.module';
import {SharedModule} from "@shared/shared.module";

// PrimeNg Modules
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from "primeng/divider";
import {FileUploadModule} from 'primeng/fileupload';
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {KeyFilterModule} from "primeng/keyfilter";
import {MessageModule} from "primeng/message";
import {MultiSelectModule} from "primeng/multiselect";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {PaginatorModule} from "primeng/paginator";
import {PanelMenuModule} from "primeng/panelmenu";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";
import {PickListModule} from "primeng/picklist";
import {RippleModule} from "primeng/ripple";
import {SidebarModule} from "primeng/sidebar";
import {SplitButtonModule} from "primeng/splitbutton";
import {StepsModule} from "primeng/steps";
import {TableModule} from "primeng/table";
import {TabViewModule} from "primeng/tabview";
import {TagModule} from "primeng/tag";
import {ToolbarModule} from "primeng/toolbar";

// Components
import {SubjectFormComponent} from './subject-form/subject-form.component';
import {SubjectListComponent} from './subject-list/subject-list.component';
import {SubjectRequirementComponent} from "./subject-requirement/subject-requirement.component";

@NgModule({
  declarations: [
    SubjectFormComponent,
    SubjectListComponent,
    SubjectRequirementComponent,
  ],
  imports: [
    NgCommonModule,
    ReactiveFormsModule,
    SubjectRoutingModule,
    SharedModule,
    AccordionModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    DividerModule,
    FileUploadModule,
    InputSwitchModule,
    InputTextModule,
    KeyFilterModule,
    MessageModule,
    MultiSelectModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelMenuModule,
    PanelModule,
    PasswordModule,
    PickListModule,
    RippleModule,
    SidebarModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabViewModule,
    TagModule,
    ToolbarModule,
  ]
})
export class SubjectModule {
}
