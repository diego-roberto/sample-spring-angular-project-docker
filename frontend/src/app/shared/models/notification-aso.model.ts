import { Notification } from './notifications.model';
import { Task } from './task.model';
import { Equipment } from './equipment.model';
import { Aso } from './aso.model';

export class NotificationAso {

    id: number;

    aso: Aso;

    initializeWithJSON(json: any): NotificationAso {
        this.id = json.id;
        this.aso = json.aso ? new Aso().initializeWithJSON(json.aso) : null;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            aso: this.aso ? this.aso.toJSON() : null
        };
    }
}
