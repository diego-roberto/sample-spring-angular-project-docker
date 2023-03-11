import { MdDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import * as Moment from 'moment';
import { UtilValidators } from 'app/shared/util/validators.util';
import { isNullOrUndefined } from 'util';

import { CompanyReportType } from 'app/shared/models/company-report-type.model';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { CompanyService } from 'app/shared/services/company.service';

import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'company-report-dialog',
  templateUrl: './company-report-dialog.component.html',
  styleUrls: ['./company-report-dialog.component.scss']
})
export class CompanyReportDialogComponent implements OnInit {

  companyReportForm: FormGroup;
  companyReportType = CompanyReportType;
  loading = false;

  reportRequest = {
    initialPeriod: undefined,
    finalPeriod: undefined
  };

  constructor(
    public dialogRef: MdDialogRef<CompanyReportDialogComponent>,
    private appMessage: AppMessageService,
    private companyService: CompanyService,
  ) {
    this.companyReportForm = new FormGroup({
      companyReportType: new FormControl(CompanyReportType.DOCUMENTS_CONTROL, [Validators.required]),
      initialPeriod: new FormControl('', [Validators.required, UtilValidators.date, this.validatePeriod]),
      finalPeriod: new FormControl('', [Validators.required, UtilValidators.date, this.validatePeriod]),
    });
  }

  ngOnInit() {
    if (CompanyReportType.values().length <= 1) {
      this.companyReportForm.controls.companyReportType.disable();
    }
  }

  getReportLabelByType(reportType: any) {
    if (reportType === CompanyReportType.DOCUMENTS_CONTROL) { return 'Controle de Documentos'; }
  }

  doPrintReport() {
    this.loading = true;
    if (this.companyReportForm.controls.companyReportType.value === CompanyReportType.DOCUMENTS_CONTROL) {
      this.doPrintDocumentsControlReport();
    }
  }

  doPrintDocumentsControlReport() {
    this.companyService.printCompanyDocumentationReport(this.reportRequest).subscribe((response) => {
      openNewTab(URL.createObjectURL(response));

      this.loading = false;
      this.closeDialog();
    },
      (error) => {
        this.loading = false;
        this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  validatePeriod(control: FormControl) {
    if ((!control || !control.parent) || (!control.parent.controls['initialPeriod'] || !control.parent.controls['initialPeriod'].value)
      || (!control.parent.controls['finalPeriod'] || !control.parent.controls['finalPeriod'].value)) {
      return null;
    }

    const initialPeriod = Moment(control.parent.controls['initialPeriod'].value);
    const finalPeriod = Moment(control.parent.controls['finalPeriod'].value);

    if (!initialPeriod.isValid() || !finalPeriod.isValid()) { return null; }

    if (initialPeriod.isAfter(finalPeriod)) {
      return { initialAfterFinalPeriod: true };
    }

    return null;
  }

  hasErrorForm(controlName: string, error: string): boolean {
    return this.companyReportForm.controls[controlName].hasError(error);
  }

  hasErrorFormAndTouched(controlName: string, error: string): boolean {
    if (!this.companyReportForm.controls[controlName].touched) { return false; }

    return this.hasErrorForm(controlName, error);
  }
}
