import { ActionPlanItem } from './action-plan-item.model';
import { ChecklistAnswer } from './checklist-answer.model';
import { User } from './user.model';

export class ActionPlanDTO {
    idPlan: number;
    description: string;
    creation: Date;
    qtdeStatus01: number;
    qtdeStatus02: number;
    qtdeStatus03: number;
    qtdeStatus04: number;
    qtdeStatus05: number;

    constructor() { }

    initializeWithJSON(json): ActionPlanDTO {
        if (! json) { return null; };

        this.idPlan = json.idPlan;
        this.description = json.description;
        this.creation = json.creation ? new Date(json.creation) : null;
        this.qtdeStatus01 = json.qtdeStatus01;
        this.qtdeStatus02 = json.qtdeStatus02;
        this.qtdeStatus03 = json.qtdeStatus03;
        this.qtdeStatus04 = json.qtdeStatus04;
        this.qtdeStatus05 = json.qtdeStatus05;

        return this;
    }

    toJSON(): any {
        return {
            id: this.idPlan,
            description: this.description,
            creation: this.creation ? this.creation.getTime() : null,
            qtdeStatus01: this.qtdeStatus01,
            qtdeStatus02: this.qtdeStatus02,
            qtdeStatus03: this.qtdeStatus03,
            qtdeStatus04: this.qtdeStatus04,
            qtdeStatus05: this.qtdeStatus05
        };
    }

    clone(): ActionPlanDTO {
        return Object.assign(new ActionPlanDTO(), this);
    }
}
