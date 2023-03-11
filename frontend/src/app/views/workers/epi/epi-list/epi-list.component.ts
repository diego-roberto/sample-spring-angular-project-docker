import { Component, OnInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';

import * as _c from 'lodash/collection';
import * as _a from 'lodash/array';
import { AutoUnsubscribe } from 'app/shared/util/decorators/auto-unsubscribe.decorator';
import { CaEpiListResolver } from 'app/resolves/ca-epi-list.resolver';
import { isNullOrUndefined } from 'util';

import { EpiDeliveryReturnDialogComponent } from '../epi-delivery-return/epi-delivery-return-dialog/epi-delivery-return-dialog.component';
import { IndividualEquipmentDialogComponent } from 'app/views/workers/epi/individual-equipment-dialog/individual-equipment-dialog.component';

import { CaEpiService, FilteredCaEpi } from 'app/shared/services/ca-epi.service';

import { CaEpi } from 'app/shared/models/ca-epi.model';

@Component({
  selector: 'epi-list',
  templateUrl: 'epi-list.component.html',
  styleUrls: ['./epi-list.component.scss'],
})
@AutoUnsubscribe()
export class EPIListComponent implements OnInit {

  scrollEpis: FilteredCaEpi[] = [];
  caEpiList: FilteredCaEpi[] = [];
  filteredCaEpi: FilteredCaEpi[] = [];
  orderParams: {
    fn: [(ca) => any],
    fne: [(ca) => any],
    sortOrder: ['asc']
    sortOrderE: ['asc']
  };

  deliveryReturnDialogConfig = {
    data: {
      type: 0,
    }
  };

  fixed = false;
  spin = true;
  direction = 'up';
  animationMode = 'fling';
  searchValue = '';

  showSearch = false;

  registeredSub;
  forthComingSub;
  expiredSub;

  loadStep: number;

  selectedFilters = {
    text: '',
    epiExpired: false,
    epiForthComingMaturities: false,
    epiRegistered: true,
  };

  availableOrders = [
    { name: 'Ordem Alfabética', orderParams: { fn: [(epi) => epi.caEpi.epiId.description], fne: [(epi) => epi.expired, (epi) => epi.caEpi.epiId.description], sortOrder: ['asc'], sortOrderE: ['desc', 'asc'] } },
    { name: 'Últimos cadastrados', orderParams: { fn: [(epi) => epi.caEpi.createdAt], fne: [(epi) => epi.expired, (epi) => epi.caEpi.createdAt], sortOrder: ['desc'], sortOrderE: ['desc', 'desc'] } },
    { name: 'Data de Vencimento do CA', orderParams: { fn: [(epi) => epi.caEpi.ca.due_date], fne: [(epi) => epi.expired, (epi) => epi.caEpi.ca.due_date], sortOrder: ['asc'], sortOrderE: ['desc', 'asc'] } }
  ];

  constructor(
    public dialog: MdDialog,
    public caEpiService: CaEpiService,
    public snackBar: MdSnackBar,
    public caEpiListResolver: CaEpiListResolver,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.orderParams = <any>this.availableOrders[1].orderParams;
    this.registeredSub = this.caEpiListResolver.loadRegistered.subscribe((caEpis: Array<CaEpi>) => {
      this.caEpiList = this.filteredCaEpi = this.caEpiService.filter(caEpis);
    });

    this.loadCaEpis();
  }


  openEpiDialog() {
    const dialogRef = this.dialog.open(IndividualEquipmentDialogComponent, { width: '50%' });
    dialogRef.afterClosed().subscribe(epi => {
      if (!isNullOrUndefined(epi) && epi instanceof CaEpi) { this.updateLists(); }
    });
  }

  updateLists() {
    this.caEpiService.getCaEpiList().subscribe((caEpis) => {
      this.caEpiListResolver.setListCaEpiRegistered(caEpis);
    });

    this.caEpiService.getCaEpiExpiredList().subscribe((caEpisExpired) => {
      this.caEpiListResolver.setListCaEpiExpired(caEpisExpired);
    });

    this.caEpiService.getCaEpiForthComingMaturitiesList().subscribe((caEpisForthComingMaturities) => {
      this.caEpiListResolver.setListCaEpiForthComingMaturities(caEpisForthComingMaturities);
    });
  }

  openDeliveryReturnDialog(type) {
    this.deliveryReturnDialogConfig.data.type = type;
    const dialogRef = this.dialog.open(EpiDeliveryReturnDialogComponent, this.deliveryReturnDialogConfig);
  }

  toggleEpiSearch() {
    this.selectedFilters.text = '';
    this.showSearch = !this.showSearch;
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText(text: string) {
    this.selectedFilters.text = this.searchValue.trim();
    this.filterEpis();
  }

  toggleEpiActiveFilter(_filter: string) {
    this.selectedFilters[_filter] = !this.selectedFilters[_filter];
    this.filterEpis();
    // this.loadCaEpis();
  }

  private handleError(error) {
    if (error.json() && error.json().errors && error.json().errors.length > 0) {
      this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
    } else {
      this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
    }
  }

  filterEpis() {
    this.filteredCaEpi = [];
    if (this.selectedFilters.epiRegistered) {
      this.filteredCaEpi = this.caEpiList;
    }

    if (this.selectedFilters.epiForthComingMaturities) {
      this.filteredCaEpi = this.selectedFilters.epiRegistered ? this.filteredCaEpi = this.filterForthComingMaturities(this.filteredCaEpi) : this.filterForthComingMaturities(this.caEpiList);
    }

    if (this.selectedFilters.epiExpired) {
      if (this.selectedFilters.epiRegistered) {
        this.filteredCaEpi = this.selectedFilters.epiForthComingMaturities ? this.filteredCaEpi : this.filterForthComingMaturities(this.filteredCaEpi);
      } else {
        this.filteredCaEpi = this.selectedFilters.epiForthComingMaturities ? this.filteredCaEpi : this.filterExpired(this.caEpiList);
      }
    }

    this.filteredCaEpi = this.filter(this.filteredCaEpi);
  }

  filterForthComingMaturities(caEpiList: Array<FilteredCaEpi>): FilteredCaEpi[] {
    return _c.orderBy(caEpiList, this.availableOrders[2].orderParams.fn, this.availableOrders[2].orderParams.sortOrder);
  }

  filterExpired(caEpiList: Array<FilteredCaEpi>): FilteredCaEpi[] {
    return _c.filter(caEpiList, ['expired', true]);
  }

  filter(epis: Array<FilteredCaEpi>): FilteredCaEpi[] {
    let filtered = [];
    if (!this.selectedFilters.text || this.selectedFilters.text === '') {
      filtered = epis;
    } else {
      filtered = epis.filter(epi =>
        epi.caEpi.epiId.epiType.description.toLowerCase().includes(this.selectedFilters.text.toLowerCase()) ||
        epi.caEpi.epiId.description.toLowerCase().includes(this.selectedFilters.text.toLowerCase()) ||
        ('tamanho ' + epi.caEpi.size).toLowerCase().includes(this.selectedFilters.text.toLowerCase()) ||
        ('ca' + epi.caEpi.ca.ca).toLowerCase().includes(this.selectedFilters.text.toLowerCase()) ||
        this.datepipe.transform(epi.caEpi.ca.due_date, 'dd/MM/yyyy').includes(this.selectedFilters.text.toLowerCase()) ||
        (epi.caEpi.quantity + ' unidades').toLowerCase().includes(this.selectedFilters.text.toLowerCase())
      );
    }

    if (this.selectedFilters.epiForthComingMaturities || this.selectedFilters.epiExpired) {
      return _c.orderBy(filtered, this.orderParams.fne, this.orderParams.sortOrderE);
    }
    return _c.orderBy(filtered, this.orderParams.fn, this.orderParams.sortOrder);
  }

  loadCaEpis() {
    this.loadStep = 0;
    this.caEpiService.getCaEpiList().subscribe((caEpis) => {
      this.caEpiListResolver.setListCaEpiRegistered(caEpis);
    },
      null,
      () => {
        this.loadStep++;
      });
  }

  public removeEpi(id: number) {
    const removeFn = (epi: FilteredCaEpi) => epi.caEpi.id === id;
    _a.remove(this.caEpiList, removeFn);
    _a.remove(this.filteredCaEpi, removeFn);
    this.filteredCaEpi = new Array(...this.filteredCaEpi);
  }

  firstIndexExpired(caEpi: FilteredCaEpi, expired: boolean) {
    const index = _a.findIndex(this.filteredCaEpi, ['expired', expired]);

    if (caEpi === this.filteredCaEpi[index]) {
      return true;
    }
    return false;
  }

  firstIndex(caEpi: FilteredCaEpi) {
    const index = _a.findIndex(this.filteredCaEpi, ['expired', caEpi.expired]);

    if (caEpi === this.filteredCaEpi[index]) {
      return true;
    }
    return false;
  }

}
