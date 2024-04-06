import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdminComponent } from './admin/admin.component';
import { WorkerComponent } from './worker/worker.component';
import {DashboardComponent} from "./dashboard.component";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";
import {AccordionModule} from "primeng/accordion";

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    WorkerComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ButtonModule,
    RippleModule,
    DividerModule,
    CardModule,
    AccordionModule
  ]
})
export class DashboardModule { }
