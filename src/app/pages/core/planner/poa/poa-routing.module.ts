import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { PoaFormComponent } from './poa-form/poa-form.component';
import { PoaListComponent } from './poa-list/poa-list.component';

const routes: Routes = [
  {
    path: '',
    component: PoaListComponent
  },
  {
    path: ':id',
    component: PoaFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoaRoutingModule {
}
