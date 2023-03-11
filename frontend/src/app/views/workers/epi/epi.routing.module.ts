import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { EpiComponent } from 'app/views/workers/epi/epi.component';
import { EPIListComponent } from 'app/views/workers/epi/epi-list/epi-list.component';
import { IndividualEquipmentListComponent } from 'app/views/workers/epi/individual-equipment-list/individual-equipment-list.component';

const WORKERS_ROUTER: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        component: EpiComponent,
        children: [
            {path: '' , redirectTo: 'epi_list', pathMatch: 'full'},
            {path: 'epi_list', component: EPIListComponent},
            {path: 'individual_equipment_list', component: IndividualEquipmentListComponent},
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(WORKERS_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class EpiRoutingModule { }
