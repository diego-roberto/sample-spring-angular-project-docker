import { ActionPlanItem } from './action-plan-item.model';
import { ChecklistAnswer } from './checklist-answer.model';
import { User } from './user.model';

export class ActionPlan {
    id: number;
    createdAt: Date;
    active: boolean;
    checklistAnswer: ChecklistAnswer;
    user: User;
    actionPlanItemList: ActionPlanItem[];

    constructor() { }

    initializeWithJSON(json): ActionPlan {
        if (! json) { return null; };

        this.id = json.id;
        this.createdAt = json.createdAt ? new Date(json.createdAt) : null;
        this.active = json.active;

        if (json.checklistAnswer) {
            this.checklistAnswer = new ChecklistAnswer().initializeWithJSON(json.checklistAnswer);
        }

        if (json.user) {
            this.user = new User().initializeWithJSON(json.user);
        }

        if (json.actionPlanItemList) {
            this.actionPlanItemList = json.actionPlanItemList.map(actionPlanItem => new ActionPlanItem().initializeWithJSON(actionPlanItem));
        }

        return this;
    }

    toJSON(): any {
        return {
            id: this.id,
            createdAt: this.createdAt ? this.createdAt.getTime() : null,
            active: this.active,
            checklistAnswer: this.checklistAnswer ? this.checklistAnswer.toJSON() : null,
            user: this.user ? this.user.toJSON() : null,
            actionPlanItemList: this.actionPlanItemList ? this.actionPlanItemList.map(actionPlanItem => actionPlanItem.toJSON()) : null
        };
    }

    clone(): ActionPlan {
        return Object.assign(new ActionPlan(), this);
    }
}
