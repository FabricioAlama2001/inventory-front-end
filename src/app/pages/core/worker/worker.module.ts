import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkerRoutingModule } from './worker-routing.module';
import { SharedModule } from "../../../shared/shared.module";


@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        WorkerRoutingModule,
        SharedModule
    ]
})
export class WorkerModule { }
