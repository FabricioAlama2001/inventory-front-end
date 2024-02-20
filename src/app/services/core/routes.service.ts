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
  get admin(): string {
    return '/admin/';
  }

  get users(): string {
    return this.admin + 'users';
  }

  /** Planner Role **/
  get projectsList(): string {
    return this.core + 'projects';
  }

  projectsForm(id: string): string {
    return this.core + `projects/${id}`;
  }

  get subactivities(): string {
    return this.core + '/planner/subactivities';
  }

  /** Catalogue Role **/
  get budgetItemsList(): string {
    return this.core + 'catalogue/budget-items';
  }

  budgetItemsForm(id: string): string {
    return this.core + `catalogue/budget-items/${id}`;
  }

  get expenseGroupsList(): string {
    return this.core + '/catalogue/expense-groups';
  }

  expenseGroupsForm(id: string): string {
    return this.core + `catalogue/expense-groups/${id}`;
  }

  get expenseTypesList(): string {
    return this.core + '/catalogue/expense-types';
  }

  expenseTypesForm(id: string): string {
    return this.core + `catalogue/expense-types/${id}`;
  }

  get pndObjectivesList(): string {
    return this.core + '/catalogue/pnd-objectives';
  }

  pndObjectivesForm(id: string): string {
    return this.core + `catalogue/pnd-objectives/${id}`;
  }

  get pndPolicesList(): string {
    return this.core + '/catalogue/pnd-polices';
  }

  pndPolicesForm(id: string): string {
    return this.core + `catalogue/pnd-polices/${id}`;
  }

  get indicatorComponentsList(): string {
    return this.core + '/catalogue/indicator-components';
  }

  indicatorComponentsForm(id: string): string {
    return this.core + `catalogue/indicator-components/${id}`;
  }

  get fundingSourcesList(): string {
    return this.core + '/catalogue/funding-sources';
  }

  fundingSourcesForm(id: string): string {
    return this.core + `catalogue/funding-sources/${id}`;
  }

  get institutionalStrategicPlansList(): string {
    return this.core + '/catalogue/institutional-strategic-plans';
  }

  institutionalStrategicPlansForm(id: string): string {
    return this.core + `catalogue/institutional-strategic-plans/${id}`;
  }

  get common(): string {
    return '/common';
  }

  /** Login **/
  login() {
    this.router.navigateByUrl(`/login`);
  }

  forbidden() {
    this.router.navigateByUrl(`/common/403`);
  }

  unauthenticated() {
    this.router.navigateByUrl(`/common/401`);
  }

  notFound() {
    this.router.navigateByUrl(`/common/404`);
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
