import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { IndicatorSubactivityFormComponent } from './indicator-subactivity-form/indicator-subactivity-form.component';
import { IndicatorSubactivityListComponent } from './indicator-subactivity-list/indicator-subactivity-list.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorSubactivityListComponent
  },
  {
    path: ':id',
    component: IndicatorSubactivityFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorSubactivityRoutingModule {
}
