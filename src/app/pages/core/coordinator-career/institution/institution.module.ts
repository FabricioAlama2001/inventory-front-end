import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {InstitutionRoutingModule} from './institution-routing.module';
import {SharedModule} from "@shared/shared.module";

// PrimeNg Modules
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
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

// Components
import {InstitutionFormComponent} from './institution-form/institution-form.component';
import {InstitutionListComponent} from "./institution-list/institution-list.component";

@NgModule({
  declarations: [
    InstitutionFormComponent,
    InstitutionListComponent,
  ],
  imports: [
    NgCommonModule,
    InstitutionRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ButtonModule,
    DividerModule,
    InputMaskModule,
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
    TagModule,
    ToolbarModule,
  ]
})
export class InstitutionModule {
}
