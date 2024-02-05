import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import {EnrollmentListComponent} from "./enrollment-list/enrollment-list.component";
import {EnrollmentFormComponent} from './enrollment-form/enrollment-form.component';
import {
  EnrollmentDetailListComponent
} from "./enrollment-detail-list/enrollment-detail-list.component";
import {
  EnrollmentDetailFormComponent
} from "./enrollment-detail-form/enrollment-detail-form.component";


const routes: Routes = [
  {
    path: '',
    component: EnrollmentListComponent,
  },
  {
    path: ':id',
    component: EnrollmentFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: ':enrollmentId/enrollment-details',
    component: EnrollmentDetailListComponent,
  },
  {
    path: ':enrollmentId/enrollment-details/:id',
    component: EnrollmentDetailFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentRoutingModule {
}
