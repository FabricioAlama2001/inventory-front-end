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
    return this.core + 'planner/projects';
  }

  projectsForm(id: string): string {
    return this.core + `planner/projects/${id}`;
  }

  componentsList(projectId: string): string {
    return this.core + `planner/projects/${projectId}/components`;
  }

  componentsForm(projectId:string,id: string): string {
    return this.core + `planner/projects/${projectId}/components/${id}`;
  }

  get subactivitiesList(): string {
    return this.core + '/planner/subactivities';
  }

  subactivitiesForm(id: string): string {
    return this.core + `planner/subactivities/${id}`;
  }

  activitiesForm(componentId:string,id: string): string {
    return this.core + `planner/components/${componentId}/activities/${id}`;
  }

  activitiesList(componentId: string): string {
    return this.core + `planner/components/${componentId}/activities`;
  }

  get poasList(): string {
    return this.core + 'planner/poas';
  }

  poasForm(id: string): string {
    return this.core + `planner/poas/${id}`;
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

  get strategicAxesList(): string {
    return this.core + '/catalogue/strategic-axes';
  }

  strategicAxesForm(id: string): string {
    return this.core + `catalogue/strategic-axes/${id}`;
  }

  get strategiesList(): string {
    return this.core + '/catalogue/strategies';
  }

  strategiesForm(id: string): string {
    return this.core + `catalogue/strategies/${id}`;
  }

  get indicatorSubactivitiesList(): string {
    return this.core + '/catalogue/indicator-subactivities';
  }

  indicatorSubactivitiesForm(id: string): string {
    return this.core + `catalogue/indicator-subactivities/${id}`;
  }

  get continentsList(): string {
    return this.core + '/catalogue/continents';
  }

  continentsForm(id: string): string {
    return this.core + `catalogue/continents/${id}`;
  }

  get fiscalYearsList(): string {
    return this.core + '/catalogue/fiscal-years';
  }

  fiscalYearsForm(id: string): string {
    return this.core + `catalogue/fiscal-years/${id}`;
  }

  get unitsList(): string {
    return this.core + '/catalogue/units';
  }

  unitsForm(id: string): string {
    return this.core + `catalogue/units/${id}`;
  }

  get programmingTypesList(): string {
    return this.core + '/catalogue/programming-types';
  }

  programmingTypesForm(id: string): string {
    return this.core + `catalogue/programming-types/${id}`;
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

  dashboardFollower() {
    this.router.navigateByUrl(`/core/dashboards/follower`);
  }

  dashboardApplicant() {
    this.router.navigateByUrl(`/core/dashboards/applicant`);
  }

  dashboardApprover() {
    this.router.navigateByUrl(`/core/dashboards/approver`);
  }

  dashboardPlannerApprover() {
    this.router.navigateByUrl(`/core/dashboards/planner-approver`);
  }

  passwordReset() {
    this.router.navigateByUrl(`/password-reset`);
  }

}
