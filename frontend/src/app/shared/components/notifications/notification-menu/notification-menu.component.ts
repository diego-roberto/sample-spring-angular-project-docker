import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash/array';
import * as Moment from 'moment';

import { AutoUnsubscribe } from 'app/shared/util/decorators/auto-unsubscribe.decorator';
import { NotificationType } from 'app/shared/models/notification-types.model';
import { NotificationSidenavService } from 'app/shared/services/notification-sidenav.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { NotificationTypesService } from 'app/shared/services/notification-type.service';
import { NotificationsService } from 'app/shared/services/notifications.service';
import { Notification } from 'app/shared/models/notifications.model';

@Component({
    selector: 'notification-menu',
    templateUrl: 'notification-menu.component.html',
    styleUrls: ['./notification-menu.component.scss'],
    animations: [
        trigger('slideFilterDate', [
            state('true', style({ transform: 'translateX(0%)' })),
            state('false', style({ transform: 'translateX(100%)' })),
            transition('* => *', animate(300))
        ]),
        trigger('fadeOutFilterDate', [
            state('true', style({ opacity: 0 })),
            state('false', style({ opacity: 1 })),
            transition('* => *', animate(300))
        ]),
        trigger('fadeInFilterDate', [
            state('true', style({ opacity: 1 })),
            state('false', style({ opacity: 0 })),
            transition('* => *', animate(300))
        ])
    ]
})
@AutoUnsubscribe()
export class NotificationMenuComponent implements OnInit {
    @Output() requestClose = new EventEmitter();

    scrollNotifications: Notification[] = [];
    notifications: Notification[] = [];
    filteredNotifications: Notification[];
    allfilteredNotifications: Notification[];
    notificationTypes: NotificationType[];
    numberOfNotReadNotifications = 0;
    typeFilter = 0;
    shownStep = 20;
    totalShown: number;
    loading = false;
    notificationSub;
    amountSub;
    initialDate;
    finalDate;
    finalMin;
    initializing = true;
    now;
    aMonthAgo;
    activeFilterDate = false;

    notificationsTypeVisible = [ 2, 3, 4, 7, 9, 10, 13, 14, 15, 16 ];

    constructor(
        private notificationSidenavService: NotificationSidenavService,
        private sessionsService: SessionsService,
        private notificationService: NotificationsService,
        private notificationTypesService: NotificationTypesService,
        private cdRef: ChangeDetectorRef
    ) {
        this.totalShown = this.shownStep;
        notificationTypesService.getNotificationTypes().subscribe(types => {
            this.notificationTypes = types.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            this.notificationTypes = this.notificationTypes.filter(notificationType => this.notificationsTypeVisible.includes(notificationType.id));
        });
        this.setDefaultFilterDates();
    }

    ngOnInit(): void {
        this.notificationSub = this.notificationSidenavService.constructionsNotifications.subscribe(notifications => {
            this.mergeNotificationsList(notifications);
            this.filterNotifications(this.typeFilter, false);
        });
        this.amountSub = this.notificationSidenavService.construtionsUnreadAmount.subscribe(amount => {
            this.numberOfNotReadNotifications = amount;
        });
    }

    read(id: number) {
        let readSub: Subscription;
        readSub = this.notificationService.readNotification(id).subscribe(response => {
            this.notificationSidenavService.readNotification(id);
            readSub.unsubscribe();
        });
    }

    setDefaultFilterDates() {
        this.finalDate = undefined;
        this.initialDate = undefined;
    }

    filterNotifications(typeId: number, filterChange) {
        if (filterChange) {
            this.totalShown = this.shownStep;
        }
        if (typeId !== 0) {
            this.allfilteredNotifications = this.notifications.filter(x => x.notificationType.id === typeId && this.filterDate(x.createdAt));
            this.filteredNotifications = this.allfilteredNotifications.filter((x, index) => index < this.totalShown);
        } else {
            this.allfilteredNotifications = this.notifications.filter(x => this.filterDate(x.createdAt));
            this.filteredNotifications = this.allfilteredNotifications.filter((value, index) => index < this.totalShown);
        }
        this.typeFilter = typeId;
    }

    private mergeNotificationsList(newList: Array<Notification>) {
        for (const notification of newList) {
            // Lista antiga tem: atualiza valores
            if (this.notifications.some(x => x.id === notification.id)) {
                this.notifications.find(x => x.id === notification.id).copyValues(notification);
            } else {
                // Lista antiga não tem: adiciona
                this.notifications.splice(_.sortedLastIndexBy(this.notifications, notification, (o) => -o.createdAt), 0, notification);
            }
        }
        // Lista nova não tem e Lista antiga tem: remove da antiga
        _.pullAll(this.notifications, this.notifications.filter(x => !newList.some(y => x.id === y.id)));
    }

    loadNotifications() {
        if (!this.loading && this.allfilteredNotifications.length > this.totalShown) {
            this.loading = true;
            this.totalShown = this.totalShown + this.shownStep;
            this.filteredNotifications = this.allfilteredNotifications.filter((value, index) => index < this.totalShown);
        }
    }

    checkLoading(currentIndex) {
        this.loading = !(this.filteredNotifications.length - 1 === currentIndex);

        if (this.initializing && !this.loading) {
            setTimeout(() => {
                this.finalMin = Moment(this.initialDate).add(1, 'd').toDate();
            });
            this.initializing = false;
        }
    }

    setInitialDate(date) {
        if (date) {
            this.initialDate = date;
            this.finalMin = Moment(date).add(1, 'd').toDate();
            if (this.finalDate && this.finalDate <= this.initialDate) {
                this.finalDate = null;
            }
        } else {
            this.initialDate = this.finalDate = null;
        }
        this.filterNotifications(this.typeFilter, true);
    }

    onFinalDateChange(date) {
        if (date) {
            this.finalDate = date;
            if (this.finalDate <= this.initialDate) {
                this.finalDate = this.finalMin;
            }
        } else {
            this.finalDate = null;
        }
        this.filterNotifications(this.typeFilter, true);
    }

    filterDate(createdAt): boolean {
        if (this.initialDate) {
            if (this.finalDate) {
                return Moment(createdAt).isBetween(this.initialDate, this.finalDate, 'D', '[]');
            } else {
                return Moment(createdAt).isBetween(this.initialDate, new Date(), 'D', '[]');
            }
        } else {
            return true;
        }
    }

    toggleActiveFilterDate() {
        this.activeFilterDate = !this.activeFilterDate;
        if (!this.activeFilterDate) {
            this.setDefaultFilterDates();
            this.filterNotifications(this.typeFilter, true);
        }
    }
}
