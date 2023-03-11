
export class TrainingScheduleDetails {
    trainingTitle: string;
    scheduledDate: Date;
    scheduledEndDate: Date;
    scheduledTime: Date;
    scheduledPlace: string;
    exhibitionType: string;
    ministersNames: string[];
    workers: Map<string, string>;

    public initializeWithJSON(json: any): TrainingScheduleDetails {

        this.trainingTitle = json.trainingTitle;
        this.scheduledDate = json.scheduledDate;
        this.scheduledEndDate = json.scheduledEndDate;
        this.scheduledTime = json.scheduledTime;
        this.scheduledPlace = json.scheduledPlace;
        this.exhibitionType = json.exhibitionType;
        this.ministersNames = json.ministersNames;
        this.workers = this.jsonToStrMap(json.workers);

        return this;
    }

    public toJSON() {
        return {
            trainingTitle: this.trainingTitle,
            scheduledDate: this.scheduledDate,
            scheduledEndDate: this.scheduledEndDate,
            scheduledTime: this.scheduledTime,
            scheduledPlace: this.scheduledPlace,
            exhibitionType: this.exhibitionType,
            ministersNames: this.ministersNames,
            workers: this.workers
        };
    }

    private jsonToStrMap(json) {
        const strMap = new Map();
        for (const k of Object.keys(json)) {
            strMap.set(k, json[k]);
        }
        return strMap;
    }
}
