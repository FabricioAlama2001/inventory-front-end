import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import {InstitutionListComponent} from "./institution-list/institution-list.component";
import {InstitutionFormComponent} from "./institution-form/institution-form.component";

const routes: Routes = [
  {
    path: '',
    component: InstitutionListComponent
  },
  {
    path: ':id',
    component: InstitutionFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionRoutingModule {
}
