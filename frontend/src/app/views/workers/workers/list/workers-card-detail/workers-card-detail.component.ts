import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog } from '@angular/material';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { WorkerService } from 'app/shared/services/worker.service';

import { WorkerProfileDialogOverviewComponent } from '../workers-line-detail/workers-line-detail.component';
import { Worker } from 'app/shared/models/worker.model';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { EnumPermission } from '../../../../../shared/models/permission/enum-permission';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
    selector: 'workers-card-detail',
    templateUrl: './workers-card-detail.component.html',
    styleUrls: ['./workers-card-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkersCardDetailComponent {
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

    redirectTo(route) {
        this.router.navigate([route], { relativeTo: this.route });
    }

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
