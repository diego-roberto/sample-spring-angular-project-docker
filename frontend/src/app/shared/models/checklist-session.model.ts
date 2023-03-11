import { Clonable } from 'app/shared/util/generic/form/clonable';
import { Checklist } from './checklist.model';
import { ChecklistQuestion } from './checklist-question.model';

export class ChecklistSession implements Clonable<ChecklistSession> {
    // ChecklistSession
    id: number;
    session: string;

    idChecklist: number;

    checklistQuestions: Array<ChecklistQuestion> = [];

    initializeWithJSON(json, checklist?: Checklist) {
        this.id = json.id;
        this.session = json.session;

        this.idChecklist = json.idChecklist;

        if (json.checklistQuestions) {
            this.checklistQuestions = json.checklistQuestions.map(jsonChecklistQuestion => new ChecklistQuestion().initializeWithJSON(jsonChecklistQuestion, this));
        }

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            session: this.session,

            idChecklist: this.idChecklist,

            checklistQuestions: this.checklistQuestions.map(checklistQuestion => checklistQuestion.toJSON()),
        };
    }

    clone(): ChecklistSession {
        const checklistSession = Object.assign(new ChecklistSession(), this);

        return checklistSession;
    }
}
