import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TeacherSubjectRoutingModule} from './teacher-subject-routing.module';
import {TeacherSubjectListComponent} from './teacher-subject-list/teacher-subject-list.component';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {CardModule} from "primeng/card";
import {ToolbarModule} from "primeng/toolbar";


@NgModule({
  declarations: [
    TeacherSubjectListComponent
  ],
  imports: [
    CommonModule,
    TeacherSubjectRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    ToolbarModule,
  ]
})
export class TeacherSubjectModule {
}
