// import {Injectable} from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   CanActivateChild,
//   Router,
//   RouterStateSnapshot,
//   UrlTree
// } from '@angular/router';
// import {Observable} from 'rxjs';
// import {AuthService} from '@services/auth';
// import {RoleModel} from '@models/auth';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate, CanActivateChild {
//   private readonly roles: RoleModel[] = [];
//
//   constructor(private authService: AuthService, private router: Router) {
//     this.roles = authService.roles;
//   }
//
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return this.checkRole(route);
//   }
//
//   canActivateChild(
//     childRoute: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return this.canActivate(childRoute, state);
//   }
//
//   private checkRole(route: ActivatedRouteSnapshot): boolean {
//     if (this.roles) {
//       for (const role of route.data['roles']) {
//         if (this.roles.find(r => r.code?.toUpperCase() === role?.toUpperCase())) {
//           return true;
//         }
//       }
//     }
//     this.router.navigate(['/common/403']);
//     return false;
//   }
//
// }


import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "@services/auth";
import {RoleModel} from "@models/auth";

export const RoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.auth) {
    router.navigate(['/common/403']);
    return false;
  }
  const roles: RoleModel[] = authService.auth.roles;
  if (roles) {
    for (const role of route.data['roles']) {
      if (authService.token && roles.find(r => r.code?.toUpperCase() === role?.toUpperCase())) {
        return true;
      }
    }
  }

  router.navigate(['/common/403']);

  return false;
}
