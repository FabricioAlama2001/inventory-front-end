import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SocioeconomicFormComponent} from './socioeconomic-form.component';


const routes: Routes = [
  {
    path: '',
    component: SocioeconomicFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocioeconomicFormRoutingModule {
}
