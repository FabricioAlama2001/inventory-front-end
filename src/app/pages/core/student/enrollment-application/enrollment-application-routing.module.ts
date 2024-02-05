import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { EnrollmentApplicationComponent } from './enrollment-application.component';


const routes: Routes = [
  {
    path: '',
    component: EnrollmentApplicationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentApplicationRoutingModule {
}
