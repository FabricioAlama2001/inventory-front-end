import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RoleGuard} from "@shared/guards";
import {RoleEnum} from "@shared/enums";

const routes: Routes = [
  {
    path: 'reforms',
    loadChildren: () => import('./reform/reform.module').then(m => m.ReformModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.APPLICANT]}
  },
  {
    path: 'scp',
    loadChildren: () => import('./scp/scp.module').then(m => m.ScpModule),
    canActivate: [RoleGuard],
    data: {roles: [RoleEnum.APPLICANT]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
