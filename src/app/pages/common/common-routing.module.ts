import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {ServiceUnavailableComponent} from './service-unavailable/service-unavailable.component';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {InternalServerErrorComponent} from './internal-server-error/internal-server-error.component'

import {ExitGuard, RoleGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '403', component: ForbiddenComponent
  },
  {
    path: '404', component: NotFoundComponent,
  },
  {
    path: '503', component: ServiceUnavailableComponent
  },
  {
    path: '401', component: UnauthorizedComponent
  },
  {
    path: '500', component: InternalServerErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule {
}
