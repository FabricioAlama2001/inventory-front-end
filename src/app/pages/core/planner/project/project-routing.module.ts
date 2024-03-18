import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import {ProjectFormComponent} from './project-form/project-form.component';
import {ProjectListComponent} from './project-list/project-list.component';
import {ComponentListComponent} from "../component/component-list/component-list.component";
import {ComponentFormComponent} from "../component/component-form/component-form.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent
  },
  {
    path: ':id',
    component: ProjectFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: ':id/components',
    component: ComponentListComponent,
  },
  {
    path: ':projectId/components/:componentId',
    component: ComponentFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
