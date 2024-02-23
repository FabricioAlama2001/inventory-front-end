import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { ComponentFormComponent } from './component-form/component-form.component';
import { ComponentListComponent } from './component-list/component-list.component';
import {ActivityListComponent} from "../activity/activity-list/activity-list.component";
import {ActivityFormComponent} from "../activity/activity-form/activity-form.component";

const routes: Routes = [
  {
    path: '',
    component: ComponentListComponent
  },
  {
    path: ':id',
    component: ComponentFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: ':id/activities',
    component: ActivityListComponent
  },
  {
    path: ':componentId/activities/:activityId',
    component: ActivityFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule {
}
