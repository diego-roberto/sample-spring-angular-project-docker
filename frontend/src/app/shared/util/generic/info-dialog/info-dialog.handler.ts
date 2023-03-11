import { AppModule } from 'app';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Injectable } from '@angular/core';
import { InfoDialogComponent } from 'app/shared/util/generic/info-dialog/info-dialog.component';

@Injectable()
export class InfoDialogHandler {
    title: string;
    description: string;
    descriptionInnerHtml: string;
    listDescription: string[];

    constructor(private dialog: MdDialog) { }

    call(title: string, description: string) {
        this.cleanFields();
        this.title = title;
        this.description = description;
        this.open();
    }

    callListDescription(title: string, listDescription: string[]) {
        this.cleanFields();
        this.title = title;
        this.listDescription = listDescription;
        this.open();
    }

    callInnerHtml(title: string, descriptionInnerHtml: string) {
        this.cleanFields();
        this.title = title;
        this.descriptionInnerHtml = descriptionInnerHtml;
        this.open();
    }

    private cleanFields(){
        this.title = '';
        this.description = '';
        this.descriptionInnerHtml = '';
        this.listDescription = [];
    }

    private open(){
        let dialogRef: MdDialogRef<InfoDialogComponent>;
        dialogRef = this.dialog.open(InfoDialogComponent);
        dialogRef.componentInstance.title = this.title;
        dialogRef.componentInstance.description = this.description;
        dialogRef.componentInstance.descriptionInnerHtml = this.descriptionInnerHtml;
        dialogRef.componentInstance.listDescription = this.listDescription;
    }

}
