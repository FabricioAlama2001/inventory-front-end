import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from "@shared/guards";
import { ConsolidatedNotesComponent } from './consolidated-notes/consolidated-notes.component';
import { ConsolidatedNotesListComponent } from './consolidated-notes-list/consolidated-notes-list.component';

const routes: Routes = [
  {
    path: '',
    component: ConsolidatedNotesComponent
  },
  {
    path: 'list',
    component: ConsolidatedNotesListComponent
  },
  {
    path: ':id',
    component: ConsolidatedNotesListComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolidatedNotesRoutingModule {
}
