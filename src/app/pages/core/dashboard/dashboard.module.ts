import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdminComponent } from './admin/admin.component';
import { PlannerComponent } from './planner/planner.component';
import { TeacherComponent } from './teacher/teacher.component';
import { StudentComponent } from './student/student.component';
import { CoordinatorAdministrativeComponent } from './coordinator-administrative/coordinator-administrative.component';
import { CoordinatorCareerComponent } from './coordinator-career/coordinator-career.component';
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
    PlannerComponent,
    TeacherComponent,
    StudentComponent,
    CoordinatorAdministrativeComponent,
    CoordinatorCareerComponent
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
