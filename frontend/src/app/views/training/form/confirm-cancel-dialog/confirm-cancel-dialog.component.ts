

import { MdDialogRef } from '@angular/material';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash/collection';
import { TrainingService } from 'app/shared/services/training.service';


const includesString = (toCheck, value) => toCheck.toLowerCase().includes(value.toLowerCase());



@Component({
    selector: 'confirm-cancel-dialog',
    templateUrl: 'confirm-cancel-dialog.component.html',
    styleUrls: ['./confirm-cancel-dialog.component.scss']
})

export class ConfirmCancelDialogComponent implements OnInit {
    @Output()onUpdate = new EventEmitter();
    title: string;
    @Output() cancelInsert: EventEmitter<any> = new EventEmitter();


    constructor(
        public dialogRef: MdDialogRef<ConfirmCancelDialogComponent>,

    ) {
    }


    ngOnInit() {
        this.title = 'Cancelar Inclusão';
    }

    confirm(doCancel){
        if(doCancel){
            this.cancelInsert.emit();
        }
    }

    close() {
        this.dialogRef.close();
    }


}
