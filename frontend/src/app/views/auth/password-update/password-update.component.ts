import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { AppMessageService } from "app/shared/util/app-message.service";

import { PasswordService } from 'app/shared/services/password.service';

@Component({
    selector: 'password-update',
    templateUrl: 'password-update.component.html',
    styleUrls: ['./password-update.component.scss']
})
export class PasswordUpdateComponent implements OnInit, OnDestroy {
    model: any = {};
    loading = false;
    error = '';

    form: FormGroup;
    sub: any;
    token: string;

    constructor(
        private passwordService: PasswordService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private appMessage: AppMessageService
    ) {
        this.form = fb.group({
            password: ['', Validators.required],
            passwordConfirmation: ['', Validators.required],
        }, { validator: matchingPasswords('password', 'passwordConfirmation') });
    }

    ngOnInit() {
        this.sub = this.route.queryParams.subscribe(params => {
            this.token = params['token'];
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    updatePassword() {        
        this.loading = true;
        this.passwordService.newPassword(this.form.get('password').value, this.token)
            .subscribe(
            data => {
                this.loading = false;
                this.appMessage.showSuccess('Senha atualizada com sucesso!');
                this.router.navigate(['/login']);
            },
            error => {
                this.loading = false;
                this.appMessage.errorHandle(error, 'Erro ao atualizar a senha!');
            }
            );
    }

    showErrorBar(error: string) {
        this.error = error;
    }

}

function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
        const password = group.controls[passwordKey];
        const passwordConfirmation = group.controls[passwordConfirmationKey];

        if (password.value !== passwordConfirmation.value) {
            passwordConfirmation.setErrors({ mismatchedPasswords: true });
            return {
                mismatchedPasswords: true
            };
        }

        if (passwordConfirmation.hasError('mismatchedPasswords')) {
            passwordConfirmation.setErrors(null);
            passwordConfirmation.updateValueAndValidity();
        }
        return null;
    };
}
