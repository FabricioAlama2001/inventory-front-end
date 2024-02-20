import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { InstitutionalStrategicPlanFormComponent } from './institutional-strategic-plan-form/institutional-strategic-plan-form.component';
import { InstitutionalStrategicPlanListComponent } from './institutional-strategic-plan-list/institutional-strategic-plan-list.component';


const routes: Routes = [
  {
    path: '',
    component: InstitutionalStrategicPlanListComponent
  },
  {
    path: ':id',
    component: InstitutionalStrategicPlanFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionalStrategicPlanRoutingModule {
}
