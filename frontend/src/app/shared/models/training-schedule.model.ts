
export class TrainingSchedule {
    id: number;
    trainingId: number;
    trainingTitle: string;
    scheduledBegin: Date;
    scheduledEnd: Date;
    scheduledTime: Date;
    place: string;


    public initializeWithJSON(json: any): TrainingSchedule {

        this.id             = json.id;
        this.trainingId     = json.trainingId;
        this.trainingTitle  = json.title;
        this.scheduledBegin = json.scheduledBegin;
        this.scheduledEnd   = json.scheduledEnd;
        this.scheduledTime  = json.scheduledTime;
        this.place          = json.place;

        return this;
    }

    public toJSON() {
        return {
            id:             this.id,
            trainingId:     this.trainingId,
            title:          this.trainingTitle,
            scheduledBegin: this.scheduledBegin,
            scheduledEnd:   this.scheduledEnd,
            scheduledTime:  this.scheduledTime,
            place:          this.place
        };
    }
}
