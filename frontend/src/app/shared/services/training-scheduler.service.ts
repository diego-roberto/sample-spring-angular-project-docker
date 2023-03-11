import { HttpClientService, ClientType } from './http-client.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TrainingScheduler } from 'app/shared/models/training-scheduler.model';
import { TrainingMinister } from '../models/training-minister.model';
import { Training } from 'app/shared/models/training.model';
import { TrainingUpdateScheduler } from 'app/shared/models/training-update-scheduler.model';


@Injectable()
export class TrainingSchedulerService {
    private endpoint = '/trainingscheduler';

    constructor(private service: HttpClientService) { }

    scheduleTrainings(trainingScheduler: TrainingScheduler): Observable<any> {
        return this.service.post(this.endpoint, JSON.stringify(trainingScheduler.toJSON()))
         .map((jsonResponse) => {
             return jsonResponse;
        });
    }
    updateScheduledTraining(trainingScheduler: TrainingUpdateScheduler): Observable<any> {
        return this.service.put(this.endpoint, JSON.stringify(trainingScheduler.toJSON()))
         .map((jsonResponse) => {
             return jsonResponse;
        });

    }

    createMinister(minister: TrainingMinister): Observable<any> {
        return this.service.post(this.endpoint + '/createMinister', JSON.stringify(minister.toJSON()))
         .map((jsonResponse) => {
             return jsonResponse;
        });
    }
    
    getTrainignFromScheduledId(id: number): Observable<any> {
        return this.service.get(this.endpoint + '/training/from/' + id)
        .map((jsonResponse) => {
            return new Training().initializeWithJSON(jsonResponse.training);
        });
    }
}
