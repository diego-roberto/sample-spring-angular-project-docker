import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSelectChange, MdDialog } from '@angular/material';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { SupplierService } from 'app/shared/services/supplier.service';
import { PermissionService } from 'app/shared/services/permission.service';

import { Supplier } from 'app/shared/models/supplier.model';
import { SupplierReportDialogComponent } from './supplier-report-dialog/supplier-report-dialog.component';

@Component({
  selector: 'supplier-list',
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class SupplierListComponent implements OnInit {

  selectedOrder: OrderByEnum = OrderByEnum.LAST_SAVED;
  availableOrders = [
    { name: 'Últimos cadastrados', code: OrderByEnum.LAST_SAVED },
    { name: 'Primeiros cadastrados', code: OrderByEnum.FIRST_SAVED },
    { name: 'Ordem Alfabética', code: OrderByEnum.ALPHABETIC }
  ];

  searchValue: string = '';
  supplierList: Supplier[] = [];
  supplierListRequest: SupplierListRequest = new SupplierListRequest();
  supplierListFilter: SupplierListFilter = new SupplierListFilter();

  loadingStack: Set<string> = new Set<string>();
  showSearch: boolean;

  constructor(
    private dialog: MdDialog,
    private router: Router,
    private route: ActivatedRoute,
    private appMessageService: AppMessageService,
    public permissionService: PermissionService,
    private supplierService: SupplierService
  ) { }

  ngOnInit() {
    this.supplierListRequest.quantityPerPage = 30;
    this.supplierListRequest.orderBy = OrderByEnum.LAST_SAVED;
    this.supplierListFilter = new SupplierListFilter();
    this.showSearch = false;
    var filter = JSON.parse(sessionStorage.getItem('supplier_filter'))
    if (filter != null) {
      this.storagedFilter(filter);
    } else {
      this.supplierListFilter.activeStatus = true;
      this.supplierListFilter.inactiveStatus = true;
    }

    this.doApplyFilter();
  }

  redirectTo(route) {
    this.router.navigate([route], { relativeTo: this.route });
  }

  getSupplierList() {
    this.addToLoadingStack('getSupplierList');
    this.supplierService.getSupplierList(this.supplierListRequest).subscribe(response => {
      this.supplierList = response.supplierList;
      this.supplierListRequest.supplierCount = response.supplierCount;
      this.removeFromLoadingStack('getSupplierList');
    },
      error => {
        this.appMessageService.errorHandle(error, 'Erro ao recuperar a lista de empresas fornecedoras!');
        this.removeFromLoadingStack('getSupplierList');
      });
  }

  hasSupplierList(): boolean {
    return this.supplierList && this.supplierList.length > 0;
  }

  showSearchChangeHandler(showSearch: boolean) {
    this.showSearch = showSearch;
  }

  orderByChangeHandler(event: MdSelectChange) {
    this.getSupplierList();
  }

  doApplyFilter() {
    let filter = {
      name: this.supplierListFilter.text,
      activeStatus: this.supplierListFilter.activeStatus,
      inactiveStatus: this.supplierListFilter.inactiveStatus
    }
    sessionStorage.setItem('supplier_filter', JSON.stringify(filter))
    this.supplierListRequest.page = 1;
    this.supplierListRequest.filterBy = Object.assign(new SupplierListFilter(), this.supplierListFilter);
    this.getSupplierList();
  }

  toggleActiveStatusFilter() {
    this.supplierListFilter.activeStatus = !this.supplierListFilter.activeStatus;
    this.doApplyFilter();
  }

  toggleInactiveStatusFilter() {
    this.supplierListFilter.inactiveStatus = !this.supplierListFilter.inactiveStatus;
    this.doApplyFilter();
  }

  nextPage() {
    this.supplierListRequest.page = this.supplierListRequest.page + 1;
    this.getSupplierList();
  }

  previousPage() {
    this.supplierListRequest.page = this.supplierListRequest.page - 1;
    this.getSupplierList();
  }

  previousPageDisabled() {
    return this.supplierListRequest.page <= 1;
  }

  nextPageDisabled() {
    return this.supplierListRequest.page >= this.supplierListRequest.supplierCount / this.supplierListRequest.quantityPerPage;
  }

  addToLoadingStack(key: string) {
    this.loadingStack.add(key);
  }

  removeFromLoadingStack(key: string) {
    this.loadingStack.delete(key);
  }

  isLoadingActive(key?: string): boolean {
    if (key) { return this.loadingStack.has(key); }

    return this.loadingStack.size > 0;
  }

  openPrintSupplierDocumentationReportDialog() {
    const dialogRef = this.dialog.open(SupplierReportDialogComponent);
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText(storageFilter = '') {
    if (storageFilter) {
      this.supplierListFilter.text = storageFilter;
    } else {
      this.supplierListFilter.text = this.searchValue.trim();
      this.doApplyFilter();
    }
  }

  storagedFilter(filtered) {
    if (filtered.name != undefined) {
      this.filterByText(filtered.name);
    }
    if (filtered.activeStatus != undefined) {
      this.supplierListFilter.activeStatus = filtered.activeStatus;
    }
    if (filtered.inactiveStatus != undefined) {
      this.supplierListFilter.inactiveStatus = filtered.inactiveStatus;
    }
  }

  clearstoragedFilter() {
    this.searchValue = '';
    this.showSearch = false;

    this.supplierListFilter = {
      text: '',
      activeStatus: true,
      inactiveStatus: true,
    }

    this.doApplyFilter();
    sessionStorage.removeItem('supplier_filter');
  }

}

enum OrderByEnum {
  LAST_SAVED,
  FIRST_SAVED,
  ALPHABETIC
}

class SupplierListFilter {
  text: string;
  activeStatus: boolean;
  inactiveStatus: boolean;
}

class SupplierListRequest {
  page: number;
  supplierCount: number;
  quantityPerPage: number;
  orderBy: OrderByEnum;
  filterBy: SupplierListFilter;

  isFilterApplied(): boolean {
    if (this.filterBy === undefined || this.filterBy === null) { return false; }
    if (
      (this.filterBy.text === undefined || this.filterBy.text === null || this.filterBy.text.trim() === '') &&
      (this.filterBy.activeStatus === this.filterBy.inactiveStatus)
    ) { return false; }
    return true;
  }
}
