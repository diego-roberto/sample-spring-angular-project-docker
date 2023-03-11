import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import * as _ from 'lodash/collection';

import { UserService } from 'app/shared/services/user.service';
import { TasksService } from 'app/shared/services/task.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { Task } from 'app/shared/models/task.model';
import { User } from 'app/shared/models/user.model';
import { Construction } from 'app/shared/models/construction.model';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';

@Component({
    selector: 'checklist-cell',
    templateUrl: 'checklist-cell.component.html',
    styleUrls: ['./checklist-cell.component.scss']
})
export class ChecklistCellComponent implements OnInit, OnChanges {
    private users: Array<User>;
    tasks = new Array<Task>();
    construction: Construction;

    @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;

    @Input() addTask: Observable<Task>;

    private addTaskSubscription: Subscription;
    public loading = true;

    constructor(
        public tasksService: TasksService,
        private sessionService: SessionsService,
        private userService: UserService,
        public constructionItemResolver: ConstructionItemResolver
    ) { }

    ngOnInit() {
        this.constructionItemResolver.load.subscribe((construction: Construction) => {
            this.construction = construction;
            if (this.construction.id) {
                Observable.forkJoin(
                    this.userService.getUsers(),
                    this.tasksService.getTaskListUserAndConstruction(this.sessionService.getCurrent().id, this.construction.id)
                ).subscribe(
                    ([users, tasks]) => {
                        this.users = users;
                        this.tasks = _.orderBy(tasks, ['deadline', 'title']);
                        this.loading = false;
                    }
                    );
            }
        });
    }

    ngOnChanges() {
        if (!this.addTaskSubscription) {
            this.addTaskSubscription = this.addTask.subscribe(task => {
                this.tasks.push(task);
                this.tasks = _.orderBy(this.tasks, ['deadline', 'title']);
            });
        }
    }

    check(task: Task) {
        this.setUsers(task);
        this.tasksService.saveTask(task).subscribe(
            updatedTask => {
                task = updatedTask;
            }
        );
    }

    private setUsers(task: Task) {
        this.users.forEach(user => {
            if (task.responsibleId === user.id) {
                task.responsible = user;
            }
            if (task.authorId === user.id) {
                task.author = user;
            }
        });
    }
}
