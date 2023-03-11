import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { WorkerWearableListComponent } from './worker-wearable-list/worker-wearable-list.component';

const WEARABLE_ROUTER: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        component: WorkerWearableListComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(WEARABLE_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class WearableRoutingModule { }
