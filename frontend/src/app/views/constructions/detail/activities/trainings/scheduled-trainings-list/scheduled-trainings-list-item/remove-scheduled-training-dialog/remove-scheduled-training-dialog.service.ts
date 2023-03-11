import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { RemoveScheduledTrainingDialogComponent } from './remove-scheduled-training-dialog.component';

@Injectable()
export class RemoveScheduledTrainingsDialogService {

  constructor( private dialog: MdDialog ) { }

  requestDialog(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      let dialogRef: MdDialogRef<RemoveScheduledTrainingDialogComponent>;
      dialogRef = this.dialog.open(RemoveScheduledTrainingDialogComponent, { data: { } });
      dialogRef.afterClosed().subscribe(confirm => {
        observer.next(confirm);
        observer.complete();
      });
    });
  }

}
