import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Sector } from 'app/shared/models/sector.model';
import { HttpClientService } from 'app/shared/services/http-client.service';
import { SectorCount } from 'app/shared/util/json/sector-count';
import { FloorService } from 'app/shared/services/floor.service';
import { Floor } from 'app/shared/models/floor.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SectorsService {

    private readonly endpoint = '/sectors';
    private readonly endpointConstruction = '/construction/';
    private readonly endpointCount = '/dependencies/count';

    constructor(
        private service: HttpClientService,
        private floorService: FloorService
    ) { };

    getSectorsByConstruction(constructionId: number): Observable<Sector[]> {
        return this.service.get(this.endpoint + this.endpointConstruction + constructionId).map((jsonResponse) => {
            return jsonResponse.sectors.map(sector => {
                return new Sector().initializeWithJSON(sector);
            });
        });
    }

    countDependencies(constructionId: number): Observable<SectorCount[]> {
        return this.service.get(this.endpoint + '/' + constructionId + this.endpointCount).map((jsonResponse) => {
            return jsonResponse.counts.map((jsonCount) => {
                return new SectorCount().initializeWithJSON(jsonCount);
            });
        });
    }

    createUpdateSectors(sectors: Sector[]): Observable<SavedFloor> {
        return new Observable(observer => {

            const sectorRequests: Observable<SectorResponse>[] = sectors.map(sector => {
                return this.saveSectorWithoutFloor(sector)
                    .map(saved => { return { sector: saved, error: null }; })
                    .catch((error) => Observable.of({ sector: sector, error: error }));
            });

            Observable.forkJoin(sectorRequests).subscribe(
                (sectorResponses: SectorResponse[]) => {

                    let floorRequests: Observable<FloorResponse>[] = [];

                    sectorResponses.forEach((response, index) => {
                        const saved = new SavedFloor();
                        saved.error = response.error;
                        saved.sector = response.sector;
                        saved.sectorPosition = index;

                        if (sectors[index].floors && sectors[index].floors.length > 0) {
                            if (!saved.error) {
                                floorRequests = floorRequests.concat(
                                    sectors[index].floors.map(floor => {
                                        floor.sectorId = saved.sector.id;
                                        return this.floorService.saveFloor(floor)
                                            .map(savedFloor => { return { floor: savedFloor, error: null, savedSector: saved }; })
                                            .catch((error) => Observable.of({ floor: floor, error: error, savedSector: saved }));
                                    })
                                );
                            } else {
                                floorRequests = floorRequests.concat(sectors[index].floors.map(floor => Observable.of(
                                    { floor: floor, error: response.error, savedSector: saved }
                                )));
                            }
                        }
                    });

                    Observable.forkJoin(floorRequests).subscribe(
                        (floorResponses: FloorResponse[]) => {
                            floorResponses.forEach(response => {
                                if (!response.savedSector.sector.floors) {
                                    response.savedSector.sector.floors = [];
                                }
                                const savedFloor = response.savedSector;
                                const i = savedFloor.sector.floors.push(response.floor) - 1;
                                savedFloor.floorPosition = i;
                                savedFloor.floor = response.floor;
                                savedFloor.error = response.error;
                                observer.next(savedFloor);
                            });
                        },

                        error => { },

                        () => {
                            observer.complete();
                        }
                    );
                }
            );
        });
    }

    private saveSector(sector: Sector): Observable<Sector> {
        if (sector.id) {
            return this.updateSector(sector);
        } else {
            return this.createSector(sector);
        }
    }

    private updateSector(sector: Sector): Observable<Sector> {
        return this.service.put(this.endpoint + '/' + sector.id, JSON.stringify(sector.toJSON())).map((jsonResponse) => {
            return new Sector().initializeWithJSON(jsonResponse.sector);
        });
    }

    private createSector(sector: Sector): Observable<Sector> {
        return this.service.post(this.endpoint, JSON.stringify(sector.toJSON())).map((jsonResponse) => {
            return new Sector().initializeWithJSON(jsonResponse.sector);
        });
    }

    private saveSectorWithoutFloor(sector: Sector): Observable<Sector> {
        if (sector.id) {
            return this.updateSectorWithoutFloor(sector);
        } else {
            return this.createSectorWithoutFloor(sector);
        }
    }

    private updateSectorWithoutFloor(sector: Sector): Observable<Sector> {
        const json = sector.toJSON();
        json.floors = null;

        return this.service.put(this.endpoint + '/' + sector.id, JSON.stringify(json)).map((jsonResponse) => {
            return new Sector().initializeWithJSON(jsonResponse.sector);
        });
    }

    private createSectorWithoutFloor(sector: Sector): Observable<Sector> {
        const json = sector.toJSON();
        json.floors = null;

        return this.service.post(this.endpoint, JSON.stringify(json)).map((jsonResponse) => {
            return new Sector().initializeWithJSON(jsonResponse.sector);
        });
    }
}

export class SavedFloor {
    error: Error;
    sectorPosition: number;
    sector: Sector;
    floor: Floor;
    floorPosition: number;
}

interface SectorResponse {
    error: Error;
    sector: Sector;
}

interface FloorResponse {
    savedSector: SavedFloor;
    error: Error;
    floor: Floor;
}
