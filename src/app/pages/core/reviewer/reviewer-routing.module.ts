import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RolesEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'inscriptions',
    loadChildren: () => import('./inscription/inscription.module').then(m => m.InscriptionModule),
    canActivate: [RoleGuard],
    data: {roles: [RolesEnum.REVIEWER]}
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewerRoutingModule { }
