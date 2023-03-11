import { Clonable } from 'app/shared/util/generic/form/clonable';

import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistSession } from './checklist-session.model';
import { ChecklistQuestionRule } from './checklist-question-rule.model';
import { ChecklistQuestionAnswer } from './checklist-question-answer.model';

export class ChecklistQuestion implements Clonable<ChecklistQuestion> {

    id: number;
    title: string;
    changeDate: Date;
    help: string;
    baseActionPlan: string;

    idChecklist: number;
    idSession: number;

    checklistQuestionRules: Array<ChecklistQuestionRule> = [];
    checklistQuestionAnswers: Array<ChecklistQuestionAnswer> = [];

    constructor() { }

    initializeWithJSON(json, checklistSession?: ChecklistSession) {
        this.id = json.id;
        this.title = json.title;
        this.changeDate = json.changeDate;
        this.help = json.help;
        this.baseActionPlan = json.baseActionPlan;

        this.idChecklist = json.idChecklist;
        this.idSession = json.idSession;

        if (json.checklistQuestionRules) {
            this.checklistQuestionRules = json.checklistQuestionRules.map(jsonChecklistQuestionRule => new ChecklistQuestionRule().initializeWithJSON(jsonChecklistQuestionRule, this));
        }

        if (json.checklistQuestionAnswers) {
            this.checklistQuestionAnswers = json.checklistQuestionAnswers.map(jsonChecklistQuestionAnswer => new ChecklistQuestionAnswer().initializeWithJSONChecklistQuestion(jsonChecklistQuestionAnswer, this));
        }

        return this;
    }


    toJSON() {
        return {
            id: this.id,
            title: this.title,
            changeDate: this.changeDate,
            help: this.help,
            baseActionPlan: this.baseActionPlan,

            idChecklist: this.idChecklist,
            idSession: this.idSession,

            checklistQuestionAnswers: this.checklistQuestionAnswers.map(checklistQuestionAnswer => checklistQuestionAnswer.toJSON()),
            checklistQuestionRules: this.checklistQuestionRules.map(checklistQuestionRule => checklistQuestionRule.toJSON()),
        };
    }

    clone(): ChecklistQuestion {
        const checklistQuestion = Object.assign(new ChecklistQuestion(), this);

        return checklistQuestion;
    }
}
