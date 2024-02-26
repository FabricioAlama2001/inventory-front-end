import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { FiscalYearFormComponent } from './fiscal-year-form/fiscal-year-form.component';
import { FiscalYearListComponent } from './fiscal-year-list/fiscal-year-list.component';



const routes: Routes = [
  {
    path: '',
    component: FiscalYearListComponent
  },
  {
    path: ':id',
    component: FiscalYearFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiscalYearRoutingModule {
}
