import { Component, Inject, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl, } from '@angular/forms';
import { MdSnackBar, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';

import { QualificationsService } from '../../../../../../shared/services/qualifications.service';
import { AppMessageService } from 'app/shared/util/app-message.service';

import { QualificationsItem } from 'app/shared/models/qualifications-item.model';

import { UtilValidators } from 'app/shared/util/validators.util';
import * as Moment from 'moment';
import { QualitiesService } from '../../../../../../shared/services/qualities.service';
import { Qualities } from '../../../../../../shared/models/qualities.model';

import { SupplierReportType } from 'app/shared/models/supplier-report-type.model';
import { Supplier } from 'app/shared/models/supplier.model';
import { SupplierService } from 'app/shared/services/supplier.service';

import { CnpjPipe } from 'app/shared/pipes/common.pipe';
import { isNullOrUndefined } from 'util';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'worker-qualification-dialog',
  templateUrl: './worker-qualification-dialog.component.html',
  styleUrls: ['./worker-qualification-dialog.component.scss']
})
export class WorkerQualificationDialogComponent implements OnInit {
  
  title = 'GERAR RELATÓRIO';
  invalid = true;
  workerQualificationsItemForm: FormGroup;
  qualificationsLoading = false;
  hiredType: string;
  workerStatus: string;
  statusType: string;
  columnOrder: string;
  supplierForm: FormGroup;
  checkedActive = false;
  loading = false;

  @Input() totalSteps = 1;
  @Input() step = 1;
  @Input() workerQualificationsItem: QualificationsItem;

  @Output() toShowPrintLoader: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filterSelected') filterSelected: ElementRef;
  @ViewChild('qualitiesVirtualScroll') qualitiesVirtualScroll: VirtualScrollComponent;
  @ViewChild('qualitiesSelectedVirtualScroll') qualitiesSelectedVirtualScroll: VirtualScrollComponent;

  companyQualities: Qualities[] = [];
  selectedQualities: Qualities[] = [];

  selectedQualitiesFiltered: Qualities[] = [];
  companyQualitiesFiltered: Qualities[] = [];

  qualitiesVirtualScrollItems: Qualities[] = [];
  qualitiesSelectedVirtualScrollItems: Qualities[] = [];

  selectedToAdd = [];
  selectedToRemove = [];


  selectedSupplierToAdd = [];
  selectedSupplierToRemove = [];

  checkedAddAll = false;
  checkedRemoveAll = false;

  supplierReportType = SupplierReportType;

  suppliers: Supplier[];
  suppliersSelected: Supplier[];

  suppliersFiltered: Supplier[];
  suppliersSelectedFiltered: Supplier[];

  suppliersVirtualScrollItems: Supplier[];
  suppliersSelectedVirtualScrollItems: Supplier[];

  constructor( // NOSONAR
    public dialogRef: MdDialogRef<WorkerQualificationDialogComponent>,
    public snackBar: MdSnackBar,
    private qualificationsService: QualificationsService,
    private appMessage: AppMessageService,
    private qualitiesService: QualitiesService,
    private supplierService: SupplierService,
    private cnpjPipe: CnpjPipe,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) {
    this.workerQualificationsItemForm = new FormGroup({
      action: new FormControl(''),
      beginAt: new FormControl('', [Validators.required, UtilValidators.date, this.validateBeginAt]),
      endAt: new FormControl('', [Validators.required, UtilValidators.date, this.validateEndAt]),
    });
  }

  ngOnInit() {
    this.hiredType = "Próprio";
    this.workerStatus = "todos";
    this.statusType = "todos";
    this.columnOrder = "nome";

    this.qualitiesService.getQualitiesList().subscribe(qualities => {
      this.companyQualities = qualities;
      this.doCompanyQualitiesOrderByName();

      if (this.selectedQualities && this.selectedQualities.length > 0) {
        this.companyQualities = this.companyQualities.filter(item => !this.selectedQualities.find(item2 => item.id === item2.id));
      } else {
        this.selectedQualities = [];
      }
      this.doSelectedQualitiesOrderByName();
    });
    this.loadSupplierList();
  }

  isHiringTerceiro() {
    return this.hiredType === "Terceiro";
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
    if (this.workerQualificationsItemForm.controls[attr].touched) {
      return this.workerQualificationsItemForm.controls[attr].hasError(type);
    } else {
      return false;
    }
  }

  toPrintQualificationsReport() {
    try {
      if (this.hiredType === "Terceiro") {
        if (Array.isArray(this.suppliersSelected) && this.suppliersSelected.length == 0) { //List is Empty?
          this.suppliersSelected = this.suppliers;
        }
      } else if (this.hiredType === "Próprio") {
        this.suppliersSelected = [];
      }

      const dtInit = this.workerQualificationsItemForm.controls['beginAt'].value;

      const dtFim = this.workerQualificationsItemForm.controls['endAt'].value;

      let qualitiesIDs: number[] = [];
      if (this.selectedQualities && this.selectedQualities.length > 0) {
        qualitiesIDs = this.selectedQualities.map(quality => quality.id);
      } else {
        qualitiesIDs = this.companyQualities.map(quality => quality.id);
      }

      let suppliersIds: number[] = [];
      if (this.suppliersSelected && this.suppliersSelected.length > 0) {
        suppliersIds = this.suppliersSelected.map(supplier => supplier.id);
      }

      const request = {
        initialPeriod: dtInit,
        finalPeriod: dtFim,
        printAll: true,
        suppliersIds: suppliersIds,
        workerStatus: this.workerStatus,
        statusType: this.statusType,
        items: qualitiesIDs,
        columnOrder: this.columnOrder,
      };

      this.loading = true;
      this.toShowPrintLoader.emit(true);
      this.qualificationsService.toPrintQualificationReport(request).subscribe((response) => {
        openNewTab(URL.createObjectURL(response));
  
        this.toShowPrintLoader.emit(false);
        this.loading = false;
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

  isEnabledDate(atributo: string): boolean {
    return this.workerQualificationsItemForm.controls[atributo].disabled;
  }

  isInvalid() {
    return (this.workerQualificationsItemForm.controls['beginAt'] != null && this.workerQualificationsItemForm.controls['endAt'] != null);
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

  setSelectedToAdd(quality: Qualities) {
    if (!this.selectedToAdd.includes(quality)) {
      this.selectedToAdd.push(quality);
    } else {
      this.selectedToAdd = this.selectedToAdd.filter(item => item !== quality);
    }
  }

  setSelectedToRemove(quality: Qualities) {
    if (!this.selectedToRemove.includes(quality)) {
      this.selectedToRemove.push(quality);
    } else {
      this.selectedToRemove = this.selectedToRemove.filter(item => item !== quality);
    }
  }

  doAdd() {
    this.selectedQualities = this.selectedQualities.concat(this.selectedToAdd);
    this.companyQualities = this.companyQualities.filter(item => !this.selectedToAdd.includes(item));
    this.selectedToAdd = [];
    this.checkedAddAll = false;
    this.doSelectedQualitiesOrderByName();
    this.doCompanyQualitiesOrderByName();
  }

  doRemove() {
    this.companyQualities = this.companyQualities.concat(this.selectedToRemove);
    this.selectedQualities = this.selectedQualities.filter(item => !this.selectedToRemove.includes(item));
    this.selectedToRemove = [];
    this.checkedRemoveAll = false;
    this.doSelectedQualitiesOrderByName();
    this.doCompanyQualitiesOrderByName();
  }

  doFilterSelectedQualities(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.selectedQualitiesFiltered = this.selectedQualities;
    } else {
      this.selectedQualitiesFiltered = this.selectedQualities.filter(quality =>
        quality.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doFilterCompanyQualities(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.companyQualitiesFiltered = this.companyQualities;
    } else {
      this.companyQualitiesFiltered = this.companyQualities.filter(quality =>
        quality.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doClearQualitiesFilter() {
    this.filter.nativeElement.value = '';
    this.doFilterCompanyQualities(this.filter.nativeElement.value);
  }

  doClearSelectedQualitiesFilter() {
    this.filterSelected.nativeElement.value = '';
    this.doFilterSelectedQualities(this.filterSelected.nativeElement.value);
  }

  doCompanyQualitiesOrderByName() {
    this.companyQualities.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    this.doFilterCompanyQualities(this.filter.nativeElement.value);
  }

  doSelectedQualitiesOrderByName() {
    this.selectedQualities.sort((a, b) =>
       a.name.localeCompare(b.name)
    );
    this.doFilterSelectedQualities(this.filterSelected.nativeElement.value);
  }

  setAllSelectedToAdd() {
    if (this.selectedToAdd.length === this.companyQualitiesFiltered.length) {
      this.selectedToAdd = [];
      this.checkedAddAll = !this.checkedAddAll;
    } else {
      this.selectedToAdd = this.companyQualitiesFiltered;
      this.checkedAddAll = !this.checkedAddAll;
    }
  }

  setAllSelectedToRemove() {
    if (this.selectedToRemove.length === this.selectedQualitiesFiltered.length) {
      this.selectedToRemove = [];
      this.checkedRemoveAll = !this.checkedRemoveAll;
    } else {
      this.selectedToRemove = this.selectedQualitiesFiltered;
      this.checkedRemoveAll = !this.checkedRemoveAll;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setAllSupplierToAdd() {
    if (this.isAllSupplierToAdd()) {
      this.selectedSupplierToAdd = [];
    } else {
      this.selectedSupplierToAdd = this.suppliersFiltered;
    }
  }

  isAllSupplierToAdd(): boolean {
    if (this.isAllSupplierToAddDisabled()) { return false; }
    return !this.suppliersFiltered.some(supplier => !this.selectedSupplierToAdd.includes(supplier));
  }

  isAllSupplierToAddDisabled(): boolean {
    return isNullOrUndefined(this.suppliersFiltered) || this.suppliersFiltered.length === 0;
  }

  setSelectedSupplierToAdd(supplier: Supplier) {
    if (!this.selectedSupplierToAdd.includes(supplier)) {
      this.selectedSupplierToAdd.push(supplier);
    } else {
      this.selectedSupplierToAdd = this.selectedSupplierToAdd.filter(item => item !== supplier);
    }
  }

  setAllSupplierToRemove() {
    if (this.isAllSupplierToRemove()) {
      this.selectedSupplierToRemove = [];
    } else {
      this.selectedSupplierToRemove = this.suppliersSelectedFiltered;
    }
  }

  isAllSupplierToRemove(): boolean {
    if (this.isAllSupplierToRemoveDisabled()) { return false; }
    return !this.suppliersSelectedFiltered.some(supplier => !this.selectedSupplierToRemove.includes(supplier));
  }

  isAllSupplierToRemoveDisabled(): boolean {
    return isNullOrUndefined(this.suppliersSelectedFiltered) || this.suppliersSelectedFiltered.length === 0;
  }

  setSelectedSupplierToRemove(supplier: Supplier) {
    if (!this.selectedSupplierToRemove.includes(supplier)) {
      this.selectedSupplierToRemove.push(supplier);
    } else {
      this.selectedSupplierToRemove = this.selectedSupplierToRemove.filter(item => item !== supplier);
    }
  }

  doAddSupplier() {
    this.suppliersSelected = this.suppliersSelected.concat(this.selectedSupplierToAdd);
    this.checkedActive = false;
    this.suppliers = this.suppliers.filter(item => !this.selectedSupplierToAdd.includes(item));
    this.selectedSupplierToAdd = [];
    this.doSuppliersSelectedOrderByTraddingName();
  }

  doRemoveSupplier() {
    this.suppliers = this.suppliers.concat(this.selectedSupplierToRemove);
    this.suppliersSelected = this.suppliersSelected.filter(item => !this.selectedSupplierToRemove.includes(item));
    this.selectedSupplierToRemove = [];
    this.doSuppliersOrderByTraddingName();
  }

  doClearFilterSuppliers() {
    this.filter.nativeElement.value = '';
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  doClearFilterSuppliersSelected() {
    this.filter.nativeElement.value = '';
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  filterSuppliers(filterValue: string) {
    return this.suppliers.filter(supplier =>
      supplier.traddingName.toLowerCase().includes(filterValue.toLowerCase()) ||
      supplier.cnpj.toLowerCase().includes(filterValue.toLowerCase()) ||
      this.cnpjPipe.transform(supplier.cnpj).toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  doFilterSuppliersSelected(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.suppliersSelectedFiltered = this.suppliersSelected;
    } else {
      this.suppliersSelectedFiltered = this.filterSuppliers(filterValue);
    }
  }

  doFilterSuppliersUnselected(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.suppliersFiltered = this.suppliers;
    } else {
      this.suppliersFiltered = this.filterSuppliers(filterValue);
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

  doFilterSuppliers(filterValue: string) {
    this.doFilterSuppliersUnselected(filterValue);
    this.doFilterSuppliersSelected(filterValue);
  }

  doSuppliersOrderByTraddingName() {
    this.suppliers.sort((a, b) =>
      a.traddingName.localeCompare(b.traddingName)
    );
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  doSuppliersSelectedOrderByTraddingName() {
    this.suppliersSelected.sort((a, b) =>
      a.traddingName.localeCompare(b.traddingName)
    );
    this.doFilterSuppliers(this.filter.nativeElement.value);
  }

  isDoAddSupplierDisabled(): boolean {
    return isNullOrUndefined(this.selectedSupplierToAdd) || this.selectedSupplierToAdd.length === 0;
  }

  isDoRemoveSupplierDisabled(): boolean {
    return isNullOrUndefined(this.selectedSupplierToRemove) || this.selectedSupplierToRemove.length === 0;
  }

  showEmptySupplierSelectionMessage(): boolean {
    return isNullOrUndefined(this.suppliersSelected) || this.suppliersSelected.length === 0;
  }
}
