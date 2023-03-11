import { NotificationCount } from 'app/shared/util/json/notification-count';


export class ConstructionCount {

    constructionId: number;

    alerts: number;

    workers: number;

    cones: number;

    notifications: NotificationCount;

    initializeWithJSON(json: any): ConstructionCount {
        this.constructionId = json.constructionId;
        this.alerts = json.alerts;
        this.cones = json.cones;
        this.workers = json.workers;
        this.notifications = json.notifications ? new NotificationCount().initializeWithJSON(json.notifications) : null;
        return this;
    }
}
