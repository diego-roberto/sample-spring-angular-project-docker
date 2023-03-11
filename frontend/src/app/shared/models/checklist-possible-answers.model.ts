import { Clonable } from '../util/generic/form/clonable';

export class ChecklistPossibleAnswers implements Clonable<ChecklistPossibleAnswers> {
    id: number;
    answer: string;

    public constructor() { }

    public initializeWithJSON(json: any): ChecklistPossibleAnswers {
        this.id = json.id;
        this.answer = json.answer;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            answer: this.answer
        };
    }

    public toUpdateJSON() {
        return {
            id: this.id,
            answer: this.answer
        };
    }

    clone(): ChecklistPossibleAnswers {
        const checklistPossibleAnswers = Object.assign(new ChecklistPossibleAnswers(), this);
        return checklistPossibleAnswers;
    }
}
