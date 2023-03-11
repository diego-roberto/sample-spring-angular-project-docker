import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { NotificationSidenavService } from 'app/shared/services/notification-sidenav.service';

@Component({
    selector: 'notification-sidenav-container',
    templateUrl: 'notification-content-container.component.html',
    styleUrls: ['./notification-content-container.component.scss']
})
export class NotificationSidenavContainerComponent implements OnInit {
    @ViewChild('notificationSidenav') notificationSidenav: MdSidenav;

    notifications: Notification[];

    constructor(
        private notificationSidenavService: NotificationSidenavService
    ) { }

    ngOnInit() {
        this.notificationSidenavService.close();
        this.notificationSidenavService.isOpen().subscribe(isOpen => {
            const result = isOpen ? this.notificationSidenav.open() : this.notificationSidenav.close();
        });
    }

    closeSidenav() {
        this.notificationSidenavService.close();
    }

}

@Component({
    selector: 'content-toolbar',
    template: '<ng-content></ng-content>',
})
export class ContentToolbarComponent { }

@Component({
    selector: 'main-content',
    template: '<ng-content></ng-content>',
    styles: [':host { height: 100%; }']
})
export class MainContentComponent { }
