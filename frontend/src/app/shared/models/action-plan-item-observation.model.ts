import { User } from 'app/shared/models/user.model';

export class ActionPlanItemObservation {

    id: number;
    actionPlanItemId: number;
    user: User;
    observation: string;
    observationAt: Date;

    constructor() { }

    initializeWithJSON(json): ActionPlanItemObservation {
        if (! json) { return null; };

        this.id = json.id;
        this.actionPlanItemId = json.actionPlanItemId;
        this.user = new User().initializeWithJSON({
                id: json.userId,
                name: json.userName
            });
        this.observation = json.observation;

        if (json.observationAt) {
            this.observationAt = new Date(json.observationAt);
        }

        return this;
    }

}
