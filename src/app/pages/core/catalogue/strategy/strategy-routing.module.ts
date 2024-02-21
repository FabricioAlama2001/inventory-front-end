import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { StrategyFormComponent } from './strategy-form/strategy-form.component';
import { StrategyListComponent } from './strategy-list/strategy-list.component';

const routes: Routes = [
  {
    path: '',
    component: StrategyListComponent
  },
  {
    path: ':id',
    component: StrategyFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategyRoutingModule {
}
