import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { UnitManagerListComponent } from './unit-manager-list/unit-manager-list.component';
import { UnitManagerFormComponent } from './unit-manager-form/unit-manager-form.component';

const routes: Routes = [
  {
    path: '',
    component: UnitManagerListComponent
  },
  {
    path: ':id',
    component: UnitManagerFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitManagerRoutingModule {
}
