import { Component, OnInit } from '@angular/core';
import { MdDialog, MdSelectChange } from '@angular/material';

import { isNullOrUndefined } from 'util';

import { IndividualEquipmentDialogComponent } from 'app/views/workers/epi/individual-equipment-dialog/individual-equipment-dialog.component';

import { LoadingStackService } from 'app/shared/services/loading-stack.service';
import { IndividualEquipmentService } from 'app/shared/services/individual-equipment.service';

import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';

@Component({
  selector: 'individual-equipment-list',
  templateUrl: './individual-equipment-list.component.html',
  styleUrls: ['./individual-equipment-list.component.scss']
})
export class IndividualEquipmentListComponent implements OnInit {

  individualEquipmentList: IndividualEquipment[] = [];
  individualEquipmentListRequest = {
    filterBy: undefined,
    orderBy: 0
  };
  noIndividualEquipmentRegistered = false;
  searchValue = '';

  constructor(
    private individualEquipmentService: IndividualEquipmentService,
    public loadingStackService: LoadingStackService,
    public dialog: MdDialog
  ) { }

  ngOnInit() {
    this.getIndividualEquipmentList();
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterIndividualEquipmentList() {
    this.individualEquipmentListRequest.filterBy = this.searchValue.trim();
    if (!this.noIndividualEquipmentRegistered) { this.getIndividualEquipmentList(); }
  }

  getIndividualEquipmentList() {
    this.loadingStackService.addToLoadingStack('getIndividualEquipmentList');
    this.individualEquipmentService.getByFilter(this.individualEquipmentListRequest).subscribe(individualEquipmentList => {
      this.individualEquipmentList = individualEquipmentList;
      if (!this.isFilterApplied() && this.individualEquipmentList.length === 0) { this.noIndividualEquipmentRegistered = true; }
      this.loadingStackService.removeFromLoadingStack('getIndividualEquipmentList');
    });
  }

  openIndividualEquipmentDialog() {
    const dialogRef = this.dialog.open(IndividualEquipmentDialogComponent, { data: { equipment: new IndividualEquipment() }, width: '50%' });
    dialogRef.afterClosed().subscribe(individualEquipment => {
      if (!isNullOrUndefined(individualEquipment) && individualEquipment instanceof IndividualEquipment) {
        this.noIndividualEquipmentRegistered = false;
        this.getIndividualEquipmentList();
      }
    });
  }

  individualEquipmentChangeHandler(individualEquipment: IndividualEquipment) {
    const indexToUpdate = this.individualEquipmentList.findIndex(i => i.id === individualEquipment.id);
    this.individualEquipmentList[indexToUpdate] = individualEquipment;
  }

  individualEquipmentDeleteHandler(individualEquipmentId: number) {
    const indexToRemove = this.individualEquipmentList.findIndex(i => i.id === individualEquipmentId);
    this.individualEquipmentList.splice(indexToRemove, 1);
  }

  orderByChangeHandler(event: MdSelectChange) {
    this.individualEquipmentListRequest.orderBy = event.value;
    if (this.individualEquipmentList.length > 1) { this.getIndividualEquipmentList(); }
  }

  isFilterApplied(): boolean {
    return !(isNullOrUndefined(this.individualEquipmentListRequest.filterBy) || this.individualEquipmentListRequest.filterBy === '');
  }

}
