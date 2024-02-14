import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { SubactivityListComponent } from './subactivity-list/subactivity-list.component';
import { SubactivityFormComponent } from './subactivity-form/subactivity-form.component';


const routes: Routes = [
  {
    path: '',
    component: SubactivityListComponent
  },
  {
    path: ':id',
    component: SubactivityFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubactivityRoutingModule {
}
