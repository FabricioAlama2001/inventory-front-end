import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {} from "../../../auth/user/user-form/user-form.component";
import {ExitGuard} from "@shared/guards";
import {CurriculumListComponent} from "./curriculum-list/curriculum-list.component";
import { CurriculumFormComponent } from './curriculum-form/curriculum-form.component';

const routes: Routes = [
  {
    path: '',
    component: CurriculumListComponent
  },
  {
    path: ':id',
    component: CurriculumFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurriculumRoutingModule {
}
