import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import {ScpListComponent} from "./scp-list/scp-list.component";
import {ScpFormComponent} from "./scp-form/scp-form.component";

const routes: Routes = [
  {
    path: '',
    component: ScpListComponent
  },
  {
    path: ':id',
    component: ScpFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScpRoutingModule {
}
