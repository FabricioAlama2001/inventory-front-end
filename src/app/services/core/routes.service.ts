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

  /** Worker Role **/
  get categoriesList(): string {
    return this.core + 'worker/categories';
  }

  categoriesForm(id: string): string {
    return this.core + `worker/categories/${id}`;
  }

  get productsList(): string {
    return this.core + 'worker/products';
  }

  productsForm(id: string): string {
    return this.core + `worker/products/${id}`;
  }

  get transactionsList(): string {
    return this.core + '/worker/transactions';
  }

  transactionsForm(id: string): string {
    return this.core + `worker/transactions/${id}`;
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

  get profile() {
    return '/profile';
  }

  /** Dashboards **/
  dashboardAdmin() {
    this.router.navigateByUrl(`/core/dashboards/admin`);
  }

  dashboardWorker() {
    this.router.navigateByUrl(`/core/dashboards/worker`);
  }

  passwordReset() {
    this.router.navigateByUrl(`/password-reset`);
  }

}
