import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Floor } from 'app/shared/models/floor.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FloorService {

    private endpoint = '/floors';

    public floors: Array<Floor> = [];
    public floor: Floor;

    constructor(private service: HttpClientService) { }

    saveFloor(floor: Floor): Observable<Floor> {
        const formData = new FormData();

        formData.append('floor', JSON.stringify(floor.toJSON()));
        formData.append('attachment', floor.imageFile);

        return this.service.postWithNoHeaders(this.endpoint, formData).map(jsonResponse => {
            return new Floor().initWithJSONFloor(jsonResponse.floor);
        });
    }

    getFloor(id: number): Observable<Floor> {
        return this.service.get(this.endpoint + '/' + id).map((jsonResponse) => {
            this.floor = new Floor().initWithJSONFloor(jsonResponse.floor);
            return Object.assign({}, this.floor);
        });
    }

    private updateFloor(floor: Floor): Observable<Floor> {
        return this.service.put(this.endpoint + '/' + floor.id, JSON.stringify(floor.toJSON())).map((jsonResponse) => {
            return new Floor().initWithJSONFloor(jsonResponse.floor);
        });
    }


    removeMarkerIdFloor(idMarker: Number) {
        this.service.delete(this.endpoint + '/' + idMarker).subscribe(
            response => { }
        );
    }

}
