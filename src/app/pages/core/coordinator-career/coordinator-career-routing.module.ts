import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'careers',
    loadChildren: () => import('./career/career.module').then(m => m.CareerModule),
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
