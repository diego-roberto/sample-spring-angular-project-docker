import { Occurrence } from 'app/shared/models/occurrence.model';
import { OccurrencesDialogComponent } from './../activities/occurrences/occurrences-dialog/occurrences-dialog.component';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Task } from 'app/shared/models/task.model';
import { TaskCreatorService } from 'app/views/constructions/detail/_common/task-creator.service';
import { ConstructionsService } from 'app/shared/services/constructions.service';
import { OccurrenceService } from 'app/shared/services/occurrence.service';

@Injectable()
export class OccurrenceCreatorService {

  constructor(
    private dialog: MdDialog,
    private taskCreatorService: TaskCreatorService,
    private constructionsService: ConstructionsService,
    private occurrenceService: OccurrenceService
  ) { }

  requestDialog(occurrenceId?: number): Observable<Occurrence> {
    return new Observable<Occurrence>(observer => {
      let dialogRef: MdDialogRef<OccurrencesDialogComponent>;
      dialogRef = this.dialog.open(OccurrencesDialogComponent, { data: { occurrenceId: occurrenceId } });
      dialogRef.afterClosed().subscribe(occurrence => {
        if (dialogRef.componentInstance.isSaved && dialogRef.componentInstance.createTask) {
          this.doOpenDialogForCreateTask(occurrence);
        }
        observer.next(occurrence);
        observer.complete();
      });
    });
  }

  doOpenDialogForCreateTask(occurrence: Occurrence) {
    const task = new Task();
    task.occurrence = new Occurrence();
    task.occurrence.id = occurrence.id;

    this.taskCreatorService.requestDialogTask(this.constructionsService.construction.id, task).subscribe(task => {
        // this.onAddTask.next(task);
    });
  }

}
