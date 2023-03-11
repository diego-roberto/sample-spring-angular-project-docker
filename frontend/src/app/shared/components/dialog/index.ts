import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdCardModule, MdButtonModule, MdToolbarModule, MdIconModule } from '@angular/material';

import {
    SafetyDialogComponent,
    SafetyDialogContentComponent,
    SafetyDialogHeaderComponent,
    SafetyDialogActionsComponent
} from './safety-dialog.component';

@NgModule({
    imports: [
        FlexLayoutModule,
        MdCardModule,
        MdIconModule,
        MdButtonModule,
        MdToolbarModule,
        CommonModule
    ],
    exports: [
        SafetyDialogComponent,
        SafetyDialogContentComponent,
        SafetyDialogHeaderComponent,
        SafetyDialogActionsComponent

    ],
    declarations: [
        SafetyDialogComponent,
        SafetyDialogContentComponent,
        SafetyDialogHeaderComponent,
        SafetyDialogActionsComponent
    ]
})
export class SafetyDialogModule { }

export * from './safety-dialog.component';
