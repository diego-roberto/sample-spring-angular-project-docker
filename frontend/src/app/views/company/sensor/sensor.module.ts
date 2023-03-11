import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SensorRoutingModule } from 'app/views/company/sensor/sensor.routing.module';
import { SensorListComponent } from './list/sensor-list/sensor-list.component';
import { SensorAddComponent } from './sensor-add/sensor-add.component';
import { SensorLineDetailComponent} from './list/sensor-line-detail/sensor-line-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MdSlideToggleModule } from '@angular/material/';
@NgModule({
    imports: [
        SharedModule,
        SensorRoutingModule,
        MdSlideToggleModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [
        SensorListComponent,
        SensorAddComponent,
        SensorLineDetailComponent
    ],
    entryComponents: [
        SensorAddComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA

    ]
})
export class SensorModule { }
