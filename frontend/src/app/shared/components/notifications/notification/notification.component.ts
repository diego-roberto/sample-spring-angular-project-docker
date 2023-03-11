import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';

import { SessionsService } from 'app/shared/services/sessions.service';
import { NotificationTask } from 'app/shared/models/notification-task.model';
import { NotificationOccurrence } from "app/shared/models/notification-occurrence.model";
import { User } from 'app/shared/models/user.model';
import { Notification } from 'app/shared/models/notifications.model';
import { NotificationTypeConstant } from "app/shared/models/notification-types.model";

@Component({
    selector: 'notification-component',
    templateUrl: 'notification.component.html',
    styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements AfterViewInit {
    @Input() notification: Notification;
    @Input() set index(index: number) {

        // Tratar situação de objeto mudando de index
        if (this.listIndex > -1) {
            this.loaded.emit(index);
        }
        this.listIndex = index;
    }
    @Output() loaded = new EventEmitter();
    @Output() readNotification = new EventEmitter();
    @Output() requestClose = new EventEmitter();
    currentUser: User;
    listIndex: number;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sessionService: SessionsService
    ) {
        this.currentUser = sessionService.getCurrent();
    }

    ngAfterViewInit() {
        this.loaded.emit(this.listIndex);
    }

    read() {
        if (!this.notification.checked) {
            this.readNotification.emit(this.notification.id);
        }
    }

    redirectTask(notificationTask: NotificationTask) {
        this.requestClose.emit();
        let companyId = this.getCompanyId();
        this.router.navigateByUrl('constructions/'+notificationTask.constructionId+'/activities/tasks?view='+notificationTask.task.id);
    }

    redirectOccurrence(notificationOccurrence: NotificationOccurrence) {
        this.requestClose.emit();
        let companyId = this.getCompanyId();

        this.router.navigateByUrl('constructions/'+notificationOccurrence.occurrence.constructionId+'/activities/occurrences?view='+notificationOccurrence.occurrence.id);
       
    }

    getCompanyId(){
        let companyId = null;

        const currentCompany = this.sessionService.getCurrentCompany();
        if(currentCompany && currentCompany.companyId){
            companyId = currentCompany.companyId;
        }

        return companyId;
    }

    getExhibitionDate(notification: Notification) {
        const typesNotExhibitionDate = [
            NotificationTypeConstant.CIPA,
            NotificationTypeConstant.EPI,
            NotificationTypeConstant.HABILITACAO,
            NotificationTypeConstant.OCORRENCIAS
        ];

        if(typesNotExhibitionDate.indexOf(notification.notificationType.id) >= 0){
            return null;
        }

        if (notification.notificationTask) {
            return new Date(notification.notificationTask.task.deadline);
        } else if (notification.notificationAso) {
            return new Date(notification.notificationAso.aso.nextDate);
        } else if (notification.notificationEquipment) {
            const lastMaintence = Moment(notification.notificationEquipment.equipment.lastMaintenance);
            lastMaintence.add({ month: notification.notificationEquipment.equipment.periodicity });
            return lastMaintence.toDate();
        } else {
            return new Date(notification.createdAt);
        }
    }
}
