import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TrainingRoutingModule } from 'app/views/training/training.routing.module';
import { TrainingFormComponent } from 'app/views/training/form/form.component';
import { TrainingListComponent } from 'app/views/training/list/list.component';
import { TrainingLineDetailComponent } from 'app/views/training/training-line-detail/training-line-detail.component';
import { TrainingConfirmDialogComponent } from 'app/views/training/training-confirm-dialog/training-confirm-dialog.component';
import { FormsModule } from '@angular/forms';

import { FormGroup } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ConfirmCancelDialogComponent } from 'app/views/training/form/confirm-cancel-dialog/confirm-cancel-dialog.component';

import { TrainingKeywordsComponent } from 'app/views/training/training-keywords/training-keywords.component';
import { MdDialogModule, MdInputContainer } from '@angular/material';

@NgModule({
    imports: [
        SharedModule,
        TrainingRoutingModule,
        FormsModule
    ],
    declarations: [
        TrainingFormComponent,
        TrainingListComponent,
        TrainingLineDetailComponent,
        TrainingConfirmDialogComponent,
        ConfirmCancelDialogComponent,
        TrainingKeywordsComponent
    ],
    entryComponents: [
        TrainingConfirmDialogComponent,
        ConfirmCancelDialogComponent,
    ],
    exports: [

    ], 
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA, 
        NO_ERRORS_SCHEMA
    ]
})
export class TrainingModule { }
