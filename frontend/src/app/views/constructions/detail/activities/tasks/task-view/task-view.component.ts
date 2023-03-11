import { Component, Inject, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { User } from 'app/shared/models/user.model';
import { Task } from 'app/shared/models/task.model';
import { UserService } from 'app/shared/services/user.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import * as Moment from 'moment';

@Component({
    selector: 'safety-task-view',
    templateUrl: './task-view.component.html',
    styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
    currentUser: User;
    users: Array<User>;
    task: Task;
    responsibleName: string;
    checkedAt: any;

    @Output() onAddTask = new EventEmitter();

    constructor(
        public dialog: MdDialog,
        public userService: UserService,
        private sessionsService: SessionsService,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(MD_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {        
        this.currentUser = this.sessionsService.getCurrent();

        this.task = this.data.task;
        this.userService.getUsers().subscribe(
            users => {
                this.users = users;
                this.setUsers();
            }
        );
        this.checkedAt = Moment(this.task.checkedAt).format("DD/MM/YYY HH:mm");

    }

    private setUsers() {
        this.users.forEach(user => {
            if (this.task.responsibleId === user.id) {
                this.task.responsible = user;
            }
            if (this.task.authorId === user.id) {
                this.task.author = user;
            }
        });
    }

    formatName(taskTemp: Task): string {
        let nameFormated = '';
        if (taskTemp && taskTemp.author && taskTemp.author != null) {
            if (taskTemp.author.name && taskTemp.author.name != null) {
                nameFormated = taskTemp.author.name;
            }
            if (taskTemp.author.role && taskTemp.author.role != null) {
                nameFormated = nameFormated + ' | ' + taskTemp.author.role;
            }
        }
        return nameFormated;
    }

    navigateToModal(queryParams: any) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: queryParams,
            skipLocationChange: false,
        });
    }

}
