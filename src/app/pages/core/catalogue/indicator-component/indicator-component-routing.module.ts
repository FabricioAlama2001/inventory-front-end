import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { IndicatorComponentFormComponent } from './indicator-component-form/indicator-component-form.component';
import { IndicatorComponentListComponent } from './indicator-component-list/indicator-component-list.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorComponentListComponent
  },
  {
    path: ':id',
    component: IndicatorComponentFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorComponentRoutingModule {
}
