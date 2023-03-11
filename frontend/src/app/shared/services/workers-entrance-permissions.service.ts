import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WorkersEntrancePermissionsService {

    private endpoint = '/workers-entrance-permissions';

    constructor(private service: HttpClientService) { }

    updateByCompany(id: number) {
        return this.service.putWithNoHeaders(this.endpoint + '/byCompany/' + id, null).map((response) => {
            return response;
        });
    }
}
