import * as Moment from 'moment';

import { User } from 'app/shared/models/user.model';
import { Historic } from 'app/shared/models/actio-plan-historic.model';
import { ActionPlanItemObservation } from 'app/shared/models/action-plan-item-observation.model';
import { ActionPlanItemResponsible } from './action-plan-item-responsible.model';

export class ActionPlanItem {
    id: number;
    observation: string;
    endAt: any;
    beginAt: any;
    responsibleUser: ActionPlanItemResponsible;
    conclusionAt: any;
    status: string;
    priority: string;
    description: string;
    conclusion: boolean;
    idResponsible: number;
    observationHistoric: string[];
    historics: Array<Historic> = [];
    observationList: Array<ActionPlanItemObservation> = [];
    idActionPlan: number;
    conclusionUser: User;
    responsibleType: string;
    responsibleUserName: string;

    constructor() { }

    initializeWithJSON(json): ActionPlanItem {
        if (!json) { return null; };

        this.id = json.id;
        this.observation = json.observation;
        this.beginAt = json.beginAt ? Moment(json.beginAt) : null;
        this.endAt = json.endAt ? Moment(json.endAt) : null;
        this.status = json.status;
        this.priority = json.priority;
        this.description = json.description;
        this.conclusion = json.conclusion;
        this.idResponsible = json.idResponsible;
        this.observationHistoric = json.observationHistoric;
        this.historics = json.historics ? json.historics : new Array<Historic>();
        this.idActionPlan = json.idActionPlan;
        this.responsibleType = json.responsibleType;
        this.responsibleUserName = json.responsibleUserName;

        if (json.idResponsible) {
            this.responsibleUser = new ActionPlanItemResponsible().initializeWithJSON({id: json.idResponsible, name: json.responsibleUserName, type: json.responsibleType});
        }

        if (json.conclusionUser) {
            this.conclusionUser = new User().initializeWithJSON(json.conclusionUser);
        }
        if (json.historics) {
            this.historics = json.historics.map(historic => new Historic().initializeWithJSON(historic));
        }
        if (json.listActionPlanItemObs) {
            this.observationList = json.listActionPlanItemObs.map(observation => new ActionPlanItemObservation().initializeWithJSON(observation));
        }

        this.conclusionAt = json.conclusionAt ? Moment(json.conclusionAt) : null;

        return this;
    }

    toJSON(): any {
        if (this.responsibleUser) {
            this.idResponsible = this.responsibleUser.id;
            this.responsibleType = this.responsibleUser.type;
        }
        return {
            id: this.id,
            observation: this.observation,
            beginAt: this.beginAt ? this.beginAt.getTime() : null,
            endAt: this.endAt ? this.endAt.getTime() : null,
            conclusionAt: this.conclusionAt ? this.conclusionAt.getTime() : null,
            priority: this.priority,
            description: this.description,
            idResponsible: this.idResponsible,
            idActionPlan: this.idActionPlan,
            responsibleType: this.responsibleType,
        };
    }

    toJSONFormat(object: ActionPlanItem): any {
        if (object.responsibleUser) {
            object.idResponsible = object.responsibleUser.id;
            object.responsibleType = object.responsibleUser.type;
        }
        return {
            id: object.id,
            observation: object.observation,
            beginAt: object.beginAt ? Moment(object.beginAt) : null,
            endAt: object.endAt ? Moment(object.endAt) : null,
            conclusionAt: object.conclusionAt ? Moment(object.conclusionAt) : null,
            priority: this.priority,
            description: object.description,
            idResponsible: object.idResponsible,
            observationHistoric: object.observationHistoric,
            idActionPlan: object.idActionPlan,
            conclusionUser: object.conclusionUser ? object.conclusionUser.toJSON() : null,
            responsibleType: object.responsibleType,
        };
    }

    clone(): ActionPlanItem {
        return Object.assign(new ActionPlanItem(), this);
    }
}
