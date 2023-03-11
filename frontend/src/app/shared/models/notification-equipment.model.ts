import { Notification } from './notifications.model';
import { Task } from './task.model';
import { Equipment } from './equipment.model';

export class NotificationEquipment {

    id: number;

    equipment: Equipment;

    initializeWithJSON(json: any): NotificationEquipment {
        this.id = json.id;
        this.equipment = json.equipment ? new Equipment().initializeWithJSON(json.equipment, null) : null;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            equipment: this.equipment ? this.equipment.toJSON() : null
        };
    }
}
