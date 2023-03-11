

import { MdDialogRef } from '@angular/material';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash/collection';
import { TrainingService } from 'app/shared/services/training.service';


const includesString = (toCheck, value) => toCheck.toLowerCase().includes(value.toLowerCase());



@Component({
    selector: 'training-confirm-dialog',
    templateUrl: 'training-confirm-dialog.component.html',
    styleUrls: ['./training-confirm-dialog.component.scss']
})

export class TrainingConfirmDialogComponent implements OnInit {
    @Output()onUpdate = new EventEmitter();
    title: string;
    id:number;
    constructor(
        public dialogRef: MdDialogRef<TrainingConfirmDialogComponent>,
        private service: TrainingService,

    ) {

    }


    ngOnInit() {
        this.title = 'Excluir';
    }

    removed(confirmed){
        if(confirmed){
            this.service.inactivateTraining(this.id).subscribe();
        }
    }

    close() {
        this.dialogRef.close();
    }


}
