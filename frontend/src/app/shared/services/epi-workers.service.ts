import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { EpiWorkers } from 'app/shared/models/epi-workers.model';
import { Observable } from 'rxjs/Observable';
import { Worker } from 'app/shared/models/worker.model';

@Injectable()
export class EpiWorkersService {
    private endpoint = '/epi_workers';
    private workers = '/workers';
    private epi = '/epi';
    private loaned = '/loaned';
    private loanedby = '/loanedby';
    private endpointExpiring = '/expiring';

    constructor(private service: HttpClientService) { }

    getEpiWorkerList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.epiWorkers.map((jsonEpiWorkers) => {
                return new EpiWorkers().initializeWithJSON(jsonEpiWorkers);
            });
        });
    }

    getEpisFromAllWorkers(): Observable<Array<EpiWorkers>> {
        return this.service.get(this.endpoint + this.workers).map((jsonResponse) => {
            return jsonResponse.epiWorkers.map(epiWorker => {
                return new EpiWorkers().initializeWithJSON(epiWorker);
            });
        });
    }

    getEpiOfWorkerList(worker: number): Observable<Array<EpiWorkers>> {
        return this.service.get(this.endpoint + this.epi + '/' + worker)
            .map((jsonResponse) => {
                return jsonResponse.epiOfWorkers.map(epi => {
                    return new EpiWorkers().initializeWithJSON(epi);
                });
            });
    }

    getEpiWorkerById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new EpiWorkers().initializeWithJSON(jsonResponse.epiWorker);
        });
    }

    getLoanedAmountByEpiId(id: number) {
        return this.service.get(this.endpoint + '/' + this.loaned + '/' + id).map(jsonResponse => {
            return jsonResponse.loaned;
        });
    }

    getLoanedEpiAmountByUser(id: number, user: number) {
        return this.service.get(this.endpoint + '/' + this.loanedby + '/' + user + '/' + id).map(jsonResponse => {
            return jsonResponse.loaned;
        });
    }

    createEpisWorker(epiWorkers: EpiWorkers[]): Observable<any[]> {
        return this.service.post(this.endpoint, JSON.stringify(epiWorkers.map(x => x.toJSON()))).map((jsonResponse) => {
            return jsonResponse.epiWorkers.map((jsonEpiWorkers) => {
                return new EpiWorkers().initializeWithJSON(jsonEpiWorkers);
            });
        });
    }

    updateEpiWorker(epiWorkers: EpiWorkers[]): Observable<any[]> {
        return this.service.put(this.endpoint, JSON.stringify(epiWorkers.map(x => x.toJSON()))).map((jsonResponse) => {
            return jsonResponse.epiWorkers.map((jsonEpiWorkers) => {
                return new EpiWorkers().initializeWithJSON(jsonEpiWorkers);
            });
        });
    }

    getExpiringEpiWorkers(): Observable<Array<any>> {
        return this.service.get(this.endpoint + this.endpointExpiring).map((jsonResponse) => {
            const workers: Map<String, any> = new Map<String, any>();
            return jsonResponse.epiWorkers.map(epiWorker => {
                if (epiWorker.worker) {
                    if (typeof epiWorker.worker === 'object') {
                        workers.set(epiWorker.worker['@id'], epiWorker.worker);
                    } else {
                        epiWorker.worker = workers.get(epiWorker.worker);
                    }
                }
                return new EpiWorkers().initializeWithJSON(epiWorker);
            });
        });
    }
}
