import { MdDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as Moment from 'moment/moment';
import { UtilValidators } from 'app/shared/util/validators.util';
import { isNullOrUndefined } from 'util';

import { ConstructionReportType } from 'app/shared/models/construction-report-type.model';
import { Construction } from 'app/shared/models/construction.model';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { ConstructionsService } from 'app/shared/services/constructions.service';

import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'construction-report-dialog',
  templateUrl: './construction-report-dialog.component.html',
  styleUrls: ['./construction-report-dialog.component.scss']
})
export class ConstructionReportDialogComponent implements OnInit {

  @ViewChild('filter') filter: ElementRef;

  constructionReportForm: FormGroup;
  constructionReportType = ConstructionReportType;
  loading = false;

  reportRequest = {
    initialPeriod: undefined,
    finalPeriod: undefined,
    items: undefined,
  };

  constructions: Construction[];
  constructionsSelected: Construction[];

  constructionsFiltered: Construction[];
  constructionsSelectedFiltered: Construction[];

  constructionsVirtualScrollItems: Construction[];
  constructionsSelectedVirtualScrollItems: Construction[];

  selectedToAdd = [];
  selectedToRemove = [];

  constructor(
    public dialogRef: MdDialogRef<ConstructionReportDialogComponent>,
    private appMessage: AppMessageService,
    private constructionsService: ConstructionsService,
  ) {
    this.constructionReportForm = new FormGroup({
      constructionReportType: new FormControl(ConstructionReportType.DOCUMENTS_CONTROL, [Validators.required]),
      initialPeriod: new FormControl('', [Validators.required, UtilValidators.date, this.validatePeriod]),
      finalPeriod: new FormControl('', [Validators.required, UtilValidators.date, this.validatePeriod]),
    });
  }

  ngOnInit() {
    if (ConstructionReportType.values().length <= 1) {
      this.constructionReportForm.controls.constructionReportType.disable();
    }

    this.constructionsService.getConstructionsEssential().subscribe(constructions => {
      this.constructions = constructions;
      this.doConstructionsOrderByTraddingName();

      this.constructionsSelected = [];
    });
  }

  getReportLabelByType(reportType: any) {
    if (reportType === ConstructionReportType.DOCUMENTS_CONTROL) {
      return 'Controle de Documentos';
    } else if (reportType === ConstructionReportType.CONSTRUCTION_CHECKLIST) {
      return 'Checklist de Obras';
    }
  }

  doPrintReport() {
    this.loading = true;
    if (this.constructionReportForm.controls.constructionReportType.value === ConstructionReportType.DOCUMENTS_CONTROL) {
      this.doPrintDocumentsControlReport();
    }else if (this.constructionReportForm.controls.constructionReportType.value === ConstructionReportType.CONSTRUCTION_CHECKLIST) {
      this.doPrintConstructionChecklist();
    }
  }

  doPrintDocumentsControlReport() {
    this.reportRequest.items = this.constructionsSelected.map(construction => construction.id);

    this.constructionsService.printConstructionDocumentationReport(this.reportRequest).subscribe((response) => {
      openNewTab(URL.createObjectURL(response));
      
      this.closeDialog();
    },
    (error) => {
      this.loading = false;
      this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
    });
  }

  doPrintConstructionChecklist(){
    this.reportRequest.items = this.constructionsSelected.map(construction => construction.id);

    this.constructionsService.printConstructionChecklistReport(this.reportRequest).subscribe((response) => {
      openNewTab(URL.createObjectURL(response));

      this.closeDialog();
    },
    (error) => {
      this.loading = false;
      this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
    });
  }

  closeDialog() {
    this.loading = false;
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

  setAllToAdd() {
    if (this.isAllToAdd()) {
      this.selectedToAdd = [];
    } else {
      this.selectedToAdd = this.constructionsFiltered;
    }
  }

  isAllToAdd(): boolean {
    if (this.isAllToAddDisabled()) { return false; }
    return ! this.constructionsFiltered.some(construction => ! this.selectedToAdd.includes(construction));
  }

  isAllToAddDisabled(): boolean {
    return isNullOrUndefined(this.constructionsFiltered) || this.constructionsFiltered.length === 0;
  }

  setSelectedToAdd(construction: Construction) {
    if (! this.selectedToAdd.includes(construction)) {
      this.selectedToAdd.push(construction);
    } else {
      this.selectedToAdd = this.selectedToAdd.filter(item => item !== construction);
    }
  }

  setAllToRemove() {
    if (this.isAllToRemove()) {
      this.selectedToRemove = [];
    } else {
      this.selectedToRemove = this.constructionsSelectedFiltered;
    }
  }

  isAllToRemove(): boolean {
    if (this.isAllToRemoveDisabled()) { return false; }
    return ! this.constructionsSelectedFiltered.some(construction => ! this.selectedToRemove.includes(construction));
  }

  isAllToRemoveDisabled(): boolean {
    return isNullOrUndefined(this.constructionsSelectedFiltered) || this.constructionsSelectedFiltered.length === 0;
  }

  setSelectedToRemove(construction: Construction) {
    if (! this.selectedToRemove.includes(construction)) {
      this.selectedToRemove.push(construction);
    } else {
      this.selectedToRemove = this.selectedToRemove.filter(item => item !== construction);
    }
  }

  doAdd() {
    this.constructionsSelected = this.constructionsSelected.concat(this.selectedToAdd);
    this.constructions = this.constructions.filter(item => ! this.selectedToAdd.includes(item));
    this.selectedToAdd = [];
    this.doConstructionsSelectedOrderByTraddingName();
  }

  doRemove() {
    this.constructions = this.constructions.concat(this.selectedToRemove);
    this.constructionsSelected = this.constructionsSelected.filter(item => ! this.selectedToRemove.includes(item));
    this.selectedToRemove = [];
    this.doConstructionsOrderByTraddingName();
  }

  doClearFilterConstructions() {
    this.filter.nativeElement.value = '';
    this.doFilterConstructions(this.filter.nativeElement.value);
  }

  doFilterConstructions(filterValue: string) {
    this.doFilterConstructionsUnselected(filterValue);
    this.doFilterConstructionsSelected(filterValue);
  }

  doFilterConstructionsSelected(filterValue: string) {
    if (! filterValue || filterValue === '') {
      this.constructionsSelectedFiltered = this.constructionsSelected;
    } else {
      this.constructionsSelectedFiltered = this.constructionsSelected.filter(construction =>
        construction.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doFilterConstructionsUnselected(filterValue: string) {
    if (! filterValue || filterValue === '') {
      this.constructionsFiltered = this.constructions;
    } else {
      this.constructionsFiltered = this.constructions.filter(construction =>
        construction.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doConstructionsOrderByTraddingName() {
    this.constructions = this.constructions.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    this.doFilterConstructions(this.filter.nativeElement.value);
  }

  doConstructionsSelectedOrderByTraddingName() {
    this.constructionsSelected = this.constructionsSelected.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    this.doFilterConstructions(this.filter.nativeElement.value);
  }

  isDoAddDisabled(): boolean {
    return isNullOrUndefined(this.selectedToAdd) || this.selectedToAdd.length === 0;
  }

  isDoRemoveDisabled(): boolean {
    return isNullOrUndefined(this.selectedToRemove) || this.selectedToRemove.length === 0;
  }

  showEmptySelectionMessage(): boolean {
    return isNullOrUndefined(this.constructionsSelected) || this.constructionsSelected.length === 0;
  }

  hasErrorForm(controlName: string, error: string): boolean {
    return this.constructionReportForm.controls[controlName].hasError(error);
  }

  hasErrorFormAndTouched(controlName: string, error: string): boolean {
    if (! this.constructionReportForm.controls[controlName].touched) { return false; }

    return this.hasErrorForm(controlName, error);
  }

}
