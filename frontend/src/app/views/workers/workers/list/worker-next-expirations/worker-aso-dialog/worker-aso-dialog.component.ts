import { Component, Inject, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl, } from '@angular/forms';
import { MdSnackBar, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';

import { AsoService } from 'app/shared/services/aso.service';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { SupplierService } from 'app/shared/services/supplier.service';

import { CnpjPipe } from 'app/shared/pipes/common.pipe';
import { AsoItem } from './../../../../../../shared/models/aso-item.model';

import { SupplierReportType } from 'app/shared/models/supplier-report-type.model';
import { Supplier } from 'app/shared/models/supplier.model';

import { UtilValidators } from 'app/shared/util/validators.util';
import { openNewTab } from 'app/shared/util/open-new-tab';
import * as Moment from 'moment';

@Component({
  selector: 'worker-aso-dialog',
  templateUrl: 'worker-aso-dialog.component.html',
  styleUrls: ['./worker-aso-dialog.component.scss']
})

export class WorkerAsoDialogComponent implements OnInit {

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filterSelected') filterSelected: ElementRef;

  title = 'GERAR RELATÓRIO';
  workerAsoItemForm: FormGroup;
  loading = false;
  invalid = true;
  hiredType: string;
  workerStatus: string;
  statusType: string;
  columnOrder: string;
  checkedActive = false;

  supplierForm: FormGroup;
  supplierReportType = SupplierReportType;

  suppliers: Supplier[];
  suppliersSelected: Supplier[];

  suppliersFiltered: Supplier[];
  suppliersSelectedFiltered: Supplier[];

  suppliersVirtualScrollItems: Supplier[];
  suppliersSelectedVirtualScrollItems: Supplier[];

  selectedToAdd = [];
  selectedToRemove = [];

  @Input() workerAsoItem: AsoItem;
  @Input() totalSteps = 1;
  @Input() step = 1;

  @Output() toShowPrintLoader: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public dialogRef: MdDialogRef<WorkerAsoDialogComponent>,
    public snackBar: MdSnackBar,
    private asoService: AsoService,
    private appMessage: AppMessageService,
    private supplierService: SupplierService,
    private cnpjPipe: CnpjPipe,

    @Inject(MD_DIALOG_DATA) public data: any,
  ) {
    this.workerAsoItemForm = new FormGroup({
      action: new FormControl(''),
      beginAt: new FormControl('', [Validators.required, UtilValidators.date, this.validateBeginAt]),
      endAt: new FormControl('', [Validators.required, UtilValidators.date, this.validateEndAt]),
    });
  }

  ngOnInit() {
    this.hiredType = "terceiro";
    this.workerStatus = "todos";
    this.statusType = "todos";
    this.columnOrder = "nome";
    this.loadSupplierList();
  }

  enableSuppliers() {
    return this.hiredType === "terceiro";
  }

  hiredChange(value) {
    this.hiredType = value.value;
  }

  workerStatusChange(value) {
    this.workerStatus = value.value;
  }

  statusTypeChange(value) {
    this.statusType = value.value;
  }

  columnOrderChange(value) {
    this.columnOrder = value.value;
  }

  hasErrorForm(attr: string, type: string): boolean {
    if (this.workerAsoItemForm.controls[attr].touched) {
      return this.workerAsoItemForm.controls[attr].hasError(type);
    } else {
      return false;
    }
  }

  toPrintAsoReport() {
    
    this.loading = true;

    try {
      if (this.hiredType === "terceiro") {
        if (Array.isArray(this.suppliersSelected) && this.suppliersSelected.length == 0) {
          this.suppliersSelected = this.suppliers;
        }
      } else if (this.hiredType === "proprio") {
        this.suppliersSelected = [];
      }

      const dtInit = this.workerAsoItemForm.controls['beginAt'].value;

      const dtFim = this.workerAsoItemForm.controls['endAt'].value;

      let suppliersIDs: number[] = [];
      if (this.suppliersSelected && this.suppliersSelected.length > 0) {
        suppliersIDs = this.suppliersSelected.map(supplier => supplier.id);
      }

      const request = {
        initialPeriod: dtInit,
        finalPeriod: dtFim,
        suppliersIds: suppliersIDs,
        workerStatus: this.workerStatus,
        statusType: this.statusType,
        columnOrder: this.columnOrder,
      };

      this.toShowPrintLoader.emit(true);
      this.asoService.toPrintAsoReport(request).subscribe((response) => {
        openNewTab(URL.createObjectURL(response));

        this.loading = false;
        this.toShowPrintLoader.emit(false);
        this.dialogRef.close();
      },
        (error) => {
          this.loading = false;
          this.toShowPrintLoader.emit(false);
          this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
        });
    } catch (error) {
      console.log(error);
    }
  }


  loadSupplierList() {
    this.supplierService.getAllSupplierList().subscribe(suppliers => {
      this.suppliers = suppliers;
      this.doSuppliersOrderByTraddingName();

      this.suppliersSelected = [];
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  isEnabledDate(atributo: string): boolean {
    return this.workerAsoItemForm.controls[atributo].disabled;
  }

  isInvalid() {
    return (this.workerAsoItemForm.controls['beginAt'] != null && this.workerAsoItemForm.controls['endAt'] != null);
  }

  validateBeginAt(control: AbstractControl) {
    if (!control || !control.parent || !control.parent.controls['beginAt'] || !control.parent.controls['beginAt'].value) {
      return null;
    }
    const dateEnd = Moment(control.parent.controls['endAt'].value);
    const dateBegin = Moment(control.parent.controls['beginAt'].value);
    if (dateEnd.isBefore(dateBegin)) {
      return { isbefore: true };
    }
    return null;
  }

  validateEndAt(control: AbstractControl) {
    if ((!control || !control.parent) || (!control.parent.controls['beginAt'] || !control.parent.controls['beginAt'].value)
      || (!control.parent.controls['endAt'] || !control.parent.controls['endAt'].value)) {
      return null;
    }

    const dateBegin = Moment(control.parent.controls['beginAt'].value);
    const dateEnd = Moment(control.parent.controls['endAt'].value);
    if (dateEnd.isBefore(dateBegin)) {
      return { isbefore: true };
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
    this.checkedActive = false;
    this.selectedToAdd = [];
    this.doSuppliersSelectedOrderByTraddingName();
  }

  doRemove() {
    this.suppliers = this.suppliers.concat(this.selectedToRemove);
    this.suppliersSelected = this.suppliersSelected.filter(item => !this.selectedToRemove.includes(item));
    this.selectedToRemove = [];
    this.doSuppliersOrderByTraddingName();
  }

  doClearFilterSuppliers() {
    this.filter.nativeElement.value = '';
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  doClearFilterSuppliersSelected() {
    this.filterSelected.nativeElement.value = '';
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  doFilterSuppliers(filterValue: string) {
    this.doFilterSuppliersUnselected(filterValue);
    this.doFilterSuppliersSelected(filterValue);
  }

  doFilterSuppliersSelected(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.suppliersSelectedFiltered = this.suppliersSelected;
    } else {
      this.suppliersSelectedFiltered = this.suppliersSelected.filter(supplier =>
        supplier.traddingName.toLowerCase().includes(filterValue.toLowerCase()) ||
        supplier.cnpj.toLowerCase().includes(filterValue.toLowerCase()) ||
        this.cnpjPipe.transform(supplier.cnpj).toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doFilterSuppliersUnselected(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.suppliersFiltered = this.suppliers;
    } else {
      this.suppliersFiltered = this.suppliers.filter(supplier =>
        supplier.traddingName.toLowerCase().includes(filterValue.toLowerCase()) ||
        supplier.cnpj.toLowerCase().includes(filterValue.toLowerCase()) ||
        this.cnpjPipe.transform(supplier.cnpj).toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  setActiveSuppliersFilter() {
    this.checkedActive = !this.checkedActive;
    if (this.checkedActive) {
      this.suppliersFiltered = this.suppliersFiltered.filter(supplier => supplier.active === true);
    } else {
      this.suppliersFiltered = this.suppliers;
    }
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


}
