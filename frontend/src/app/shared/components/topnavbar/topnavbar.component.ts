import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { Component, Input, OnInit } from '@angular/core';

import { Notification } from 'app/shared/models/notifications.model';
import { NotificationsService } from 'app/shared/services/notifications.service';
import { NotificationSidenavService } from 'app/shared/services/notification-sidenav.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { UserService } from 'app/shared/services/user.service';
import { User } from 'app/shared/models/user.model';
import { HelpDialogComponent } from 'app/shared/components/help/help.component';
import { ChangeCompanyComponent } from 'app/shared/components/change-company/change-company.component';
import { environment } from 'environments/environment';

@Component({
    selector: 'topnavbar-component',
    templateUrl: 'topnavbar.component.html',
    styleUrls: ['./topnavbar.component.scss']
})
export class TopnavbarComponent implements OnInit {
    showNotification = false;
    private userSub: any;
    public sessionSrtg: any;
    isNotReadNotifications = false;
    numberOfNotReadNotifications = 0;

    currentUser: User = new User();

    @Input()
    set notification(v: boolean) {
        this.showNotification = this.coerceBooleanProperty(v);
    }

    ngOnInit() {
        this.currentUser = this.sessionsService.userLogged;
        this.getNotifications();
    }

    constructor(private notificationSidenavService: NotificationSidenavService,
        public sessionsService: SessionsService, private notificationService: NotificationsService,
        private router: Router, public dialog: MdDialog, private userService: UserService) { }

    getNotifications(): void {
        if (!this.notificationSidenavService.userNotifications) {
            this.notificationService.getNotificationsListByUser(this.currentUser).subscribe(notifications => {
                this.notificationSidenavService.setNotifications(notifications);
            });
        }

        this.notificationSidenavService.construtionsUnreadAmount.subscribe(amount => {
            this.numberOfNotReadNotifications = amount;
        });
    }

    toggle() {
        this.notificationSidenavService.toggle();
    }

    coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }

    logoutClicked() {
        this.sessionsService.logout();
        this.router.navigate(['/login']);
    }

    openDialog() {
        this.dialog.open(HelpDialogComponent);
    }

    openChangeCompany() {
        this.dialog.open(ChangeCompanyComponent);
    }

    getAvatar() {
        if (this.sessionsService.userLogged.photoUrl) {
            return environment.authUrl + this.sessionsService.userLogged.photoUrl + '?t=' + this.sessionsService.userLogged.photoFilename;
        } else {
            return 'assets/avatar_m.png';
        }
    }
}
