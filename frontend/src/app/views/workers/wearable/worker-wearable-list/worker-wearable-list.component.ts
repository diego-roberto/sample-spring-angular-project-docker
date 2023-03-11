import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';

import { WorkerWearable } from 'app/shared/models/worker-wearable.model';
import { Worker } from 'app/shared/models/worker.model';
import { WorkerWearableListResolver } from 'app/resolves/worker-wearable-list.resolver';
import { WorkerWearableService } from 'app/shared/services/worker-wearable.service';
import { WearableDialogComponent } from '../wearable-dialog/wearable-dialog.component';

@Component({
  selector: 'worker-wearable-list',
  templateUrl: 'worker-wearable-list.component.html',
  styleUrls: ['./worker-wearable-list.component.scss'],
})
export class WorkerWearableListComponent implements OnInit {

  dialogConfig = {
    data: {
      workerWearable: new WorkerWearable(),
      worker: new Worker(),
      update: false
    }
  };

  @ViewChild('tabGroup') tabGroup;

  @ViewChild(VirtualScrollComponent)
  private virtualScroll: VirtualScrollComponent;

  @ViewChild('bodyContent') bodyContent: ElementRef;

  scrollWearable = [];

  workerWearables: Array<WorkerWearable> = new Array<WorkerWearable>();
  filteredWorkerWearables: Array<WorkerWearable> = new Array<WorkerWearable>();

  fixed = false;
  spin = true;
  direction = 'up';
  animationMode = 'fling';
  showFabButton = false;
  searchValue = '';

  selectedFilters = {
    text: '',
    workerWearableRegistered: true,
    update: false
  };

  showSearch = false;

  constructor(
    public dialog: MdDialog,
    public workerWearableService: WorkerWearableService,
    public snackBar: MdSnackBar,
    public workerWearableListResolver: WorkerWearableListResolver
  ) { }

  ngOnInit() {
    this.spin = true;
    this.workerWearableListResolver.loadWorkerWearable.subscribe((workerWearables: Array<WorkerWearable>) => {
      this.filteredWorkerWearables = this.workerWearables = workerWearables;
    });

    this.loadWorkerWearables();
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


  loadWorkerWearables() {
    this.workerWearableService.getWorkerWearableList().subscribe((workerWearables) => {
      this.filteredWorkerWearables = this.workerWearables = workerWearables;
      this.spin = false;

    });
  }

  openWorkerWearableDialog() {
    const dialogRef = this.dialog.open(WearableDialogComponent, this.dialogConfig);
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText(text: string) {
    this.selectedFilters.text = this.searchValue.trim();
    this.filteredWorkerWearables = this.filterWorkerWearables(this.workerWearables);
  }

  filterWorkerWearables(workerWearables: Array<WorkerWearable>) {
    const filtered = workerWearables.filter(
      wWearables => {
        return (!(this.selectedFilters.text.length > 0 && `${wWearables.idWearable}${wWearables.workerName}`.toLowerCase().indexOf(this.selectedFilters.text.toLowerCase()) === -1));
      }
    );

    return filtered;
  }


  toggleEpiSearch() {
    this.showSearch = !this.showSearch;
  }

  getParentScroll() {
    return this.bodyContent.nativeElement;
  }
}
