import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { PndObjectiveFormComponent } from './pnd-objective-form/pnd-objective-form.component';
import { PndObjectiveListComponent } from './pnd-objective-list/pnd-objective-list.component';


const routes: Routes = [
  {
    path: '',
    component: PndObjectiveListComponent
  },
  {
    path: ':id',
    component: PndObjectiveFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PndObjectiveRoutingModule {
}
