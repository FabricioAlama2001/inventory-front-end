import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

export enum AppRoutesEnum {
  CORE = '/core',
  AUTH = '/auth',
  COMMON = '/common',
}

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private router: Router) {
  }

  get core(): string {
    return '/core/';
  }

  /** Admin Role **/
  /** Teacher Role **/
  /** Student Role **/
  /** Coordinator Administrative Role **/

  /** Rector Role**/
  /** Welfare Role **/
  get admin(): string {
    return '/admin/';
  }

  get users(): string {
    return this.admin + 'users';
  }

  get projectsList(): string {
    return this.core + 'projects';
  }

  projectsForm(id: string): string {
    return this.core + `projects/${id}`;
  }

  budgetItemsForm(id: string): string {
    return this.core + `planner/budget-items/${id}`;
  }

  /** Planner Role **/
  get subactivities(): string {
    return this.core + '/planner/subactivities';
  }

  get budgetItems(): string {
    return this.core + '/planner/budget-items';
  }

  get projects(): string {
    return this.core + '/planner/projects';
  }


  /** Reviewer Role **/
  inscriptionsDetailForm(enrollmentId: string): string {
    return this.core + `/reviewer/inscriptions/${enrollmentId}/inscription-details`;
  }

  get events(): string {
    return this.core + '/events';
  }

  get studentsCoordinatorCareer(): string {
    return this.core + '/coordinator-career/students';
  }

  get parallelCapacity(): string {
    return this.core + '/careers/parallel-capacity';
  }

  get teachersCoordinatorCareer(): string {
    return this.core + '/coordinator-career/teachers';
  }

  get teacherDistributions(): string {
    return this.core + '/teacher-distributions';
  }

  get common(): string {
    return '/common';
  }

  /** Login **/
  login() {
    this.router.navigateByUrl(`/login`);
  }

  institutionSelect() {
    this.router.navigateByUrl(`/auth/authentication/institution-select`);
  }

  roleSelect() {
    this.router.navigateByUrl(`/auth/authentication/role-select`);
  }

  profile() {
    this.router.navigateByUrl(`/profile`);
  }

  /** Dashboards **/
  dashboardAdmin() {
    this.router.navigateByUrl(`/core/dashboards/admin`);
  }

  dashboardPlanner() {
    this.router.navigateByUrl(`/core/dashboards/planner`);
  }

  dashboardTeacher() {
    this.router.navigateByUrl(`/core/dashboards/teacher`);
  }

  dashboardStudent() {
    this.router.navigateByUrl(`/core/student/enrollment-application`);
  }

  dashboardCoordinatorAdministrative() {
    this.router.navigateByUrl(`/core/dashboards/coordinator-administrative`);
  }

  dashboardCoordinatorCareer() {
    this.router.navigateByUrl(`/core/dashboards/coordinator-career`);
  }

  dashboardReviewer() {
    this.router.navigateByUrl(`/core/reviewer/inscriptions`);
  }

  dashboardSecretary() {
    this.router.navigateByUrl(`/core/secretary/enrollments`);
  }

  dashboardWelfare() {
    this.router.navigateByUrl(`/core/welfare/enrollments`);
  }

  passwordReset() {
    this.router.navigateByUrl(`/password-reset`);
  }
}
