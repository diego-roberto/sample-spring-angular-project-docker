import { OnInit, Component, ViewChild, ElementRef, Input } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import * as _c from 'lodash/collection';
import * as _a from 'lodash/array';
import { ConstructionsListResolver } from '../../../resolves/construction-list.resolver';
import { Construction } from '../../../shared/models/construction.model';
import { ConstructionCount } from '../../../shared/util/json/construction-count';
import { ConstructionsService } from '../../../shared/services/constructions.service';
import { ObservableMedia } from '@angular/flex-layout';
import { PermissionService } from '../../../shared/services/permission.service';
import { EquipmentReportModalComponent } from './equipment-report-modal/equipment-report-modal.component';
import { ConstructionReportDialogComponent } from './construction-report-dialog/construction-report-dialog.component';
import { deleteConfirmDialog } from './delete-confirm-dialog/delete-confirm-dialog.component';
@Component({
  selector: 'constructions-list',
  templateUrl: './constructions-list.component.html',
  styleUrls: ['./constructions-list.component.scss']
})
export class ConstructionsListComponent implements OnInit {

  ALPHABETICAL = { field: 'name asc', order: 'asc' };
  FIRST_SAVED = { field: 'createdAt asc', order: 'asc' };
  LAST_SAVED = { field: 'createdAt desc', order: 'desc' };

  open = false;
  fixed = false;
  spin = true;
  direction = 'up';
  animationMode = 'fling';

  searchValue = '';

  public status: string;

  @ViewChild(VirtualScrollComponent)
  private virtualScroll: VirtualScrollComponent;

  @ViewChild('bodyContent') bodyContent: ElementRef;

  scrollConstructions = [];

  public filteredConstructions: Array<Construction> = [];

  modulesByConstructionDTO: any;
  mapModulesByConstructionDTO: Map<number, any> = new Map();
  private constructionsCount: ConstructionCount[];

  orderParams: {
    fn: [(construction) => any],
    sortOrder: ['asc']
  };

  sortOrder = 'name ASC';
  showSearch = true;
  selectedOrder: string = this.ALPHABETICAL.field;

  availableOrders = [
      { name: 'Ordem Alfabética', sort: this.ALPHABETICAL},
      { name: 'Últimos cadastrados', sort: this.LAST_SAVED},
      { name: 'Primeiros cadastrados', sort: this.FIRST_SAVED}
  ];

  activeFilters = {
    text: '',
    onGoing: true,
    paralyzed: true,
    finished: true,
    fieldOrderBy: this.selectedOrder,
  };

  constructionsRequest: {
    number: number,
    numberOfElements?: number,
    totalPages?: number,
    last: boolean,
    first: boolean
    constructions: Construction[],
  } = { first: true, last: true, constructions: [], number: 0 }

  constructor(
      private dialog: MdDialog,
      private router: Router,
      private route: ActivatedRoute,
      private constructionsService: ConstructionsService,
      private constructionsListResolver: ConstructionsListResolver,
      private media: ObservableMedia,
      public permissionService: PermissionService
  ) {
      this.status = 'loading';
  }

  ngOnInit() {
      let filter = JSON.parse(sessionStorage.getItem('construction_filter'));
      if (filter != null) {
          this.storagedFilter(filter);
      };
      this.getConstructions(0);
  }

  getConstructions(page: number){

    this.orderParams = <any>this.availableOrders[0].sort;

    this.constructionsService.getAllModulesGroupByConstruction()
      .flatMap(values => {
        values.forEach(modulesByConstructionDTO => {
          this.mapModulesByConstructionDTO.set(modulesByConstructionDTO.constructionId, modulesByConstructionDTO.modulesId);
        });
        return this.constructionsService.getConstructionsPaginatedEssential(this.activeFilters, page);
      })
      .subscribe(
        values => {
          this.constructionsRequest = values;
          this.constructionsService.countDependencies().subscribe(counts => {
            this.constructionsCount = counts;
          });
          this.constructionsListResolver.setListConstruction(this.constructionsRequest.constructions);
          this.constructionsRequest.constructions.forEach(construction => {
            construction.modules = this.mapModulesByConstructionDTO.get(construction.id);
          });
          this.status = 'active';
        }
      );
  }

  get gtXs(): boolean {
    return this.media.isActive('gt-xs');
  }

  get ltSm(): boolean {
    return this.media.isActive('lt-sm');
  }

  previousPage() {
    this.getConstructions(this.constructionsRequest.number - 1);
  }

  nextPage() {
    this.getConstructions(this.constructionsRequest.number + 1);
  }

  editConstruction(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteConstruction(construction) {
    const dialogRef = this.dialog.open(deleteConfirmDialog, { width: '400px' });
    dialogRef.componentInstance.construction = construction;
    dialogRef.afterClosed().subscribe(() => {
      this.getConstructions(0)
    });
  }

  addConstruction() {
    this.router.navigate(['./new'], { relativeTo: this.route });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  toggleActiveFilter(_filter: string) {
      this.activeFilters[_filter] = !this.activeFilters[_filter];
      this.filterConstructions();
  }

  filterFinished(constructions: Array<Construction>): Array<Construction> {
    return _c.filter(constructions, ['status', 2]);
  }

  filterParalyzed(constructions: Array<Construction>): Array<Construction> {
    return _c.filter(constructions, ['status', 1]);
  }

  filterOnGoing(constructions: Array<Construction>): Array<Construction> {
    return _c.filter(constructions, ['status', 0]);
  }

  filterConstructions() {

    this.filteredConstructions = [];

    if (this.activeFilters.finished) {
      this.filteredConstructions = this.filterFinished(this.constructionsRequest.constructions);
    }
    if (this.activeFilters.onGoing) {
      this.filteredConstructions = this.activeFilters.finished ? _a.concat(this.filteredConstructions, this.filterOnGoing(this.constructionsRequest.constructions)) : this.filterOnGoing(this.constructionsRequest.constructions);
    }
    if (this.activeFilters.paralyzed) {
      this.filteredConstructions = this.activeFilters.finished || this.activeFilters.onGoing ? _a.concat(this.filteredConstructions, this.filterParalyzed(this.constructionsRequest.constructions)) : this.filterParalyzed(this.constructionsRequest.constructions);
    }

    this.filteredConstructions = this.filter(this.filteredConstructions);

    this.getConstructions(0);
  }

  filter(constructions: Array<Construction>): Array<Construction>  {

    this.activeFilters.fieldOrderBy = this.selectedOrder;

    let filter = {
      name: this.activeFilters.text,
      finished: this.activeFilters.finished,
      onGoing: this.activeFilters.onGoing,
      paralyzed: this.activeFilters.paralyzed,
      fieldOrderBy: this.selectedOrder
    }

    sessionStorage.setItem('construction_filter', JSON.stringify(filter))

    const filtered = constructions.filter(
      construction => {
        return !(this.activeFilters.text.length > 0 && construction.name.toLowerCase().indexOf(this.activeFilters.text.toLowerCase()) === -1);
      }
    );

    return _c.orderBy(filtered, this.orderParams.fn, this.orderParams.sortOrder);
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText() {
    this.activeFilters.text = this.searchValue.trim();
    this.filterConstructions();
  }

  toPrintEquipments(id: number) {
    let dialogRef: MdDialogRef<EquipmentReportModalComponent>;
    dialogRef = this.dialog.open(EquipmentReportModalComponent, { data: { constructionId: id } });
    dialogRef.afterClosed().subscribe(dialogReturn => {
    });
  }

  openPrintConstuctionDocumentationReportDialog() {
    const dialogRef = this.dialog.open(ConstructionReportDialogComponent);
  }

  storagedFilter(filtered) {
    if (filtered.name != undefined) {
          this.activeFilters.text = filtered.name;
      }
      if(filtered.finished != undefined){
          this.activeFilters.finished = filtered.finished;
      }
      if(filtered.onGoing != undefined){
          this.activeFilters.onGoing = filtered.onGoing;
      }
      if(filtered.paralyzed != undefined){
          this.activeFilters.paralyzed = filtered.paralyzed;
      }
      if (filtered.fieldOrderBy == 'createdAt asc') {
        this.selectedOrder = this.FIRST_SAVED.field;
        this.activeFilters.fieldOrderBy = this.FIRST_SAVED.field;
      } else if (filtered.fieldOrderBy == 'createdAt desc') {
        this.selectedOrder = this.LAST_SAVED.field;
        this.activeFilters.fieldOrderBy = this.LAST_SAVED.field;
      } else {
        this.selectedOrder = this.ALPHABETICAL.field;
        this.activeFilters.fieldOrderBy = this.ALPHABETICAL.field;
      }
  }

  clearstoragedFilter(){
    this.selectedOrder = this.ALPHABETICAL.field;
    this.activeFilters = {
        text: '',
        finished: true,
        onGoing: true,
        paralyzed: true,
        fieldOrderBy: this.ALPHABETICAL.field
    }
    this.filterConstructions();
    sessionStorage.removeItem('construction_filter');
  }

  getCountByConstruction(construction: Construction): ConstructionCount {
    return this.constructionsCount ? this.constructionsCount.find(count => count.constructionId === construction.id) : null;
  }

  getParentScroll() {
    return this.bodyContent.nativeElement;
  }

  search() {
    this.filterConstructions();
  }
}
