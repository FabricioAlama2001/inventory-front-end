import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "@services/auth";

export const TokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.token) {
    return true;
  }

  router.navigate(['/common/401']);

  return false;
}
