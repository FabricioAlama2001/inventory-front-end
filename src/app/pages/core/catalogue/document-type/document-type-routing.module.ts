import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { DocumentTypeFormComponent } from './document-type-form/document-type-form.component';
import { DocumentTypeListComponent } from './document-type-list/document-type-list.component';


const routes: Routes = [
  {
    path: '',
    component: DocumentTypeListComponent
  },
  {
    path: ':id',
    component: DocumentTypeFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentTypeRoutingModule {
}
