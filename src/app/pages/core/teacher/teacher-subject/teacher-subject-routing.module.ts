import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TeacherSubjectListComponent} from "./teacher-subject-list/teacher-subject-list.component";

const routes: Routes = [
  {path:'',component:TeacherSubjectListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherSubjectRoutingModule { }
