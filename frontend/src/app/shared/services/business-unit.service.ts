import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { HttpClientService, ClientType } from './http-client.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { BusinessUnit } from 'app/shared/models/business-unit.model';

@Injectable()
export class BusinessUnitService {
    private endpoint = '/business_unit';
    private type: ClientType = ClientType.auth;

    constructor(private service: HttpClientService, private sessionsService: SessionsService) { }

    getAllBusinessUnit():Observable<BusinessUnit> {
        return this.service.get(this.endpoint + '/' , this.type)
            .map(response => {
                return response.businessUnit;
            });
    }

    
}
