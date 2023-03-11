import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/shared/guards';
import { SensorListComponent } from 'app/views/company/sensor/list/sensor-list/sensor-list.component';

const SENSOR_ROUTER: Routes = [

    {
        path: '',
        canActivateChild: [AuthGuard],
        component: SensorListComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(SENSOR_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class SensorRoutingModule { }
