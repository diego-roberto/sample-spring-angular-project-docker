import { Injectable } from '@angular/core';

import { Cnae } from 'app/shared/models/cnae.model';
import { HttpClientService, ClientType } from './http-client.service';

@Injectable()
export class CnaeService {

    private endpoint = '/cnaes';
    private type = ClientType.auth;
    public cnae: Cnae;

    constructor(private service: HttpClientService) { }

    getCnae(code: string) {
        return this.service.get(`${this.endpoint}/${code}`, this.type)
            .map((response) => {
                return response.cnae;
            });
    }

}
