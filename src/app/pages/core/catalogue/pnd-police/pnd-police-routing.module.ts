import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { PndPoliceFormComponent } from './pnd-police-form/pnd-police-form.component';
import { PndPoliceListComponent } from './pnd-police-list/pnd-police-list.component';


const routes: Routes = [
  {
    path: '',
    component: PndPoliceListComponent
  },
  {
    path: ':id',
    component: PndPoliceFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PndPoliceRoutingModule {
}
