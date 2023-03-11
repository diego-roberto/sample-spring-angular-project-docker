import { User } from './user.model';
import { environment } from 'environments/environment';

import { ChecklistQuestion } from './checklist-question.model';

import * as Moment from 'moment';
import { Clonable } from '../util/generic/form/clonable';
import { ChecklistQuestionAnswer } from './checklist-question-answer.model';
import { ChecklistQuestionRuleType } from 'app/shared/models/checklist-question-rule-type.model';

export class ChecklistQuestionRule implements Clonable<ChecklistQuestionRule> {
    id: number;
    rule: ChecklistQuestionRuleType;
    identifier: string;

    // Relacionamentos
    idQuestion: number;

    public constructor() { }

    initializeWithJSON(json, checklistQuestion?: ChecklistQuestion) {
        this.id = json.id;
        this.rule = json.rule;
        this.identifier = json.identifier;

        this.idQuestion = json.idQuestion;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            rule: this.rule,
            identifier: this.identifier,

            idQuestion: this.idQuestion
        };
    }

    clone(): ChecklistQuestionRule {
        const checklist = Object.assign(new ChecklistQuestionRule(), this);
        return checklist;
    }
}
