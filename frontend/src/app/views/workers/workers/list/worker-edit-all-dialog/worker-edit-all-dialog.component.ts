import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import { WorkersReportType } from 'app/shared/models/workers-report-type.model';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { WorkerService } from 'app/shared/services/worker.service';

@Component({
  selector: 'worker-edit-all-dialog',
  templateUrl: 'worker-edit-all-dialog.component.html',
  styleUrls: ['./worker-edit-all-dialog.component.scss']
})
export class WorkerEditAllDialogComponent implements OnInit {

  workerReportItemForm: FormGroup;
  workersReportType = WorkersReportType;

  currentPage = 1;
  totalPages = 0;

  workerList = [];
  updatedWorkers = [];

  reloadWorkers: () => void;

  loading: boolean = false;
  saving: boolean = false;

  constructor(
    public dialogRef: MdDialogRef<WorkerEditAllDialogComponent>,
    private appMessage: AppMessageService,
    private workerService: WorkerService,
  ) {
    this.workerReportItemForm = new FormGroup({
      workersReportType: new FormControl(WorkersReportType.BY_CONSTRUCTION, [Validators.required]),
    })
  }

  ngOnInit() {
    this.getWorkerListPaginated(0);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  togglePage(pageIndex) {
    this.currentPage = pageIndex;
    this.getWorkerListPaginated(pageIndex - 1);

    document.querySelector('#workers-list').scrollTop = 0;
  }

  toggleWorker(worker) {
    this.workerList = this.workerList.map(wl => {
      if (wl.id === worker.id) {
        const updatedWorker = { ...wl, status: !wl.status };

        this.updatedWorkers = this.updatedWorkers.filter(w => w.id !== wl.id);
        this.updatedWorkers.push(updatedWorker);

        return updatedWorker;
      };
      return wl
    })
  }

  getWorkerList() {
    this.loading = true;

    this.workerService.getAllWorkers().subscribe(response => {
      this.workerList = response;
      this.loading = false;
    })
  }

  getWorkerListPaginated(pageIndex: number) {
    this.workerService.getWorkersAllowedToEditStatusByPage(pageIndex)
    .subscribe(response => {
      const { totalPages, workers } = response;

      this.totalPages = totalPages;
      this.synchWorkers(workers);
      this.workerList = workers;
    });
  }

  save() {
    this.saving = true;

    this.workerService.updateAllStatus(this.updatedWorkers).subscribe(response => {

      this.appMessage.showSuccess('Dados salvos com sucesso!');
      this.reloadWorkers();

      this.saving = false;
    });
  }

  synchWorkers(list) {
    for (let worker of this.updatedWorkers) {
      const workerInList = list.find(item => item.id === worker.id);

      if (workerInList) {
        workerInList.status = worker.status;
      }
    }
  }
}
