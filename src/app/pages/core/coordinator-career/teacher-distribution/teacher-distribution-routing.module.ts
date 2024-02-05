import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import {TeacherDistributionListComponent} from "./teacher-distribution-list/teacher-distribution-list.component";
import {TeacherDistributionFormComponent} from "./teacher-distribution-form/teacher-distribution-form.component";

const routes: Routes = [
  {
    path: '',
    component: TeacherDistributionListComponent
  },
  {
    path: ':id',
    component: TeacherDistributionFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherDistributionRoutingModule {
}
