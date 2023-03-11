import { MdDialogRef, MD_DIALOG_DATA, PageEvent } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

import { ActionPlanItem } from 'app/shared/models/action-plan-item.model';

@Component({
  selector: 'remove-scheduled-training-dialog',
  templateUrl: './remove-scheduled-training-dialog.component.html',
  styleUrls: ['./remove-scheduled-training-dialog.component.scss']
})
export class RemoveScheduledTrainingDialogComponent implements OnInit {

  constructor(
    @Inject(MD_DIALOG_DATA) public dialogData: any,
    private dialogRef: MdDialogRef<RemoveScheduledTrainingDialogComponent>,
  ) { }

  ngOnInit() {
    
  }

  doCancel() {
    this.dialogRef.close(false);
  }

  doConfirm() {
    this.dialogRef.close(true);
  }

}
