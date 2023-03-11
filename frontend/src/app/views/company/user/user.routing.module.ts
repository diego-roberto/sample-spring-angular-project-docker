import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/shared/guards';
import { UserListComponent } from 'app/views/company/user/list/user-list/user-list.component';

const USERS_ROUTER: Routes = [

    {
        path: '',
        canActivateChild: [AuthGuard],
        component: UserListComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(USERS_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class UserRoutingModule { }
