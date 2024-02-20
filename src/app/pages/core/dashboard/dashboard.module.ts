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
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
