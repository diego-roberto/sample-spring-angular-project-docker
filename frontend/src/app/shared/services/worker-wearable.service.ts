import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { WorkerWearable } from 'app/shared/models/worker-wearable.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WorkerWearableService {
    public workerWearable: WorkerWearable;

    private endpoint = '/worker_wearable';

    constructor(private service: HttpClientService) { }

    getWorkerWearableList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.workerWearable.map((jsonWorkerWearable) => {
                return new WorkerWearable().initializeWithJSON(jsonWorkerWearable);
            });
        });
    }

    getWorkerWearableByIdWearable(idWearable: string) {
        idWearable = idWearable.replace(/[^\da-zA-Z]+/g, '');

        return this.service.get(this.endpoint + '/idWearable/' + idWearable).map(jsonResponse => {
            return jsonResponse.workerWearable == null ? null : new WorkerWearable().initializeWithJSON(jsonResponse.workerWearable);
        });
    }

    saveWorkerWearable(_workerWearable: WorkerWearable) {
        _workerWearable.idWearable = _workerWearable.idWearable.replace(/[^\da-zA-Z]+/g, '');

        return this.createWorkerWearable(_workerWearable);
    }

    createWorkerWearable(_workerWearable: WorkerWearable) {
        return this.service.post(this.endpoint, JSON.stringify(_workerWearable.toJSON()))
            .map((jsonResponse) => {
                return new WorkerWearable().initializeWithJSON(jsonResponse.workerWearable);
            });
    }

    updateWorkerWearable(_workerWearable: WorkerWearable) {
        return this.service.put(this.endpoint + '/' + _workerWearable.id, JSON.stringify(_workerWearable.toJSON()))
            .map((jsonResponse) => {
                return new WorkerWearable().initializeWithJSON(jsonResponse.updateWorkerWearable);
            });
    }

    removeWorkerWearableByIdWearable(idWearable: Number) {
        return this.service.put(this.endpoint + '/removeWorkerWearableByIdWearable/' + idWearable, JSON.stringify(this.workerWearable))
            .map((response) => {
                return response;
            });
    }

    getWorkerWearableByCPF(cpf: string) {
        cpf = cpf.replace(/[^0-9]+/g, '');
        return this.service.get(this.endpoint + '/cpf/' + cpf).map(jsonResponse => {

            if (jsonResponse.workerWearable) {
                return new WorkerWearable().initializeWithJSON(jsonResponse.workerWearable);
            } else {
                return new WorkerWearable();
            }
        });
    }

}
