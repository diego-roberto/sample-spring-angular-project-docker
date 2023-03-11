import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PasswordService } from 'app/shared/services/password.service';
import { SessionsService } from 'app/shared/services/sessions.service';

@Component({
    selector: 'password-recovery',
    templateUrl: 'password-recovery.component.html',
    styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent {
    model: any = {};
    loading = false;
    message = '';
    send: boolean;

    constructor(
        private passwordService: PasswordService,
        private sessionsService: SessionsService,
        private router: Router
    ) { }

    recoverPassword() {
        this.loading = true;
        this.passwordService.startRecover(this.model.email)
            .subscribe(
                data => {
                    this.send = true;
                    this.message = 'Solicitação de recuperação de senha enviado para o e-mail ' + this.model.email
                        + ' com sucesso. Se você não receber esse e-mail na sua caixa de entrada dentro de 15 minutos, verifique na pasta lixo eletrônico (spam) do seu e-mail.'
                        + ' Se encontrar o e-mail no lixo eletrônico, por favor marque-o como "não spam".';
                }
            );
    }

    backToLogin() {
        this.sessionsService.logout();
        this.router.navigate(['/login']);
    }
}
