import { Clonable } from '../util/generic/form/clonable';

export class AssessmentPenalty implements Clonable<AssessmentPenalty> {
    id: number;
    minEmployee: number;
    maxEmployee: number;
    identifier: string;
    value: number;

    public constructor() { }

    public initializeWithJSON(json: any): AssessmentPenalty {
        this.id = json.id;
        this.minEmployee = json.minEmployee;
        this.maxEmployee = json.maxEmployee;
        this.identifier = json.identifier;
        this.value = json.value;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            minEmployee: this.minEmployee,
            maxEmployee: this.maxEmployee,
            identifier: this.identifier,
            value: this.value
        };
    }

    clone(): AssessmentPenalty {
        const assessmentPenalty = Object.assign(new AssessmentPenalty(), this);
        return assessmentPenalty;
    }
}
