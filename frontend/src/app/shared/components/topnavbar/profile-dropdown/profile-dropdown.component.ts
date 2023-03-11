import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

import { User } from 'app/shared/models/user.model';
import { UserService } from 'app/shared/services/user.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { MdDialogRef, MdDialog } from '@angular/material';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { environment } from 'environments/environment';

@Component({
    selector: 'profile-dropdown',
    templateUrl: 'profile-dropdown.component.html',
    styleUrls: ['./profile-dropdown.component.scss'],
})
export class ProfileDropdownComponent implements OnInit {
    private userSub: any;
    public sessionSrtg: any;

    currentUser: User = new User();

    ngOnInit() {
        this.currentUser = this.sessionsService.getCurrent() || new User();
    }

    constructor(
        private userService: UserService,
        private sessionsService: SessionsService,
        private router: Router,
        private dialog: MdDialog
    ) { }

    logoutClicked() {
        this.sessionsService.logout();
        this.router.navigate(['/login']);
    }

    openProfileUser() {
        let dialogRef: MdDialogRef<ProfileUserComponent>;
        dialogRef = this.dialog.open(ProfileUserComponent, {});
        /*  dialogRef.componentInstance.onAddTask.subscribe(task => {
              observer.next(task);
              observer.complete();
          });*/
        dialogRef.afterClosed().subscribe(() => {
            // observer.next(null);
            // observer.complete();
        });
    }

    getAvatar() {
        if (this.sessionsService.userLogged.photoUrl) {
            return environment.authUrl + this.sessionsService.userLogged.photoUrl + '?t=' + this.sessionsService.userLogged.photoFilename;
        } else {
            return 'assets/avatar_m.png';
        }
    }
}
