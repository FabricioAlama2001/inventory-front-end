import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { StrategicAxisFormComponent } from './strategic-axis-form/strategic-axis-form.component';
import { StrategicAxisListComponent } from './strategic-axis-list/strategic-axis-list.component';

const routes: Routes = [
  {
    path: '',
    component: StrategicAxisListComponent
  },
  {
    path: ':id',
    component: StrategicAxisFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategicAxisRoutingModule {
}