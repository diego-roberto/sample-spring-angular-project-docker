import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from 'app/views/auth/login/login.component';
import { PasswordRecoveryComponent } from 'app/views/auth/password-recovery/password-recovery.component';
import { PasswordUpdateComponent } from 'app/views/auth/password-update/password-update.component';

const AUTH_ROUTER: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'send-recover',
        component: PasswordRecoveryComponent
    },
    {
        path: 'recover',
        component: PasswordUpdateComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(AUTH_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class AuthRoutingModule { }
