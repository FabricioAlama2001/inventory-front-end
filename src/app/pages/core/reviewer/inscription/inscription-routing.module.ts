import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import {InscriptionListComponent} from "./inscription-list/inscription-list.component";
import {InscriptionFormComponent} from "./inscription-form/inscription-form.component";
import {
  InscriptionDetailListComponent
} from "./inscription-detail-list/inscription-detail-list.component";
import {
  InscriptionDetailFormComponent
} from "./inscription-detail-form/inscription-detail-form.component";

const routes: Routes = [
  {
    path: '',
    component: InscriptionListComponent,
  },
  {
    path: ':id',
    component: InscriptionFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: ':enrollmentId/inscription-details',
    component: InscriptionDetailListComponent,
  },
  {
    path: ':enrollmentId/inscription-details/:id',
    component: InscriptionDetailFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InscriptionRoutingModule {
}
