import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {PasswordResetComponent} from "./password-reset/password-reset.component";
import {RoleSelectComponent} from "./role-select/role-select.component";
import {InstitutionSelectComponent} from "./institution-select/institution-select.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent
  },
  {
    path: 'role-select',
    component: RoleSelectComponent
  },
  {
    path: 'institution-select',
    component: InstitutionSelectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {
}
