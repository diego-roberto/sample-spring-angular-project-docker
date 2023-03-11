import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EpiRoutingModule } from 'app/views/workers/epi/epi.routing.module';
import { EpiDeliveryFormComponent } from './epi-delivery-return/epi-delivery-form/epi-delivery-form.component';
import { EpiDeliveryReturnDialogComponent } from './epi-delivery-return/epi-delivery-return-dialog/epi-delivery-return-dialog.component';
import { EpiDeliveryReturnStagesComponent } from './epi-delivery-return/epi-delivery-return-stages/epi-delivery-return-stages.component';
import { EpiQuantityFormComponent } from './epi-delivery-return/epi-quantity-form/epi-quantity-form.component';
import { EpiReturnFormComponent } from './epi-delivery-return/epi-return-form/epi-return-form.component';
import { EpiLineDetailComponent } from './epi-line-detail/epi-line-detail.component';
import { EPIListComponent } from './epi-list/epi-list.component';
import { EpiConfirmFormComponent } from './epi-delivery-return/epi-confirm-form/epi-confirm-form.component';
import { IndividualEquipmentDialogComponent } from './individual-equipment-dialog/individual-equipment-dialog.component';
import { EpiFormComponent } from './epi-form/epi-form.component';
import { IndividualEquipmentFormComponent } from './individual-equipment-form/individual-equipment-form.component';
import { EpiComponent } from './epi.component';
import { IndividualEquipmentListComponent } from './individual-equipment-list/individual-equipment-list.component';
import { IndividualEquipmentListItemComponent } from './individual-equipment-list/individual-equipment-list-item/individual-equipment-list-item.component';
import { EpiFabButtonComponent } from './epi-fab-button/epi-fab-button.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        SharedModule,
        EpiRoutingModule,
        CommonModule,
    ],
    declarations: [
        EpiDeliveryFormComponent,
        EpiDeliveryReturnDialogComponent,
        EpiDeliveryReturnStagesComponent,
        EpiQuantityFormComponent,
        EpiReturnFormComponent,
        EpiLineDetailComponent,
        EPIListComponent,
        EpiConfirmFormComponent,
        IndividualEquipmentDialogComponent,
        EpiFormComponent,
        IndividualEquipmentFormComponent,
        EpiComponent,
        IndividualEquipmentListComponent,
        IndividualEquipmentListItemComponent,
        EpiFabButtonComponent
    ],
    entryComponents: [
        EpiDeliveryReturnDialogComponent,
        IndividualEquipmentDialogComponent
    ]
})
export class EpiModule { }
