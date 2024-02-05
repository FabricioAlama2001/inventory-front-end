import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RolesEnum} from "@shared/enums";
import {RoleGuard} from "@shared/guards";

const routes: Routes = [
  {
    path: 'teacher-subjects',
    loadChildren: () => import('./teacher-subject/teacher-subject.module').then(m => m.TeacherSubjectModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.TEACHER]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {
}
