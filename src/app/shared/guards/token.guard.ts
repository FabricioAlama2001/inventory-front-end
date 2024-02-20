import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "@services/auth";
import {RoutesService} from "@services/core";

export const TokenGuard: CanActivateFn = (route, state) => {
  const routesService = inject(RoutesService);
  const authService = inject(AuthService);

  if (authService.token) {
    return true;
  }

  routesService.unauthenticated();

  return false;
}
