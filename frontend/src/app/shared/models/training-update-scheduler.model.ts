import { Worker } from './worker.model';
import { TrainingMinister } from 'app/shared/models/training-minister.model';
import * as Moment from 'moment';
export class TrainingUpdateScheduler {
    trainingScheduledId:number;
    trainingId:number;
    constructionId: number;
    trainingStartDate: any;
    trainingEndDate: any;
    local: string;
    horario: string;
    ministranteUpdated: boolean;
    ministrantes:  Array<TrainingMinister> ;
    workers: number[];

    public initializeWithJSON(json: any): TrainingUpdateScheduler {
        this.trainingScheduledId            = json.trainingScheduledId;
        this.trainingId                     = json.trainingId;
        this.constructionId                 = json.constructionId;
        this.trainingStartDate              = json.trainingStartDate ? Moment(json.trainingStartDate) : null;
        this.trainingEndDate                = json.trainingEndDate ? Moment(json.trainingEndDate) : null;    
        this.local                          = json.local;
        this.horario                        = json.horario;
        this.ministrantes                   = json.ministrantes;
        this.ministranteUpdated             = json.ministranteUpdated;
        this.workers                        = json.workers;
        return this;
    }

 
    public toJSON() {
        return {
            trainingScheduledId:            this.trainingScheduledId,
            trainingId:                     this.trainingId,
            constructionId:                 this.constructionId,
            trainingStartDate:              this.trainingStartDate,
            trainingEndDate:                this.trainingEndDate,
            local:                          this.local,
            horario:                        this.horario,
            ministrantes:                   this.ministrantes,
            ministranteUpdated:             this.ministranteUpdated,
            workers:                        this.workers,
        };
    }

    constains(value: string) {

    }
}
