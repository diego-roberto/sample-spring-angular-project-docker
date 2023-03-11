import { Component } from '@angular/core';

@Component({
    selector: 'info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent {
    title: string;
    description: string;
    descriptionInnerHtml: string;
    listDescription: string[];

    constructor() { }
}
