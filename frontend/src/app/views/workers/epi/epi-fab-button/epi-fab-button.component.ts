import { MdDialog } from '@angular/material';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { isNullOrUndefined } from 'util';
import { CaEpiListResolver } from 'app/resolves/ca-epi-list.resolver';

import { EpiDeliveryReturnDialogComponent } from 'app/views/workers/epi/epi-delivery-return/epi-delivery-return-dialog/epi-delivery-return-dialog.component';
import { IndividualEquipmentDialogComponent } from 'app/views/workers/epi/individual-equipment-dialog/individual-equipment-dialog.component';

import { CaEpiService } from 'app/shared/services/ca-epi.service';

@Component({
  selector: 'epi-fab-button',
  templateUrl: './epi-fab-button.component.html',
  styleUrls: ['./epi-fab-button.component.scss']
})
export class EpiFabButtonComponent implements OnInit {

  @Output() updateOnSave = new EventEmitter<void>();

  showFabButton = false;

  constructor(
    public dialog: MdDialog,
    public caEpiService: CaEpiService,
    public caEpiListResolver: CaEpiListResolver,
  ) { }

  ngOnInit() {

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

  openDeliveryReturnDialog(type: number) {
    const dialogRef = this.dialog.open(EpiDeliveryReturnDialogComponent, { data: { type: type } });
    dialogRef.afterClosed().subscribe(saved => {
      if (saved) { this.updateOnSave.emit(); }
    });
  }

  openEpiDialog() {
    const dialogRef = this.dialog.open(IndividualEquipmentDialogComponent, { width: '50%' });
    dialogRef.afterClosed().subscribe(equipment => {
      if (! isNullOrUndefined(equipment)) { this.updateOnSave.emit(); }
    });
  }

}
