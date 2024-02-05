import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'institutions',
    loadChildren: () => import('./institution/institution.module').then(m => m.InstitutionModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
  {
    path: 'careers',
    loadChildren: () => import('./career/career.module').then(m => m.CareerModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
  {
    path: 'curriculums',
    loadChildren: () => import('./curriculum/curriculum.module').then(m => m.CurriculumModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
  {
    path: 'subjects',
    loadChildren: () => import('./subject/subject.module').then(m => m.SubjectModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
  {
    path: 'teachers',
    loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
  {
    path: 'school-periods',
    loadChildren: () => import('./school-period/school-period.module').then(m => m.SchoolPeriodModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
  {
    path: 'consolidated-notes',
    loadChildren: () => import('./consolidated-notes/consolidated-notes.module').then(m => m.ConsolidatedNotesModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
  {
    path: 'teacher-distributions',
    loadChildren: () => import('./teacher-distribution/teacher-distribution.module').then(m => m.TeacherDistributionModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.COORDINATOR_CAREER]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinatorCareerRoutingModule {
}
