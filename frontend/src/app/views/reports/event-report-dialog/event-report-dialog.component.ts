import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import * as Moment from 'moment';
import { UtilValidators } from 'app/shared/util/validators.util';
import { isNullOrUndefined } from 'util';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { TicketGateService } from 'app/shared/services/ticket-gate.service';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'event-report-dialog',
  templateUrl: 'event-report-dialog.component.html',
  styleUrls: ['./event-report-dialog.component.scss']
})
export class EventReportDialogComponent implements OnInit {
  eventReportItemForm: FormGroup;

  reportTypes: string[] = ['XML', 'PDF'];
  contractTypes: string[] = ['PRÓPRIO', 'TERCEIRO'];
  constructions: string[] = [];
  suppliers: string[] = [];
  workerStatu: string[] = ['ATIVO', 'INATIVO', 'AMBOS'];

  loading = false;

  reportRequest = {
    reportType: 'PDF',
    contractType: 'PRÓPRIO',
    workerStatus: 'ATIVO',

    initialDate: undefined,
    finalDate: undefined,

    constructionName: undefined,
    companies: undefined,

    typeReturn: "postman",
  };

  constructor(
    public dialogRef: MdDialogRef<EventReportDialogComponent>,
    private appMessage: AppMessageService,
    private ticketGateService: TicketGateService,
  ) {
    this.eventReportItemForm = new FormGroup({
      constructions: new FormControl('', [Validators.required]),
      contractType: new FormControl('', [Validators.required]),
      reportType: new FormControl('', [Validators.required]),
      workerStatus: new FormControl('', [Validators.required]),
      suppliers: new FormControl('', [Validators.required]),
      initialDate: new FormControl('', [
        Validators.required,
        UtilValidators.date,
        this.validateDateBeforeToday
      ]),
      finalDate: new FormControl('', [
        Validators.required,
        UtilValidators.date,
        this.validateDateBeforeToday
      ])
    }, this.validatePeriod);
  }

  ngOnInit() {
    this.getConstructions();
    this.getSuppliers('PRÓPRIO');
  }

  doPrintReport() {

    this.loading = true;

    if (this.reportRequest.reportType === 'PDF') {
      this.ticketGateService.printViewTicketGateAccessEventsReport(this.reportRequest)
        .subscribe(response => {
          openNewTab(URL.createObjectURL(response));

          this.closeDialog();
        }, error => {
          this.loading = false;
          this.appMessage.showError('Ocorreu um erro durante a geração do relatório');
        });
    } else {
      this.ticketGateService.printViewTicketGateAccessEventsReportXML(this.reportRequest)
        .subscribe(response => {
          
          this.closeDialog();
        }, error => {
          this.loading = false;
          this.appMessage.showError('Ocorreu um erro durante a geração do relatório');
        });
    }

  }

  closeDialog() {
    this.loading = false;
    this.dialogRef.close();
  }

  validatePeriod(formGroup: FormGroup) {
    if (isNullOrUndefined(formGroup.controls.initialDate) || isNullOrUndefined(formGroup.controls.finalDate)) { return null; }

    const initialDate = Moment(formGroup.controls.initialDate.value);
    const finalDate = Moment(formGroup.controls.finalDate.value);

    if (!initialDate.isValid() || !finalDate.isValid()) { return null; }

    if (initialDate.isAfter(finalDate)) {
      formGroup.controls.initialDate.setErrors({ initialAfterfinalDate: true });
      return { initialAfterfinalDate: true };
    }

    if (formGroup.controls.initialDate.hasError('initialAfterfinalDate')) {
      formGroup.controls.initialDate.setErrors(null);
      formGroup.controls.initialDate.updateValueAndValidity();
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
    return this.eventReportItemForm.controls[controlName].hasError(error);
  }

  hasErrorFormAndTouched(controlName: string, error: string): boolean {
    if (!this.eventReportItemForm.controls[controlName].touched) { return false; }

    return this.hasErrorForm(controlName, error);
  }

  getSuppliers(type: string) {
    this.ticketGateService.findSuppliersNames(type).subscribe(response => {
      const suppliersFiltered = response.filter(item => item);

      this.suppliers = suppliersFiltered;
      this.reportRequest.companies = suppliersFiltered;
    });
  }

  getConstructions() {
    this.ticketGateService.constructionsNames().subscribe(response => {
      if (response === undefined || response.length <= 0) {
         this.appMessage.showError('Não existem obras com dados para geração desse relatório');
      } else {
        this.constructions = response;
        this.reportRequest.constructionName = response[0];
      }
    });
  }

  onChangeContractType() {
    const { contractType } = this.reportRequest;

    this.getSuppliers(contractType);
  }

  showSuppliers() {
    return this.reportRequest.contractType === 'TERCEIRO'
  }

  checkAllSuppliers(event) {

    if (event.checked && this.reportRequest.contractType === 'TERCEIRO') {
      this.getSuppliers('TERCEIRO');
      this.reportRequest.companies = this.suppliers;
    } else {
      this.reportRequest.companies = [];
    }
  }

}
