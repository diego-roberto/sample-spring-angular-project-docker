import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { WearableRoutingModule } from 'app/views/workers/wearable/wearable.routing.module';
import { WearableDialogComponent } from './wearable-dialog/wearable-dialog.component';
import { WearableFormComponent } from './wearable-form/wearable-form.component';
import { WearableLineDetailComponent } from './wearable-line-detail/wearable-line-detail.component';
import { WorkerWearableListComponent } from './worker-wearable-list/worker-wearable-list.component';

@NgModule({
    imports: [
        SharedModule,
        WearableRoutingModule
    ],
    declarations: [
        WearableDialogComponent,
        WearableFormComponent,
        WearableLineDetailComponent,
        WorkerWearableListComponent
    ],
    entryComponents: [
        WearableDialogComponent
    ]
})
export class WearableModule { }
