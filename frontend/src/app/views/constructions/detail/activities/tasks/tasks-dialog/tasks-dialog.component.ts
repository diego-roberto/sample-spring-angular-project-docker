import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from 'app/shared/models/task.model';

@Component({
    selector: 'tasks-dialog',
    templateUrl: 'tasks-dialog.component.html',
    styleUrls: ['./tasks-dialog.component.scss']
})

export class TasksDialogComponent implements OnInit {

    @Output() onAddTask = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    onAddTaskEvent(task: Task) {
        this.onAddTask.emit(task);
        this.onAddTask.complete();
    }

}
