import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import * as Moment from 'moment';
import { UtilValidators } from 'app/shared/util/validators.util';
import { isNullOrUndefined } from 'util';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { ChecklistService } from 'app/shared/services/checklist.service';
import { Construction } from 'app/shared/models/construction.model';
import { ConstructionsService } from 'app/shared/services/constructions.service';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'checklist-report-dialog',
  templateUrl: 'checklist-report-dialog.component.html',
  styleUrls: ['./checklist-report-dialog.component.scss']
})
export class ChecklistReportDialogComponent implements OnInit {

  @ViewChild('filter') filter: ElementRef;

  checklistReportItemForm: FormGroup;
  reportTypes: string[] = ['XML', 'PDF'];

  checkedActive = false;
  loading: boolean = false;

  constructions: Construction[];
  constructionsSelected: Construction[];

  constructionsFiltered: Construction[];
  constructionsSelectedFiltered: Construction[];

  constructionsVirtualScrollItems: Construction[];
  constructionsSelectedVirtualScrollItems: Construction[];

  selectedToAdd = [];
  selectedToRemove = [];

  reportRequest = {
    constructionIds: undefined,
    reportType: 'PDF',
    initialDate: undefined,
    finalDate: undefined,
    typeReturn: "web",
  };

  constructor(
    public dialogRef: MdDialogRef<ChecklistReportDialogComponent>,
    private appMessage: AppMessageService,
    private constructionsService: ConstructionsService,
    private checklistsService: ChecklistService,
  ) {
    this.checklistReportItemForm = new FormGroup({
      reportType: new FormControl('', [Validators.required]),
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

    this.getConstructionsByUser();
  }

  ngOnInit() {
    // This is intentional
     }

  getConstructionsByUser() {
    this.constructionsService.getConstructionsEssential().subscribe(constructions => {
      this.constructions = constructions;
      this.doConstructionsOrderByTraddingName();

      this.constructionsSelected = [];
    });
  }

  printReport() {

    if (isNullOrUndefined(this.constructionsSelectedFiltered) || this.constructionsSelectedFiltered.length === 0 ) {
      this.reportRequest.constructionIds = this.constructionsFiltered.map(construction => construction.id);
    } else {
      this.reportRequest.constructionIds = this.constructionsSelectedFiltered.map(construction => construction.id);
    }

    this.loading = true;

    if (this.reportRequest.reportType === 'PDF') {
      this.checklistsService.printChecklistReport(this.reportRequest)
        .subscribe((response) => {

          openNewTab(URL.createObjectURL(response));
          this.loading = false;
        }, _error => {
          this.loading = false;
          this.appMessage.showError('Ocorreu um erro durante a geração do relatório');
        });
    } else {
      this.checklistsService.printChecklistReportXML(this.reportRequest)
        .subscribe((response) => {

          this.loading = false;
        }, _error => {
          this.loading = false;
          this.appMessage.showError('Ocorreu um erro durante a geração do relatório');
        });
    }

  }

  closeDialog() {
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
    return this.checklistReportItemForm.controls[controlName].hasError(error);
  }

  hasErrorFormAndTouched(controlName: string, error: string): boolean {
    if (!this.checklistReportItemForm.controls[controlName].touched) { return false; }

    return this.hasErrorForm(controlName, error);
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

  setActiveFilter() {
    this.checkedActive = !this.checkedActive;
    if (this.checkedActive) {
      this.constructionsFiltered = this.constructionsFiltered.filter(construction => construction.status == 0);
    } else {
      this.constructionsFiltered = this.constructions;
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
    this.constructions.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    this.doFilterConstructions(this.filter.nativeElement.value);
  }

  doConstructionsSelectedOrderByTraddingName() {
    this.constructionsSelected.sort(function (a, b) {
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

}
