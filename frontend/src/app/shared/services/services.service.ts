import { Service } from './../models/service.model';
import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ServicesService {
    private endpoint = '/services';

    constructor(private service: HttpClientService) { }

    getServices(): Observable<Array<Service>> {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.services.map((jsonjsonServices) => {
                return new Service().initializeWithJSON(jsonjsonServices);
            });
        });
    }
}
