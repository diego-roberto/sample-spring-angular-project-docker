import { UtilValidators } from 'app/shared/util/validators.util';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsService } from 'app/shared/services/sessions.service';
import { LoginComponent } from './login.component';

const loginWrong = [{ email: '123@123.ca', password: 'sdkjfh' }, { email: 'a@com.com', password: '955422154' }];
const loginRight = [{ email: 'bhfreitas@stefanini.com', password: '123123' }, { email: 'jffalavinha@stefanini.com', password: '123123' }];

describe('Testing Login:', () => {
    beforeEach(() => {
        let component: LoginComponent;
        let session: SessionsService;
        component = null;
        session = null;

        loginWrong.forEach(login => {
            it('Login was wrong: ' + login.email, () => {
                component.model = login;
                expect(session.login(login.email, login.password)).toBeUndefined();
            });
        });

        loginRight.forEach(login => {
            it('Login was right: ' + login.email, () => {
                component.model = login;
                expect(session.login(login.email, login.password)).toBeUndefined();
            });
        });
    });
});
