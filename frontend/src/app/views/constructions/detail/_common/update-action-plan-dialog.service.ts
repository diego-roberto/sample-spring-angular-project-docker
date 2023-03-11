import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { UpdateActionPlanDialogComponent } from './../activities/action-plan/update-action-plan-dialog/update-action-plan-dialog.component';
import { ActionPlanItem } from 'app/shared/models/action-plan-item.model';

@Injectable()
export class UpdateActionPlanDialogService {

  constructor(
    private dialog: MdDialog
  ) { }

  requestDialog(actionPlanItemList: ActionPlanItem[], origin?: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      let dialogRef: MdDialogRef<UpdateActionPlanDialogComponent>;
      dialogRef = this.dialog.open(UpdateActionPlanDialogComponent, { data: { actionPlanItemList: actionPlanItemList, origin: origin } });
      dialogRef.afterClosed().subscribe(confirm => {
        observer.next(confirm);
        observer.complete();
      });
    });
  }

}
