import { MdDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as Moment from 'moment';
import { UtilValidators } from 'app/shared/util/validators.util';
import { isNullOrUndefined } from 'util';
import { CnpjPipe } from 'app/shared/pipes/common.pipe';

import { SupplierReportType } from 'app/shared/models/supplier-report-type.model';
import { Supplier } from 'app/shared/models/supplier.model';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { SupplierService } from 'app/shared/services/supplier.service';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'supplier-report-dialog',
  templateUrl: './supplier-report-dialog.component.html',
  styleUrls: ['./supplier-report-dialog.component.scss']
})
export class SupplierReportDialogComponent implements OnInit {

  @ViewChild('filter') filter: ElementRef;

  supplierReportForm: FormGroup;
  supplierReportType = SupplierReportType;
  loading = false;

  reportRequest = {
    initialPeriod: undefined,
    finalPeriod: undefined,
    items: undefined,
  };

  suppliers: Supplier[];
  suppliersSelected: Supplier[];

  suppliersFiltered: Supplier[];
  suppliersSelectedFiltered: Supplier[];

  suppliersVirtualScrollItems: Supplier[];
  suppliersSelectedVirtualScrollItems: Supplier[];

  filterValue: string;

  selectedToAdd = [];
  selectedToRemove = [];
  checkedActive = false;

  constructor(
    public dialogRef: MdDialogRef<SupplierReportDialogComponent>,
    private appMessage: AppMessageService,
    private supplierService: SupplierService,
    private cnpjPipe: CnpjPipe,
  ) {
    this.supplierReportForm = new FormGroup({
      supplierReportType: new FormControl(SupplierReportType.DOCUMENTS_CONTROL, [Validators.required]),
      initialPeriod: new FormControl('', [Validators.required, UtilValidators.date, this.validatePeriod]),
      finalPeriod: new FormControl('', [Validators.required, UtilValidators.date, this.validatePeriod]),
    });
  }

  ngOnInit() {
    if (SupplierReportType.values().length <= 1) {
      this.supplierReportForm.controls.supplierReportType.disable();
    }

    this.supplierService.getAllSupplierList().subscribe(suppliers => {
      this.suppliers = suppliers;
      this.suppliersFiltered = suppliers;
      this.doSuppliersOrderByTraddingName();

      this.suppliersSelected = [];
    });
  }

  getReportLabelByType(reportType: any) {
    if (reportType === SupplierReportType.DOCUMENTS_CONTROL) { return 'Controle de Documentos'; }
  }

  doPrintReport() {
    this.loading = true;
    if (this.supplierReportForm.controls.supplierReportType.value === SupplierReportType.DOCUMENTS_CONTROL) {
      this.doPrintDocumentsControlReport();
    }
  }

  doPrintDocumentsControlReport() {
    this.reportRequest.items = this.suppliersSelected.map(supplier => supplier.id);

    this.supplierService.printSupplierDocumentationReport(this.reportRequest).subscribe((response) => {
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

  setAllToAdd() {
    if (this.isAllToAdd()) {
      this.selectedToAdd = [];
    } else {
      this.selectedToAdd = this.suppliersFiltered;
    }
  }

  isAllToAdd(): boolean {
    if (this.isAllToAddDisabled()) { return false; }
    return !this.suppliersFiltered.some(supplier => !this.selectedToAdd.includes(supplier));
  }

  isAllToAddDisabled(): boolean {
    return isNullOrUndefined(this.suppliersFiltered) || this.suppliersFiltered.length === 0;
  }

  setSelectedToAdd(supplier: Supplier) {
    if (!this.selectedToAdd.includes(supplier)) {
      this.selectedToAdd.push(supplier);
    } else {
      this.selectedToAdd = this.selectedToAdd.filter(item => item !== supplier);
    }
  }

  setAllToRemove() {
    if (this.isAllToRemove()) {
      this.selectedToRemove = [];
    } else {
      this.selectedToRemove = this.suppliersSelectedFiltered;
    }
  }

  isAllToRemove(): boolean {
    if (this.isAllToRemoveDisabled()) { return false; }
    return !this.suppliersSelectedFiltered.some(supplier => !this.selectedToRemove.includes(supplier));
  }

  isAllToRemoveDisabled(): boolean {
    return isNullOrUndefined(this.suppliersSelectedFiltered) || this.suppliersSelectedFiltered.length === 0;
  }

  setSelectedToRemove(supplier: Supplier) {
    if (!this.selectedToRemove.includes(supplier)) {
      this.selectedToRemove.push(supplier);
    } else {
      this.selectedToRemove = this.selectedToRemove.filter(item => item !== supplier);
    }
  }

  doAdd() {
    this.suppliersSelected = this.suppliersSelected.concat(this.selectedToAdd);
    this.suppliers = this.suppliers.filter(item => !this.selectedToAdd.includes(item));
    this.selectedToAdd = [];
    this.doSuppliersSelectedOrderByTraddingName();
  }

  doRemove() {
    this.suppliers = this.suppliers.concat(this.selectedToRemove);
    this.suppliersSelected = this.suppliersSelected.filter(item => !this.selectedToRemove.includes(item));
    this.selectedToRemove = [];
    this.doSuppliersOrderByTraddingName();
  }

  setActiveSuppliersFilter() {
    this.checkedActive = !this.checkedActive;
    this.suppliersFiltered = this.filterSupplierList(this.suppliers);

    if (this.checkedActive) {
      this.selectedToAdd = this.filterSupplierList(this.selectedToAdd);
    }
  }

  doClearFilterSuppliers() {
    this.filter.nativeElement.value = '';
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  doFilterSuppliers(filterValue: string) {
    this.filterValue = filterValue;

    this.suppliersSelectedFiltered = this.filterSupplierList(this.suppliersSelected, false);
    this.suppliersFiltered = this.filterSupplierList(this.suppliers);
  }

  filterSupplierList(list: Supplier[], filterByStatus = true){
    let suppliersFiltered = list;

    if(!!this.filterValue){
      suppliersFiltered = list.filter(supplier =>
        supplier.traddingName.toLowerCase().includes(this.filterValue.toLowerCase()) ||
        supplier.cnpj.toLowerCase().includes(this.filterValue.toLowerCase()) ||
        this.cnpjPipe.transform(supplier.cnpj).toLowerCase().includes(this.filterValue.toLowerCase())
      );
    }

    if(filterByStatus && this.checkedActive){
      suppliersFiltered = suppliersFiltered.filter(supplier => !!supplier.active);
    }

    return suppliersFiltered;
  }

  doSuppliersOrderByTraddingName() {
    this.suppliers = this.suppliers.sort(function (a, b) {
      return a.traddingName.localeCompare(b.traddingName);
    });
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  doSuppliersSelectedOrderByTraddingName() {
    this.suppliersSelected = this.suppliersSelected.sort(function (a, b) {
      return a.traddingName.localeCompare(b.traddingName);
    });
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  isDoAddDisabled(): boolean {
    return isNullOrUndefined(this.selectedToAdd) || this.selectedToAdd.length === 0;
  }

  isDoRemoveDisabled(): boolean {
    return isNullOrUndefined(this.selectedToRemove) || this.selectedToRemove.length === 0;
  }

  showEmptySelectionMessage(): boolean {
    return isNullOrUndefined(this.suppliersSelected) || this.suppliersSelected.length === 0;
  }

  hasErrorForm(controlName: string, error: string): boolean {
    return this.supplierReportForm.controls[controlName].hasError(error);
  }

  hasErrorFormAndTouched(controlName: string, error: string): boolean {
    if (!this.supplierReportForm.controls[controlName].touched) { return false; }

    return this.hasErrorForm(controlName, error);
  }

}
