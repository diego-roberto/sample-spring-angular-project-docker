import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { WorkerService } from 'app/shared/services/worker.service';

import { Worker } from 'app/shared/models/worker.model';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { EnumPermission } from '../../../../../shared/models/permission/enum-permission';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
    selector: 'workers-line-detail',
    templateUrl: './workers-line-detail.component.html',
    styleUrls: ['./workers-line-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineWorkerDetailComponent {
    @Input() worker: Worker;
    @Output() toEditWorker: EventEmitter<Worker> = new EventEmitter();
    @Output() removed = new EventEmitter();
    @Output() toShowPrintLoader: EventEmitter<boolean> = new EventEmitter();

    selectedOption: Worker;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MdDialog,
        private appMessage: AppMessageService,
        private workerService: WorkerService,
        private permissionService: PermissionService
    ) { }

    hasPermissionToPrintEpiReport(): boolean {
      return  this.permissionService.hasPermission(EnumPermission.COMPANY_WORKERS_EPI_LIST);
    }

    toPrintEpiReport(worker) {
        this.toShowPrintLoader.emit(true);
        this.workerService.toPrintEpiReport(worker.id).subscribe((response) => {
            openNewTab(URL.createObjectURL(response));
          
            this.toShowPrintLoader.emit(false);
        },
        (error) => {
            this.toShowPrintLoader.emit(false);
            this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
        });
    }

    redirectTo(route) {
        this.router.navigate([route], { relativeTo: this.route });
    }

    openDialog(worker) {
        const dialogRef = this.dialog.open(WorkerProfileDialogOverviewComponent);

        dialogRef.componentInstance.worker = this.worker;

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'Sim') {
                this.removeMyself();
            }
        });
    }

    removeMyself() {
        this.removed.emit(this);
    }
}

@Component({
    selector: 'confirmation-dialog',
    templateUrl: './../../profile/profile.component.html',
})
export class WorkerProfileDialogOverviewComponent {
    worker: Worker;

    constructor(public dialogRef: MdDialogRef<WorkerProfileDialogOverviewComponent>) { }
}
