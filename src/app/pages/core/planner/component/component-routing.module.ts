import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { ComponentFormComponent } from './component-form/component-form.component';
import { ComponentListComponent } from './component-list/component-list.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule {
}
