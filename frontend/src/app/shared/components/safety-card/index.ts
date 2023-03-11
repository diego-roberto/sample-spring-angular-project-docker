import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdCardModule, MdButtonModule, MdToolbarModule, MdIconModule } from '@angular/material';

import {
    SafetyCardComponent,
    SafetyCardContentComponent,
    SafetyCardHeaderComponent
} from './safety-card.component';

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
        SafetyCardComponent,
        SafetyCardHeaderComponent,
        SafetyCardContentComponent

    ],
    declarations: [
        SafetyCardComponent,
        SafetyCardHeaderComponent,
        SafetyCardContentComponent
    ]
})
export class SafetyCardModule { }

export * from './safety-card.component';
