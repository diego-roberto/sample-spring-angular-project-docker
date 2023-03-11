import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import * as Moment from 'moment';
import { UtilValidators } from 'app/shared/util/validators.util';
import { isNullOrUndefined } from 'util';
import { openNewTab } from 'app/shared/util/open-new-tab';

import { WorkersReportType } from 'app/shared/models/workers-report-type.model';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { WorkerService } from 'app/shared/services/worker.service';

@Component({
  selector: 'worker-report-dialog',
  templateUrl: 'worker-report-dialog.component.html',
  styleUrls: ['./worker-report-dialog.component.scss']
})
export class WorkerReportDialogComponent implements OnInit {

  loading = false;
  workerReportItemForm: FormGroup;
  workersReportType = WorkersReportType;

  reportRequest = {
    initialPeriod: undefined,
    finalPeriod: undefined
  };

  constructor(
    public dialogRef: MdDialogRef<WorkerReportDialogComponent>,
    private appMessage: AppMessageService,
    private workerService: WorkerService,
  ) {
    this.workerReportItemForm = new FormGroup({
      workersReportType: new FormControl(WorkersReportType.BY_CONSTRUCTION, [Validators.required]),
      initialPeriod: new FormControl('', [Validators.required, UtilValidators.date, this.validateDateBeforeToday]),
      finalPeriod: new FormControl('', [Validators.required, UtilValidators.date, this.validateDateBeforeToday]),
    }, this.validatePeriod);
  }

  ngOnInit() {
    if (WorkersReportType.values().length <= 1) {
      this.workerReportItemForm.controls.workersReportType.disable();
    }
  }

  getReportLabelByType(reportType: any) {
    if (reportType === WorkersReportType.BY_CONSTRUCTION) {
      return 'Trabalhadores por função';
    } else if (reportType === WorkersReportType.EPI_HISTORY) {
      return 'Histórico de EPI';
    }
  }

  doPrintReport() {
    this.loading = true;
    if (this.workerReportItemForm.controls.workersReportType.value === WorkersReportType.BY_CONSTRUCTION) {
      this.doPrintReportByConstruction();
    } else if (this.workerReportItemForm.controls.workersReportType.value === WorkersReportType.EPI_HISTORY) {
      this.doPrintEPIHistoryReport();
    }
  }

  doPrintEPIHistoryReport() {
    this.workerService.toPrintEPIHistoryReport(this.reportRequest)
      .subscribe(
        (response) => {
          openNewTab(URL.createObjectURL(response));

          this.closeDialog();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
        }
      );
  }

  doPrintReportByConstruction() {
    this.workerService.toPrintWorkerByConstructionReport(this.reportRequest).subscribe(
      (response) => {
        openNewTab(URL.createObjectURL(response));
        
        this.loading = false;
        this.closeDialog();
      },
      (error) => {
        this.loading = false;
        this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  validatePeriod(formGroup: FormGroup) {
    if (isNullOrUndefined(formGroup.controls.initialPeriod) || isNullOrUndefined(formGroup.controls.finalPeriod)) { return null; }

    const initialPeriod = Moment(formGroup.controls.initialPeriod.value);
    const finalPeriod = Moment(formGroup.controls.finalPeriod.value);

    if (!initialPeriod.isValid() || !finalPeriod.isValid()) { return null; }

    if (initialPeriod.isAfter(finalPeriod)) {
      formGroup.controls.initialPeriod.setErrors({ initialAfterFinalPeriod: true });
      return { initialAfterFinalPeriod: true };
    }

    if (formGroup.controls.initialPeriod.hasError('initialAfterFinalPeriod')) {
      formGroup.controls.initialPeriod.setErrors(null);
      formGroup.controls.initialPeriod.updateValueAndValidity();
    }

    return null;
  }

  validateDateBeforeToday(control: FormControl) {
    const dateValue = Moment(control.value);
    const today = Moment(new Date(Moment().format('L')));

    if (!dateValue.isValid()) { return null; }

    if (today.isBefore(dateValue)) {
      return { beforeToday: true };
    }

    return null;
  }

  hasErrorForm(controlName: string, error: string): boolean {
    return this.workerReportItemForm.controls[controlName].hasError(error);
  }

  hasErrorFormAndTouched(controlName: string, error: string): boolean {
    if (!this.workerReportItemForm.controls[controlName].touched) { return false; }

    return this.hasErrorForm(controlName, error);
  }
}
