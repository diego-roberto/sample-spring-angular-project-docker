import { Construction } from './construction.model';
import { Checklist } from 'app/shared/models/checklist.model';
import { User } from './user.model';
import { environment } from 'environments/environment';

import { ChecklistStatus } from './checklist-status.model';
import { ChecklistSession } from './checklist-session.model';
import { ChecklistQuestion } from 'app/shared/models/checklist-question.model';

import * as Moment from 'moment';
import { Clonable } from '../util/generic/form/clonable';
import { ChecklistQuestionAnswer } from './checklist-question-answer.model';
import { FileInfo } from 'app/shared/models/file-info.model';

export class ChecklistAnswer implements Clonable<ChecklistAnswer> {

    // ChecklistAnswer
    id: number;
    idUser: number;
    beginAnswer: Date;
    endAnswer: Date;
    numberWorkers: number;

    idChecklist: number;
    idConstructions: number;
    idActionPlan: number;
    isLastChecklistAnswer: boolean;

    checklist: Checklist;
    checklistQuestionAnswers: Array<ChecklistQuestionAnswer> = [];

    user: User;
    fileInfo: FileInfo;

    public constructor() { }

    initializeWithJSON(json, checklist?: Checklist) {
        this.id = json.id;
        this.idUser = json.idUser;
        this.beginAnswer = json.beginAnswer ? new Date(json.beginAnswer) : undefined;
        this.endAnswer = json.endAnswer ? new Date(json.endAnswer) : undefined;
        this.numberWorkers = json.numberWorkers;

        this.idChecklist = json.idChecklist;
        this.idConstructions = json.idConstructions;
        this.idActionPlan = json.idActionPlan;
        this.isLastChecklistAnswer = json.isLastChecklistAnswer;

        if (json.checklistQuestionAnswers) {
            this.checklistQuestionAnswers = json.checklistQuestionAnswers.map(jsonChecklistQuestionAnswer => new ChecklistQuestionAnswer().initializeWithJSONChecklistAnswer(jsonChecklistQuestionAnswer, this));
        }

        if (json.user) {
            this.user = new User().initializeWithJSON(json.user);
        }

        if (json.fileInfo) {
            this.fileInfo = new FileInfo().initializeWithJSON(json.fileInfo);
        }

        if (json.checklistDTO) {
            this.checklist = new Checklist().initializeWithJSON(json.checklistDTO);
        }

        return this;
    }

    initializeWithAnswer(checklistId: number, userId: number, constructionId: number, checklistQuestions: ChecklistQuestion[]) {
        this.idUser = userId;
        this.idChecklist = checklistId;
        this.idConstructions = constructionId;

        this.checklistQuestionAnswers = checklistQuestions.map(question => new ChecklistQuestionAnswer().initializeWithQuestion(question));

        return this;
    }

    initializeJSON(json) {
        if (!json) { return; };
        this.id = json.id;
        this.idUser = json.idUser;
        this.beginAnswer = json.beginAnswer ? new Date(json.beginAnswer) : undefined;
        this.endAnswer = json.endAnswer ? new Date(json.endAnswer) : undefined;
        this.numberWorkers = json.numberWorkers;
        this.idChecklist = json.idChecklist;
        this.idConstructions = json.idConstructions;
        if (json.checklistQuestionAnswers) {
            this.checklistQuestionAnswers = json.checklistQuestionAnswers.map(jsonChecklistQuestionAnswer => new ChecklistQuestionAnswer().initializeWithJSONChecklistAnswer(jsonChecklistQuestionAnswer, this));
        }

        if (json.user) {
            this.user = new User().initializeWithJSON(json.user);
        }

        if (json.fileInfo) {
            this.fileInfo = new FileInfo().initializeWithJSON(json.fileInfo);
        }

        if (json.checklistDTO) {
            this.checklist = new Checklist().initializeWithJSON(json.checklistDTO);
        }

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            idUser: this.idUser,
            beginAnswer: this.beginAnswer ? this.beginAnswer.getTime() : undefined,
            endAnswer: this.endAnswer ? this.endAnswer.getTime() : undefined,
            idChecklist: this.idChecklist,
            idConstructions: this.idConstructions,
            numberWorkers: this.numberWorkers,
            checklistQuestionAnswers: this.checklistQuestionAnswers.map(checklistQuestionAnswer => checklistQuestionAnswer.toJSON()),
            checklistQuestionRules: this.checklistQuestionAnswers.map(checklistQuestionRule => checklistQuestionRule.toJSON()),
            user: this.user ? this.user.toJSON() : null,
            fileInfo: this.fileInfo ? this.fileInfo.toJSON() : null,
            checklist: this.checklist ? this.checklist.toJSON() : null,
        };
    }

    clone(): ChecklistAnswer {
        const checklist = Object.assign(new ChecklistAnswer(), this);
        return checklist;
    }
}
