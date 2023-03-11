import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { EpiTypes } from 'app/shared/models/epi-types.model';

@Injectable()
export class EpiTypesService {
    private endpoint = '/epi_types';

    constructor(private service: HttpClientService) { }

    getEpiTypeList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.epiTypes.map((jsonEpiTypes) => {
                return new EpiTypes().initializeWithJSON(jsonEpiTypes);
            });
        });
    }

    getEpiTypeById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new EpiTypes().initializeWithJSON(jsonResponse.epiType);
        });
    }
}
