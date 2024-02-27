import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { UnitFormComponent } from './unit-form/unit-form.component';
import { UnitListComponent } from './unit-list/unit-list.component';


const routes: Routes = [
  {
    path: '',
    component: UnitListComponent
  },
  {
    path: ':id',
    component: UnitFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitRoutingModule {
}
