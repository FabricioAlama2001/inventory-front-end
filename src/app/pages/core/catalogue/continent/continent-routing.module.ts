import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { ContinentFormComponent } from './continent-form/continent-form.component';
import { ContinentListComponent } from './continent-list/continent-list.component';

const routes: Routes = [
  {
    path: '',
    component: ContinentListComponent
  },
  {
    path: ':id',
    component: ContinentFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContinentRoutingModule {
}
