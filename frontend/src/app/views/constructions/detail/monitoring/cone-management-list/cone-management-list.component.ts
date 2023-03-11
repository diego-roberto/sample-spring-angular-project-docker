import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SectorInstanceManagerComponent } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/sector-instance-manager.component';
import { MarkerRemoved, ConeUpdateRequest, MarkerAdded } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-types';
import { ConeFilterOption, ConeFilterOptions } from 'app/views/constructions/detail/monitoring/cone-management-list/cone-filters/cone-filter-option';
import { ConeFilterBattery } from 'app/views/constructions/detail/monitoring/cone-management-list/cone-filters/cone-filter-battery';

import { SummarizedCone, ConeService } from 'app/shared/services/cone.service';

import { Cone } from 'app/shared/models/cone.model';
import { ConeFilterTextSearch } from 'app/views/constructions/detail/monitoring/cone-management-list/cone-filters/cone-filter-text-search';

@Component({
  selector: 'cone-management-list',
  templateUrl: 'cone-management-list.component.html',
  styleUrls: ['./cone-management-list.component.scss']
})
export class ConeManagementListComponent extends SectorInstanceManagerComponent implements OnInit, OnDestroy {

  readonly orderAlphabetical = 1;
  readonly orderLastSaved = 2;

  searchValue = '';
  showingSearch = true;
  filtering = false;
  hasCone = false;
  filteredCones: SummarizedCone[] = [];
  summarizedCones: SummarizedCone[] = [];

  get order(): number {
    return this.orderChange.getValue();
  }
  set order(order: number) {
    this.orderChange.next(order);
  }

  @Input() get active(): boolean {
    return this.activeChange.getValue();
  }
  set active(activated: boolean) {
    this.activeChange.next(activated);
  }

  @Output() readonly startMonitoring = new EventEmitter<void>();
  @Output() readonly requestRemoveCone = new EventEmitter<MarkerRemoved>();
  @Output() readonly requestEditCone = new EventEmitter<ConeUpdateRequest>();

  @ViewChild('coneManagementContent') coneManagementContent: ElementRef;

  private readonly orderChange = new BehaviorSubject<number>(this.orderAlphabetical);
  private readonly activeChange = new BehaviorSubject<boolean>(false);
  private readonly ngUnsubscribe = new Subject();

  constructor(
    public filterOption: ConeFilterOption,
    public filterBattery: ConeFilterBattery,
    public filterTextSearch: ConeFilterTextSearch,
    private coneService: ConeService) {

    super();
  }

  ngOnInit(): void {
    if (this.sectors) {
      this.summarizedCones = this.coneService.summarize(this.sectors);

      Observable.merge(
        this.filterOption.valueChange,
        this.filterBattery.valueChange,
        this.filterTextSearch.valueChange,
        this.orderChange,
        this.activeChange
      )
        .debounce(() => {
          this.filtering = true;
          return Observable.timer(666);
        })
        .merge(
          this.events.markerAdded.filter(event => this.addToSummarized(this.summarizedCones, event)),
          this.events.markerRemoved.filter(event => this.removeFromSummarized(this.summarizedCones, event))
        )
        .filter(() => this.active)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
          this.hasCone = false;
          this.filteredCones = this.filterAndSort(this.summarizedCones, () => this.hasCone = true);
          this.filtering = false;
        });
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  filterByText() {
    this.filterTextSearch.text = this.searchValue.trim();
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  changeOption(selected: ConeFilterOptions) {
    this.filterOption.option = this.filterOption.option === selected ? null : selected;
  }

  sectorHasChanged(cone: SummarizedCone) {
    const index = this.filteredCones.indexOf(cone);
    if (index >= 0) {
      return index === 0 || this.filteredCones[index - 1].sector.id !== this.filteredCones[index].sector.id;
    }
    return false;
  }

  get parentScroll() {
    return this.coneManagementContent ? this.coneManagementContent.nativeElement : null;
  }

  private filterAndSort(summarized: SummarizedCone[], onConeFound: (cone: Cone) => void): SummarizedCone[] {
    let filtered = this.coneService.filterSummarized(summarized, (cone) => {
      onConeFound(cone);
      return this.match(cone);
    });

    if (this.order === this.orderAlphabetical) {
      filtered = this.coneService.sortSummarizedConesAlphabetically(filtered);
    } else {
      filtered = this.coneService.sortSummarizedConesByLastCreation(filtered);
    }

    return filtered;
  }

  private addToSummarized(summarized: SummarizedCone[], event: MarkerAdded): boolean {
    if (event.marker.icon.id === 3 && event.marker.cone) {
      const sectorFound = this.sectors.find(sector => sector.id === event.floorLocation.sectorId);
      const floorFound = sectorFound.floors.find(floor => floor.id === event.floorLocation.floorId);

      summarized.push({
        sector: sectorFound,
        floor: floorFound,
        cone: event.marker.cone
      });
      return true;
    }
    return false;
  }

  private removeFromSummarized(summarized: SummarizedCone[], event: MarkerRemoved): boolean {
    const removed = summarized.splice(summarized.findIndex(summary => summary.cone.marker.id === event.markerLocation.markerId), 1);
    return removed && removed.length === 1;
  }

  private match(cone: Cone): boolean {
    return this.filterBattery.match(cone) &&
      this.filterOption.match(cone) &&
      this.filterTextSearch.match(cone);
  }

  protected onSyncError(error: Error) { }
}
