import { Worker } from './worker.model';
import { TrainingMinister } from 'app/shared/models/training-minister.model';

export class TrainingScheduler {
    selectedTrainingId:number;
    constructionId: number;
    trainingStartDate: string;
    trainingEndDate: string;
    vezes: number;
    repeat: boolean;
    selectedPeriodicity: number;
    selectedExhibitions: number;
    local: string;
    horario: string;
    ministrantes:  Array<TrainingMinister> ;
    workers: number[];

    public initializeWithJSON(json: any): TrainingScheduler {

        this.selectedTrainingId             = json.selectedTrainingId;
        this.constructionId                 = json.constructionId;
        this.trainingStartDate              = json.trainingStartDate;
        this.trainingEndDate                = json.trainingEndDate;
        this.vezes                          = json.vezes;
        this.repeat                         = json.repeat;
        this.selectedPeriodicity            = json.selectedPeriodicity;
        this.selectedExhibitions            = json.selectedExhibitions;
        this.local                          = json.local;
        this.horario                        = json.horario;
        this.ministrantes                   = json.ministrantes;
        this.workers                        = json.workers;
        return this;
    }

    public toJSON() {
        return {
            selectedTrainingId:             this.selectedTrainingId,
            constructionId:                 this.constructionId,
            trainingStartDate:              this.trainingStartDate,
            trainingEndDate:                this.trainingEndDate,
            vezes:                          this.vezes,
            repeat:                         this.repeat,
            selectedPeriodicity:            this.selectedPeriodicity,
            selectedExhibitions:            this.selectedExhibitions,
            local:                          this.local,
            horario:                        this.horario,
            ministrantes:                   this.ministrantes,
            workers:                        this.workers,
        };
    }

    constains(value: string) {

    }
}
