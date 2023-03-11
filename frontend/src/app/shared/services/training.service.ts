
import { HttpClientService, ClientType } from './http-client.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Training } from 'app/shared/models/training.model';
import { TrainingMinister } from 'app/shared/models/training-minister.model';
import { TrainingGenericAssign } from '../models/training-generic-assign.model';


@Injectable()
export class TrainingService {
    public training: Training;
    public ministers: TrainingMinister;

    private endpointTraining = '/trainings';
    private endpointInactivate = '/inactivate';

    constructor(private service: HttpClientService) { }

    getTrainingList(page: Number, categories: string, query: string) {
        return this.service.get(this.endpointTraining + '/page/' + page + '/exclude/' + categories + '?q=' + query)
            .map(jsonResponse => {
                return jsonResponse.trainings.map((jsonTraining) => {
                    return new Training().initializeWithJSON(jsonTraining);
                });
            });

    }

    getById(id: number): Observable<any> {
        return this.service.get(this.endpointTraining + '/' + id)
            .map((jsonResponse) => {
                return new Training().initializeWithJSON(jsonResponse.training);
            });
    }

    getMinisters() {
        return this.service.get(this.endpointTraining + '/ministers')
            .map(jsonResponse => {
                return jsonResponse.ministers.map((jsonMinisters) => {
                    return new TrainingMinister().initializeWithJSON(jsonMinisters);
                });
            });
    }

    getSelectedMinistersByTrainingScheduleId(id: number) {
        return this.service.get(this.endpointTraining + '/selectedministers/' + id)
            .map(jsonResponse => {
                return jsonResponse.ministers.map((jsonMinisters) => {
                    return new TrainingMinister().initializeWithJSON(jsonMinisters);
                });
            });
    }

    private serializeTraining(json: Object) {
        const c = new Training();
        c.initializeWithJSON(json);
        return c;
    }

    inactivateTraining(id) {
        return this.service.put(this.endpointTraining + '/' + id + this.endpointInactivate, null).map((jsonResponse) => {
            return jsonResponse.updated;
        });
    }

    createTraining(training: Training): Observable<any> {
        return this.service.post(this.endpointTraining, JSON.stringify(training.toJSON()))
            .map((jsonResponse) => {
                return jsonResponse;
            });
    }

    assign_services(params: TrainingGenericAssign): Observable<any> {
        return this.service.post(this.endpointTraining + '/assign-services', JSON.stringify(params.toJSON()))
            .map((jsonResponse) => {
                return jsonResponse;
            });
    }
    assign_exhibitions(params: TrainingGenericAssign): Observable<any> {
        return this.service.post(this.endpointTraining + '/assign-exhibitions', JSON.stringify(params.toJSON()))
            .map((jsonResponse) => {
                return jsonResponse;
            });
    }
    assign_categories(params: TrainingGenericAssign): Observable<any> {
        return this.service.post(this.endpointTraining + '/assign-categories', JSON.stringify(params.toJSON()))
            .map((jsonResponse) => {
                return jsonResponse;
            });
    }

    assign_keywords(params: TrainingGenericAssign): Observable<any> {
        return this.service.post(this.endpointTraining + '/assign-keywords', JSON.stringify(params.toJSON()))
            .map((jsonResponse) => {
                return jsonResponse;
            });
    }


}
