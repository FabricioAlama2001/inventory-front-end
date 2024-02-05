import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentSubjectRoutingModule } from './enrollment-subject-routing.module';
import {EnrollmentSubjectListComponent} from "./enrollment-subject-list/enrollment-subject-list.component";


@NgModule({
  declarations: [EnrollmentSubjectListComponent],
  imports: [
    CommonModule,
    EnrollmentSubjectRoutingModule
  ]
})
export class EnrollmentSubjectModule { }
