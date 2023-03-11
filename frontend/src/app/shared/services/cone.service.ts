import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Risk } from 'app/shared/models/risk.model';
import { Cone } from 'app/shared/models/cone.model';
import { Floor } from 'app/shared/models/floor.model';
import { Sector } from 'app/shared/models/sector.model';
import { ConesWorkers } from 'app/shared/models/cones-workers.model';

import { HttpClientService } from './http-client.service';

import * as _ from 'lodash/collection';

@Injectable()
export class ConeService {

    private readonly endpoint = '/cones';
    private readonly endpointDependencies = '/dependencies';
    private readonly endpointActivate = '/activate';
    private readonly endpointInactivate = '/inactivate';

    constructor(private service: HttpClientService) { }

    getConeById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new Cone().initializeWithJSON(jsonResponse.cone);
        });
    }

    getConeByIdentification(identification: string) {
        return this.service.get(this.endpoint + '/identification/' + identification).map(jsonResponse => {
            return jsonResponse.cone == null ? null : new Cone().initializeWithJSON(jsonResponse.cone);
        });
    }

    createCone(cone: Cone) {
        return this.service.post(this.endpoint, JSON.stringify(cone.toJSON()))
            .map((jsonResponse) => {
                return new Cone().initializeWithJSON(jsonResponse.cone);
            });
    }

    updateCone(cone: Cone) {
        return this.service.put(this.endpoint + '/' + cone.id, JSON.stringify(cone.toJSON()))
            .map((jsonResponse) => {
                return new Cone().initializeWithJSON(jsonResponse.cone);
            }
        );
    }

    activate(id: number) {
        return this.service.put(this.endpoint + '/' + id + this.endpointActivate, null).map((jsonResponse) => {
            return jsonResponse.updated;
        });
    }

    inactivate(id: number) {
        return this.service.put(this.endpoint + '/' + id + this.endpointInactivate, null).map((jsonResponse) => {
            return jsonResponse.updated;
        });
    }

    updateConeDependencies(coneId: number, risks: Risk[], workers: ConesWorkers[]) {
        const request = {
            workers: workers.map(worker => worker.toJSON()),
            risks: risks.map(risk => risk.toJSON())
        };

        return this.service.put(this.endpoint + '/' + coneId + this.endpointDependencies, JSON.stringify(request))
            .map((jsonResponse) => {
                return new Cone().initializeWithJSON(jsonResponse.cone);
            }
        );
    }

    summarize(sectors: Sector[]): SummarizedCone[] {
        const summarized: SummarizedCone[] = [];
        sectors.forEach((sector) => {
            sector.floors.forEach(floor => {
                floor.markers.forEach(marker => {
                    if (marker.cone) {
                        summarized.push({ sector: sector, floor: floor, cone: marker.cone });
                    }
                });
            });
        });
        return summarized;
    }

    filterSummarized(summarized: SummarizedCone[], match: (cone: Cone) => boolean): SummarizedCone[] {
        return summarized.filter((summary) => match(summary.cone));
    }

    sortSummarizedConesAlphabetically(summarizedCones: SummarizedCone[]): SummarizedCone[] {
        return _.orderBy(summarizedCones, ['sector.id', 'cone.title'], ['asc', 'asc']);
    }

    sortSummarizedConesByLastCreation(summarizedCones: SummarizedCone[]): SummarizedCone[] {
        return _.orderBy(summarizedCones, ['sector.id', 'cone.createdAt'], ['asc', 'desc']);
    }
}

export interface SummarizedCone {
    sector: Sector;
    floor: Floor;
    cone: Cone;
}
