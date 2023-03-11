import { ActionViewComponent } from './../action/action-view/action-view.component';
import { ActionPlanItem } from './../../../../../../shared/models/action-plan-item.model';
import { Injectable } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { TasksDialogComponent } from 'app/views/constructions/detail/activities/tasks/tasks-dialog/tasks-dialog.component';
import { TaskViewComponent } from 'app/views/constructions/detail/activities/tasks/task-view/task-view.component';
import { Task } from 'app/shared/models/task.model';
import { AttachmentTaskFile } from 'app/shared/models/attachmentTaskFile.model';
import { User } from '../../../../../../shared/models/user.model';

@Injectable()
export class ActionPlanDialogService {
    private actionPlanItem: ActionPlanItem;

    constructor(
        private dialog: MdDialog,
        private route: ActivatedRoute
    ) { }

    openActionPlanItemForm(actionPlanItem?: ActionPlanItem): Observable<ActionPlanItem> {
        if (actionPlanItem) {
            this.actionPlanItem = Object.assign(new ActionPlanItem(), actionPlanItem);
        }

        return new Observable<ActionPlanItem>(observer => {
            let dialogRef: MdDialogRef<ActionViewComponent>;
            dialogRef = this.dialog.open(ActionViewComponent,  { data: { actionPlanItem: actionPlanItem } });
            dialogRef.componentInstance.savedItem.subscribe(actionItem => {
                observer.next(actionItem);
                observer.complete();
            });
        });
    }

}
