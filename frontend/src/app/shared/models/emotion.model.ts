import { Construction } from "./construction.model";
import { Worker } from "./worker.model";

export class Emotion {
    id: number;
    worker: Worker;
    construction: Construction;
    feeling: number;
    answered: boolean;
    createdAt: any;

    public initializeWithJSON(json: any): Emotion {
        this.id = json.id;
        this.worker = json.worker;
        this.construction = json.construction;
        this.feeling = json.feeling;
        this.answered = json.answered;
        this.createdAt = json.createdAt;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            worker: this.worker,
            construction: this.construction,
            feeling: this.feeling,
            answered: this.answered,
            createdAt: this.createdAt
        };
    }
}
