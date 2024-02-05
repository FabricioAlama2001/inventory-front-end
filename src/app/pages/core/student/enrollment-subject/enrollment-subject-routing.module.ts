import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EnrollmentSubjectListComponent} from "./enrollment-subject-list/enrollment-subject-list.component";

const routes: Routes = [
  {
    path: '',
    component: EnrollmentSubjectListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentSubjectRoutingModule {
}
