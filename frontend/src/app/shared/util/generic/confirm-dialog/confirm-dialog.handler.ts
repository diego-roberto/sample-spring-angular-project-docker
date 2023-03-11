import { Injectable } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Observable, Subscribable } from 'rxjs/Observable';
import { AppModule } from 'app';

import { ConfirmDialogComponent } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.component';

@Injectable()
export class ConfirmDialogHandler {
    title: string;
    description: string;

    constructor(private dialog: MdDialog) { }

    call(title: string, description: string, buttons?: { trueValue: string, falseValue: string }): Subscribable<boolean> {
        this.title = title;
        this.description = description;

        const subject = new Subject<boolean>();

        let dialogRef: MdDialogRef<ConfirmDialogComponent>;
        dialogRef = this.dialog.open(ConfirmDialogComponent);
        dialogRef.componentInstance.title = this.title;
        dialogRef.componentInstance.description = this.description;

        if (buttons) {
            dialogRef.componentInstance.buttons = buttons;
        }

        dialogRef.componentInstance.removed.subscribe(dialogResponse => {
            subject.next(dialogResponse);
            subject.complete();
            dialogRef.close();
        });

        return subject;
    }
}
