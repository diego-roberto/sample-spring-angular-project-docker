import { Component, Inject, OnInit } from '@angular/core';
import { MdSnackBar, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';

import { WorkerWearable } from 'app/shared/models/worker-wearable.model';
import { Worker } from 'app/shared/models/worker.model';
import { MaskUtil } from 'app/shared/util/mask.util';
import { WorkerWearableService } from 'app/shared/services/worker-wearable.service';
import { WorkerWearableListResolver } from 'app/resolves/worker-wearable-list.resolver';

@Component({
    selector: 'wearable-dialog',
    templateUrl: 'wearable-dialog.component.html',
    styleUrls: ['./wearable-dialog.component.scss']
})

export class WearableDialogComponent implements OnInit {
    title: string;
    workerWearables: Array<WorkerWearable> = new Array<WorkerWearable>();
    workerWearable: WorkerWearable = new WorkerWearable;
    worker: Worker = new Worker;

    invalid = true;
    cpf = '';
    cpfMask = MaskUtil.cpfMask;

    wearableForm: FormGroup;


    constructor(
        public dialogRef: MdDialogRef<WearableDialogComponent>,
        public snackBar: MdSnackBar,
        public workerWearableService: WorkerWearableService,
        private fb: FormBuilder,
        @Inject(MD_DIALOG_DATA) public data: any,
        public workerWearableListResolver: WorkerWearableListResolver
    ) {
        this.wearableForm = this.fb.group({
        });
    }

    ngOnInit() {
        this.title = this.data.workerWearable.id ? this.data.workerWearable.idWearable : 'NOVO SENSOR';
        this.workerWearable = this.data.workerWearable.id ? this.data.workerWearable : new WorkerWearable();
    }

    save(_workerWearable: WorkerWearable) {
        this.workerWearable = _workerWearable;
    }

    formUpdate(_wearableForm: FormGroup) {
        this.wearableForm = _wearableForm;

        if (!this.wearableForm.controls.cpfWorker.invalid && !this.wearableForm.controls.identification.invalid) {
            this.invalid = false;
        } else {
            this.invalid = true;
        }
    }

    saveWorkerWearable(workerWearable: WorkerWearable) {
        if (workerWearable.idWearable && workerWearable.workerId) {
            this.workerWearableService.saveWorkerWearable(workerWearable).subscribe(
                savedWorkerWearable => {
                    workerWearable.id = savedWorkerWearable.id;
                    this.loadWorkerWearables();
                }
            );
            this.snackBar.open('Sensor cadastrado com sucesso.', null, { duration: 3000 });
            this.dialogRef.close();
        } else {
            this.snackBar.open('Deve preencher todos os campos obrigatórios', null, { duration: 3000 });
        }
    }

    loadWorkerWearables() {
        this.workerWearableService.getWorkerWearableList().subscribe((workerWearables) => {
            this.workerWearables = workerWearables;
            this.workerWearableListResolver.setListWorkerWearable(this.workerWearables);
        });
    }

    handleError(error) {
        if (error.json() && error.json().errors && error.json().errors.length > 0) {
            this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
        } else {
            this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
        }
    }

    close() {
        this.dialogRef.close();
    }
}
