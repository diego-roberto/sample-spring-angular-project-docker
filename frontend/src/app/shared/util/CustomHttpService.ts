import { Injectable, Injector } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { SessionsService } from 'app/shared/services/sessions.service';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class CustomHttpService extends Http {

    sessionsService: SessionsService;

    constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router, injector: Injector, private snackBar: MdSnackBar) {
        super(backend, defaultOptions);
        setTimeout(() => {
            this.sessionsService = injector.get(SessionsService);
        });
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options).catch(this.catchErrors());
    }

    private catchErrors() {
        return (res: Response) => {
            if (res.status === 401) {
                this.sessionsService.logout();
                this.snackBar.open('Sessão expirada..!', null, { duration: 3000 });
                this.router.navigate(['login']);
            }
            return Observable.throw(res);
        };
    }
}
