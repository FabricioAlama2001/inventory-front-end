import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';

import {InscriptionRoutingModule} from './inscription-routing.module';
import {InscriptionListComponent} from "./inscription-list/inscription-list.component";
import {InscriptionFormComponent} from "./inscription-form/inscription-form.component";
import {ReactiveFormsModule} from "@angular/forms";
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
import {SharedModule} from "@shared/shared.module";
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
import {InscriptionDetailListComponent} from "./inscription-detail-list/inscription-detail-list.component";
import {InscriptionDetailFormComponent} from "./inscription-detail-form/inscription-detail-form.component";

@NgModule({
  declarations: [
    InscriptionListComponent,
    InscriptionFormComponent,
    InscriptionDetailListComponent,
    InscriptionDetailFormComponent,
  ],
  imports: [
    NgCommonModule,
    InscriptionRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    MessageModule,
    ToolbarModule,
    PaginatorModule,
    TableModule,
    TagModule,
    SplitButtonModule,
    InputTextModule,
    SidebarModule,
    PanelMenuModule,
    SharedModule,
    PanelModule,
    DividerModule,
    InputSwitchModule,
    TableModule,
    TabViewModule,
    CalendarModule,
    AccordionModule,
    DialogModule,
    DropdownModule,
    BadgeModule,
    OverlayPanelModule
  ]
})
export class InscriptionModule {
}
