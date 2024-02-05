import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import {SchoolPeriodListComponent} from "./school-period-list/school-period-list.component";
import {SchoolPeriodFormComponent} from "./school-period-form/school-period-form.component";

const routes: Routes = [
  {
    path: '',
    component: SchoolPeriodListComponent
  },
  {
    path: ':id',
    component: SchoolPeriodFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolPeriodRoutingModule {
}
