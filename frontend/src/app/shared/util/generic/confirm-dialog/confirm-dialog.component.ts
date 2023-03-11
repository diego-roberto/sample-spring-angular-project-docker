import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'safety-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    title: string;
    description: string;

    buttons: { trueValue: string; falseValue: string } = { trueValue: 'Excluir', falseValue: 'Fechar' };

    @Output() removed = new EventEmitter<boolean>();

    constructor() { }

    remove(confirm: boolean) {
        this.removed.emit(confirm);
        this.removed.complete();
    }

}
