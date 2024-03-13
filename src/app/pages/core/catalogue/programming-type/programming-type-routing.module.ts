import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { ProgrammingTypeFormComponent } from './programming-type-form/programming-type-form.component';
import { ProgrammingTypeListComponent } from './programming-type-list/programming-type-list.component';


const routes: Routes = [
  {
    path: '',
    component: ProgrammingTypeListComponent
  },
  {
    path: ':id',
    component: ProgrammingTypeFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgrammingTypeRoutingModule {
}
