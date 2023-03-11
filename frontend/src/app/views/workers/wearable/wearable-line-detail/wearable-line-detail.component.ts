import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { WorkerWearable } from 'app/shared/models/worker-wearable.model';
import { Worker } from 'app/shared/models/worker.model';
import { WorkerWearableService } from 'app/shared/services/worker-wearable.service';
import { WorkerService } from 'app/shared/services/worker.service';
import { WorkerWearableListResolver } from 'app/resolves/worker-wearable-list.resolver';
import { WearableDialogComponent } from '../wearable-dialog/wearable-dialog.component';

@Component({
    selector: 'wearable-line-detail',
    templateUrl: './wearable-line-detail.component.html',
    styleUrls: ['./wearable-line-detail.component.scss']
})
export class WearableLineDetailComponent implements OnInit {
    @Input() workerWearable: WorkerWearable;
    @Input() expired: Boolean;
    @Output() removed = new EventEmitter();

    worker: Worker = new Worker;

    dialogConfig = {
        data: {
            worker: new Worker(),
            workerWearable: new WorkerWearable(),
            update: false
        }
    };

    constructor(private router: Router,
        private route: ActivatedRoute,
        public dialog: MdDialog,
        public confirmDialogHandler: ConfirmDialogHandler,
        public workerWearableService: WorkerWearableService,
        public workerService: WorkerService,
        public workerWearableListResolver: WorkerWearableListResolver,
        public snackBar: MdSnackBar
    ) { }

    ngOnInit() {
        this.workerService.getWorker(this.workerWearable.workerId).subscribe((worker) => {
            this.worker = worker;
            this.workerWearable.workerName = worker.name;
        });
    }

    redirectTo(route) {
        this.router.navigate([route], { relativeTo: this.route });
    }

    toDeleteWorkerWearable() {
        const dialogRef = this.confirmDialogHandler.call('excluir', 'Deseja remover esse registro?').subscribe((confirm) => {
            if (confirm) {
                this.workerWearableService.removeWorkerWearableByIdWearable(this.workerWearable.id).subscribe(
                    response => {
                        this.snackBar.open('Sensor excluído com sucesso!', null, { duration: 3000 });
                        this.removed.emit(response);

                        this.workerWearableListResolver.setListWorkerWearable(response);
                    },
                    error => {
                        this.handleError(error);
                    }
                );
            }
        });
    }

    toEditWorkerWearable() {
        this.dialogConfig.data.workerWearable = this.workerWearable;
        this.dialogConfig.data.workerWearable.name = this.worker.name;
        this.dialogConfig.data.update = true;
        const dialogRef = this.dialog.open(WearableDialogComponent, this.dialogConfig);
    }

    private handleError(error) {
        if (error.json() && error.json().errors && error.json().errors.length > 0) {
            this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
        } else {
            this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
        }
    }
}
