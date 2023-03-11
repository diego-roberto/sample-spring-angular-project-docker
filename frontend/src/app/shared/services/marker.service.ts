import { HttpClientService } from './http-client.service';
import { Marker } from 'app/shared/models/marker.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Injectable } from '@angular/core';

@Injectable()
export class MarkerService {

    private endpoint = '/marker';
    private position = '/position/';

    constructor(private service: HttpClientService) { }

    getMarker(id: number) {
        return this.service.get(this.endpoint + '/' + id).map((response) => {
            return new Marker().initializeWithJSON(response.marker);
        });
    }

    createMarker(marker: Marker) {
        return this.service.post(this.endpoint, marker.toJSON()).map(
            (response) => {
                return new Marker().initializeWithJSON(response.marker);
            }
        );
    }

    updateMarker(marker: Marker) {
        return this.service.put(this.endpoint + '/' + marker.id, JSON.stringify(marker.toJSON())).map(
            (response) => {
                return new Marker().initializeWithJSON(response.marker);
            }
        );
    }

    updateMarkerPosition(id: number, position: [number, number]) {
        const json = JSON.stringify({ latitude: position[0], longitude: position[1] });

        return this.service.put(this.endpoint + this.position + id, json).map(
            (response) => {
                return new Marker().initializeWithJSON(response.marker);
            }
        );
    }

    removeMarker(id: number) {
        return this.service.delete(this.endpoint + '/' + id);
    }
}
