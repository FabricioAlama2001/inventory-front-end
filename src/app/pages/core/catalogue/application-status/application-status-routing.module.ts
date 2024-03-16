import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { ApplicationStatusFormComponent } from './application-status-form/application-status-form.component';
import { ApplicationStatusListComponent } from './application-status-list/application-status-list.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationStatusListComponent
  },
  {
    path: ':id',
    component: ApplicationStatusFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationStatusRoutingModule {
}
