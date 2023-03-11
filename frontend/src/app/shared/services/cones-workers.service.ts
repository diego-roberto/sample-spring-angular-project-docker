import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { ConesWorkers } from 'app/shared/models/cones-workers.model';

@Injectable()
export class ConesWorkersService {
    private endpoint = '/cones_workers';
    private cone = '/cone';

    constructor(private service: HttpClientService) { }

    getConesWorkersListCone(coneId: number) {
        return this.service.get(this.endpoint + '/' + this.cone + '/' + coneId).map(
            jsonResponse => {
                return jsonResponse.conesWorkers.map((jsonConesWorkers) => {
                    return new ConesWorkers().initializeWithJSON(jsonConesWorkers);
                }
                );
            });
    }
}
