import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LoginComponent } from 'app/views/auth/login/login.component';
import { PasswordRecoveryComponent } from 'app/views/auth/password-recovery/password-recovery.component';
import { PasswordUpdateComponent } from 'app/views/auth/password-update/password-update.component';
import { AuthRoutingModule } from 'app/views/auth/auth.routing.module';
import { BoxMessageComponent } from 'app/views/auth/_common/box-message/box-message.component';
import { EntrancePageComponent } from 'app/views/auth/_common/entrance-page/entrance-page.component';

@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule
    ],
    declarations: [
        LoginComponent,
        PasswordRecoveryComponent,
        PasswordUpdateComponent,
        BoxMessageComponent,
        EntrancePageComponent
    ]
})
export class AuthModule { }
