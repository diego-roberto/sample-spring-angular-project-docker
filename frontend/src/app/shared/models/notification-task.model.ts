import { Notification } from './notifications.model';
import { Task } from './task.model';

export class NotificationTask {

    id: number;

    task: Task;

    constructionId: number;

    initializeWithJSON(json: any): NotificationTask {
        this.id = json.id;
        this.task = json.task ? new Task().initializeWithJSON(json.task) : null;
        this.constructionId = json.constructionId;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            task: this.task ? this.task.toJSON() : null,
            constructionId: this.constructionId
        };
    }
}
