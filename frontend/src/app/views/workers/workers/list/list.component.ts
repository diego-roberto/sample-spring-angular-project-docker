import { Observable } from 'rxjs/Observable';
import { Component, Input, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _c from 'lodash/collection';
import * as _a from 'lodash/array';

import { MdSnackBar, MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Worker } from 'app/shared/models/worker.model';
import { WorkerService } from 'app/shared/services/worker.service';

import { WorkerReportDialogComponent } from './worker-report-dialog/worker-report-dialog.component';
import { PermissionService } from '../../../../shared/services/permission.service';
import { Supplier } from '../../../../shared/models/supplier.model';
import { SupplierService } from '../../../../shared/services/supplier.service';
import { WorkerEditAllDialogComponent } from './worker-edit-all-dialog/worker-edit-all-dialog.component';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})

export class WorkerListComponent implements OnInit {

  scrollWorkers = [];
  workersList: Worker[];
  workersFilteredList: Worker[];
  workersRequest: {
    number: number,
    numberOfElements?: number,
    totalPages?: number,
    last: boolean,
    first: boolean

    workers: Worker[],
  } = { first: true, last: true, workers: [], number: 0 }

  cardWorkersList: { title, workers: Worker[] }[] = [];
  cardWorkersLineList: { title, workers: Worker[] }[] = [];
  cardScrollWorkers = [];

  workersMap = new Map<String, Worker[]>();

  ALPHABETICAL = { field: 'name asc', order: 'asc' };
  FIRST_SAVED = { field: 'createdAt asc', order: 'asc' };
  LAST_SAVED = { field: 'createdAt desc', order: 'desc' };
  showSearch = false;
  showListDashboard = true;
  selectedOrder: string = this.ALPHABETICAL.field;
  selectedCbo: any;
  selectedCompany: any;
  selectedActives: any;
  open = false;
  fixed = false;
  spin = true;
  direction = 'up';
  animationMode = 'fling';
  loading = true;
  showPrintLoader = false;
  showFabButton = false;
  searchValue = '';

  activeFilters = {
    text: '',
    personal: true,
    outsourced: true,
  };

  lineCardAmount = 0;
  // para calcular cards/linha
  cardWidth = 142;
  containerWidth = 0;

  @ViewChild('bodyContent') bodyContent: ElementRef;

  @ViewChild('cardDiv') cardDiv: ElementRef;
  supplierList: Supplier[] = [];
  cbos: any[] = [];

  availableOrders = [
    { name: 'Alfabética', sort: this.ALPHABETICAL },
    { name: 'Primeiros cadastrados', sort: this.FIRST_SAVED },
    { name: 'Últimos cadastrados', sort: this.LAST_SAVED }
  ];

  availableActives = [
    { name: 'Ativos', id: true },
    { name: 'Inativos', id: false },
  ];

  isSearch: boolean;
  constructor(public permissionService: PermissionService, private supplierService: SupplierService, private router: Router, private route: ActivatedRoute, public service: WorkerService, public dialog: MdDialog) {
  }

  ngOnInit() {
    var filter = JSON.parse(sessionStorage.getItem('worker_filter'))
    if (filter != null) {
      this.storagedFilter(filter);
      this.fetchWorkers(0)
    } else {
      this.isSearch = false;
      this.fetchWorkers(0)
    }

    this.loadSupplierList();
    this.loadCbos();
    this.setShowFabButton();
  }

  setShowFabButton() {
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        this.showFabButton = true;
      }
    }, 200);
  }

  hasWorkerList() {
    return !!this.workersFilteredList.length;
  }

  fetchWorkers(page: number) {
    let contractTypes = [];
    if (this.activeFilters.personal) {
      contractTypes.push('Próprio');
    }
    if (this.activeFilters.outsourced) {
      contractTypes.push('Terceiro');
    }

    let filter = {
      name: this.activeFilters.text,
      cbosIds: this.selectedCbo,
      suppliersIds: this.selectedCompany,
      contractTypes: contractTypes,
      activatedStatus: this.selectedActives,
      fieldOrderBy: this.selectedOrder,
    }

    sessionStorage.setItem('worker_filter', JSON.stringify(filter))

    this.service.getWorkerListByFilterAndPage(filter, page).subscribe((response) => {
      this.workersRequest = response;
      this.workersFilteredList = this.workersRequest.workers;
      this.loading = false;
    });
  }

  previousPage() {
    this.fetchWorkers(this.workersRequest.number - 1)
  }

  nextPage() {
    this.fetchWorkers(this.workersRequest.number + 1)
  }

  search() {
    this.isSearch = true;
    this.fetchWorkers(0)
  }

  storagedFilter(filtered) {
    let contractTypes = filtered.contractTypes
    if (!contractTypes.includes('Terceiro')) {
      this.toggleActiveFilter('outsourced')
    }
    if (!contractTypes.includes('Próprio')) {
      this.toggleActiveFilter('personal')
    }

    if (filtered.name != undefined) {
      this.filterByText(filtered.name);
    }

    if (filtered.cbosIds != undefined) {
      this.selectedCbo = filtered.cbosIds
    }

    if (filtered.suppliersIds != undefined) {
      this.selectedCompany = filtered.suppliersIds
    }

    if (filtered.activatedStatus != undefined) {
      this.selectedActives = filtered.activatedStatus
    }

    if (filtered.fieldOrderBy == 'createdAt asc') {
      this.selectedOrder = this.FIRST_SAVED.field;
    } else if (filtered.fieldOrderBy == 'createdAt desc') {
      this.selectedOrder = this.LAST_SAVED.field;
    } else {
      this.selectedOrder = this.ALPHABETICAL.field;
    }

    this.isSearch = true;
  }

  clearstoragedFilter() {

    this.activeFilters.text
    this.selectedCbo = undefined;
    this.selectedCompany = undefined;
    this.selectedActives = undefined;
    this.selectedOrder = this.ALPHABETICAL.field;
    this.activeFilters = {
      text: '',
      personal: true,
      outsourced: true,
    }

    this.searchValue = '';
    this.isSearch = false;

    this.fetchWorkers(0)
    sessionStorage.removeItem('worker_filter');
  }

  loadSupplierList() {
    this.supplierService.getAllSupplierList().subscribe(response => {
      this.supplierList = response;
    },
      error => {
        //  this.appMessage.errorHandle(error, null);
      });
  }

  loadCbos() {
    this.service.getFunctions().subscribe(response => {
      this.cbos = response;
    },
      error => {
        //  this.appMessage.errorHandle(error, null);
      });
  }

  editWorker(id: number) {
    const urlEditing = '/workers/' + id + '/edit';
    this.router.navigate([urlEditing], { relativeTo: this.route });
  }

  deleteWorker(worker: Worker) {
    this.service.deleteWorker(worker);
  }

  redirectTo(path) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  toggleListDashboard() {
    this.showListDashboard = !this.showListDashboard;
    ;//  this.filterWorkers();
  }

  toggleActiveFilter(filterName) {
    this.activeFilters[filterName] = !this.activeFilters[filterName];
    //  this.filterWorkers();
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText(storageFilter = '') {
    if (storageFilter) {
      this.searchValue = storageFilter;
      this.activeFilters.text = storageFilter;
    } else {
      this.activeFilters.text = this.searchValue.trim();
      this.search();
    }
  }

  order(sort: { field, order }) {
    if (this.showListDashboard) {
      this.workersList = _c.orderBy(this.workersList, ['cbos.id', sort.field], ['asc', sort.order]);
      this.workersRequest.workers = _c.orderBy(this.workersList, ['cbos.id', sort.field], ['asc', sort.order]);
      this.workersFilteredList = _c.orderBy(this.workersFilteredList, ['cbos.id', sort.field], ['asc', sort.order]);
    } else {
      for (const group of this.cardWorkersList) {
        group.workers = _c.orderBy(group.workers, [sort.field], [sort.order]);
      }
      this.organizeCard();
    }
  }

  filterWorkers() {
    if (this.showListDashboard) {
      this.filterListWorkers();
    } else {
      this.organizeCard();
    }
  }

  filterListWorkers() {
    this.workersFilteredList = this.workersRequest.workers.filter(worker =>
      !(this.activeFilters.personal && !(worker.contractType === 'Terceiro')) &&
      !(this.activeFilters.outsourced && (worker.contractType === 'Terceiro')) &&
      !(this.activeFilters.text.length > 0 && worker.name.toLowerCase().indexOf(this.activeFilters.text.toLowerCase()) === -1)
    );
  }

  lastIndex(worker: Worker) {
    const index = _a.findIndex(this.workersFilteredList, ['cbos.id', worker.cbos.id]);

    if (worker === this.workersFilteredList[index]) {
      return true;
    }
    return false;
  }

  getParentScroll() {
    return this.bodyContent.nativeElement;
  }

  @HostListener('resize', ['$event.detail.width'])
  public reorganizeCard(newWidth: number) {
    if (newWidth !== this.containerWidth) {
      this.containerWidth = newWidth;
      const newAmount = Math.floor(newWidth / this.cardWidth);
      if (this.lineCardAmount !== newAmount) {
        this.lineCardAmount = newAmount;
        this.organizeCard();
      }
    }
  }

  private organizeCard() {
    this.cardWorkersLineList = [];
    const filteredCardWorkers = this.cardWorkersList;
    for (const group of filteredCardWorkers) {
      const index = this.cardWorkersLineList.length === 0 ? 0 : this.cardWorkersLineList.length;

      const workersCopy =
        group.workers.filter(worker =>
          !(this.activeFilters.personal && !(worker.contractType === 'Terceiro')) &&
          !(this.activeFilters.outsourced && (worker.contractType === 'Terceiro')) &&
          !(this.activeFilters.text.length > 0 && worker.name.toLowerCase().indexOf(this.activeFilters.text.toLowerCase()) === -1));

      while (workersCopy.length > 0) {
        this.cardWorkersLineList.push({ title: null, workers: workersCopy.splice(0, this.lineCardAmount) });
      }
      if (this.cardWorkersLineList[index]) {
        this.cardWorkersLineList[index].title = group.title;
      }
    }
  }

  public cardLineTrack(index: number, item): number {
    return item.workers[item.workers.length - 1].id;
  }

  toShowPrintLoader(value: boolean) {
    this.showPrintLoader = value;
  }

  openWorkerReportDialog() {
    const dialogRef = this.dialog.open(WorkerReportDialogComponent);
  }

  openWorkerEditAllDialog() {
    const dialogRef = this.dialog.open(WorkerEditAllDialogComponent);
    dialogRef.componentInstance.reloadWorkers = () => this.fetchWorkers(this.workersRequest.number);
  }
}
