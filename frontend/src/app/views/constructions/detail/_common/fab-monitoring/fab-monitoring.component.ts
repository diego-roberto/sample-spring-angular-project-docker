import { Occurrence } from 'app/shared/models/occurrence.model';
import { OccurrenceCreatorService } from './../occurrence-creator.service';
import { OccurrencesDialogComponent } from './../../activities/occurrences/occurrences-dialog/occurrences-dialog.component';
import { OccurrenceService } from 'app/shared/services/occurrence.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { TaskCreatorService } from 'app/views/constructions/detail/_common/task-creator.service';
import { Task } from 'app/shared/models/task.model';
import { Construction } from 'app/shared/models/construction.model';
import { PermissionService } from '../../../../../shared/services/permission.service';

@Component({
    selector: 'safety-fab-monitoring',
    templateUrl: './fab-monitoring.component.html',
    styleUrls: ['./fab-monitoring.component.scss']
})
export class FabMonitoringComponent implements OnInit {
    private constructionId: number;

    @Output() onAddTask: EventEmitter<Task> = new EventEmitter<Task>();
    @Output() onAddOccurrence: EventEmitter<Occurrence> = new EventEmitter<Occurrence>();

    spin = true;
    direction = 'up';
    animationMode = 'fling';
    fixed = false;
    showFabButton = false;

    constructor(
        private dialog: MdDialog,
        private constructionItemResolver: ConstructionItemResolver,
        private taskCreatorService: TaskCreatorService,
        private occurrenceCreatorService: OccurrenceCreatorService,
        public permissionService:PermissionService
    ) { }

    ngOnInit() {
        this.constructionItemResolver.load.subscribe((construction: Construction) => {
            this.constructionId = construction.id;
        });
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
      
    openTaskDialog() {
        this.taskCreatorService.requestDialogTask(this.constructionId).subscribe(task => {
            this.onAddTask.next(task);
        });
    }

    openOccurrenceDialog() {
        this.occurrenceCreatorService.requestDialog().subscribe(occurrence => {
            this.onAddOccurrence.next(occurrence);
        });
    }
}
