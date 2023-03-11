import { ChecklistQuestion } from './checklist-question.model';
import { User } from './user.model';
import { environment } from 'environments/environment';

import * as Moment from 'moment';
import { Clonable } from '../util/generic/form/clonable';

import { ChecklistStatus } from './checklist-status.model';
import { ChecklistSession } from './checklist-session.model';
import { ChecklistAnswer } from './checklist-answer.model';

const statuses = {
    0: 'BANK OF CHECKLIST',
    1: 'HISTORIC'
};

export class Checklist implements Clonable<Checklist> {
    id: number;
    name: string;
    userChangeId: number;
    changeDate: Date;
    fatherId: number;
    publishDate: Date;
    hasContract: boolean;
    sesiBelongs: boolean;
    hasAnswer: boolean;
    hasResult: boolean;
    checklistToAnswerId: number;
    generatesActionPlan: boolean;
    versionNumber: number;

    status: ChecklistStatus = new ChecklistStatus();

    checklistSessions: Array<ChecklistSession> = [];

    userChange: User;

    continueDisable: boolean;
    introduction: string;

    public constructor() { }

    public initializeWithJSON(json: any): Checklist {
        this.id = json.id;
        this.name = json.name;
        this.userChangeId = json.userChangeId;
        this.changeDate = json.changeDate;
        this.fatherId = json.fatherId;
        this.publishDate = json.publishDate;
        this.hasContract = json.hasContract;
        this.hasAnswer = json.hasAnswer;
        this.hasResult = json.hasResult;
        this.checklistToAnswerId = json.checklistToAnswerId;
        this.sesiBelongs = json.sesiBelongs;
        this.generatesActionPlan = json.generatesActionPlan;
        this.status = json.status;
        this.introduction = json.introduction;
        this.versionNumber = json.versionNumber;

        if (json.checklistSessions) {
            this.checklistSessions = json.checklistSessions.map(jsonChecklistSession => new ChecklistSession().initializeWithJSON(jsonChecklistSession, this));
        }

        if (json.userChange) {
            this.userChange = new User().initializeWithJSON(json.userChange);
        }

        this.continueDisable = json.continueDisable;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            status: this.status,
            userChangeId: this.userChangeId,
            changeDate: this.changeDate,
            fatherId: this.fatherId,
            publishDate: this.publishDate,
            checklistSessions: this.checklistSessions.map(checklistSession => checklistSession.toJSON()),
            userChange: this.userChange ? this.userChange.toJSON() : undefined,
            hasContract: this.hasContract,
            hasAnswer: this.hasAnswer,
            hasResult: this.hasResult,
            checklistToAnswerId: this.checklistToAnswerId,
            sesiBelongs: this.sesiBelongs,
            generatesActionPlan: this.generatesActionPlan,
            continueDisable: this.continueDisable,
            introduction: this.introduction
        };
    }

    public toUpdateJSON() {
        return {
            id: this.id,
            name: this.name,
            status: this.status,
            userChangeId: this.userChangeId,
            changeDate: this.changeDate,
            fatherId: this.fatherId,
            publishDate: this.publishDate,
            hasContract: this.hasContract,
            sesiBelongs: this.sesiBelongs,
            generatesActionPlan: this.generatesActionPlan,
            hasAnswer: this.hasAnswer,
            hasResult: this.hasResult,
            checklistToAnswerId: this.checklistToAnswerId,
            continueDisable: this.continueDisable,
            introduction: this.introduction
        };
    }

    clone(): Checklist {
        const checklist = Object.assign(new Checklist(), this);
        return checklist;
    }

}

