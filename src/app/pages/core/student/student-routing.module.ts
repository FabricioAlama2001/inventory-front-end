import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'enrollment-application',
    loadChildren: () => import('./enrollment-application/enrollment-application.module').then(m => m.EnrollmentApplicationModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.STUDENT]}
  },
  {
    path: 'enrollment-subjects',
    loadChildren: () => import('./enrollment-subject/enrollment-subject.module').then(m => m.EnrollmentSubjectModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.STUDENT]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {
}
