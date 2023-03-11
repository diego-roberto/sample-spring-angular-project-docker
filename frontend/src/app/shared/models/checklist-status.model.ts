import { Clonable } from 'app/shared/util/generic/form/clonable';
import { ChecklistSession } from './checklist-session.model';

export class ChecklistStatus implements Clonable<ChecklistStatus> {

    id: number;
    status: string;

    constructor() { }

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.status = json.status;

        return this;
    }

    initWithJSONChecklistQuestion(json: any): ChecklistStatus {
        this.id = json.id;
        this.status = json.status;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            status: this.status
        };
    }

    clone(): ChecklistStatus {
        const checklistQuestion = Object.assign(new ChecklistStatus(), this);

        return checklistQuestion;
    }
}
