import { Injectable } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { TasksDialogComponent } from 'app/views/constructions/detail/activities/tasks/tasks-dialog/tasks-dialog.component';
import { TaskViewComponent } from 'app/views/constructions/detail/activities/tasks/task-view/task-view.component';
import { Task } from 'app/shared/models/task.model';
import { AttachmentTaskFile } from 'app/shared/models/attachmentTaskFile.model';

@Injectable()
export class TaskCreatorService {
    private task: Task;

    constructor(
        private dialog: MdDialog,
        private route: ActivatedRoute
    ) { }

    requestDialogTask(constructionId: number, requestTask?: Task): Observable<Task> {
        if (requestTask) {
            this.task = Object.assign(new Task(), requestTask);
            this.task.attachmentFiles = Object.assign(new Array<AttachmentTaskFile>(), requestTask.attachmentFiles);
        }

        return new Observable<Task>(observer => {
            let dialogRef: MdDialogRef<TasksDialogComponent>;
            dialogRef = this.dialog.open(TasksDialogComponent, { data: { task: requestTask ? this.task : undefined, constructionId: constructionId } });
            dialogRef.componentInstance.onAddTask.subscribe(task => {
                observer.next(task);
                observer.complete();
            });
            dialogRef.afterClosed().subscribe(() => {
                observer.next(null);
                observer.complete();
            });
        });
    }

    requestViewTask(constructionId: number, requestTask: Task): Observable<Task> {
        return new Observable<Task>(observer => {
            let dialogRef: MdDialogRef<TaskViewComponent>;
            dialogRef = this.dialog.open(TaskViewComponent, { data: { task: requestTask, constructionId: constructionId } });
            dialogRef.componentInstance.onAddTask.subscribe(task => {
                observer.next(task);
                observer.complete();
            });
            dialogRef.afterClosed().subscribe(() => {
                observer.next(null);
                observer.complete();
            });
        });
    }
}
