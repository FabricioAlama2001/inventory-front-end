import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { FundingSourceFormComponent } from './funding-source-form/funding-source-form.component';
import { FundingSourceListComponent } from './funding-source-list/funding-source-list.component';


const routes: Routes = [
  {
    path: '',
    component: FundingSourceListComponent
  },
  {
    path: ':id',
    component: FundingSourceFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundingSourceRoutingModule {
}
