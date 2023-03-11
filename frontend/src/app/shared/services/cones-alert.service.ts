import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { ConesAlert } from 'app/shared/models/cones-alert.model';
import { Worker } from 'app/shared/models/worker.model';
import { Headers, RequestOptions } from '@angular/http';


@Injectable()
export class ConesAlertService {
    private endpoint = '/cones_alert';
    private cone = '/cone';

    constructor(private service: HttpClientService) { }

    getConesAlertListCone(coneId: number) {
        return this.service.get(this.endpoint + '/' + this.cone + '/' + coneId).map(
            jsonResponse => {
                return jsonResponse.conesAlert.map((jsonConesAlert) => {
                    return new ConesAlert().initializeWithJSON(jsonConesAlert);
                }
                );
            });
    }
}
