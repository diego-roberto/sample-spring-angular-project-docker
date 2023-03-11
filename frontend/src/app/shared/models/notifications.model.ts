import { NotificationOccurrence } from './notification-occurrence.model';
import { NotificationType } from './notification-types.model';
import { Floor } from './floor.model';
import { NotificationTask } from './notification-task.model';
import { NotificationEquipment } from './notification-equipment.model';
import { NotificationAso } from './notification-aso.model';
export class Notification {

    id: number;
    description: string;
    createdAt: any;
    userResponsable: number;
    checked: boolean;
    userEmail: string;

    floor: Floor;
    notificationType: NotificationType;

    notificationTask: NotificationTask;
    notificationEquipment: NotificationEquipment;
    notificationAso: NotificationAso;
    notificationOccurrence: NotificationOccurrence;


    public initializeWithJSON(json: any) {
        this.id = json.id;
        this.description = json.description;
        this.createdAt = json.createdAt;
        this.userResponsable = json.userResponsable;
        this.checked = json.checked;
        this.userEmail = json.userEmail;
        this.floor = json.floorId ? new Floor().initWithJSONFloor(json.floorId) : null;
        this.notificationType = json.notificationType;
        this.notificationTask = json.notificationTask ? new NotificationTask().initializeWithJSON(json.notificationTask) : null;
        this.notificationEquipment = json.notificationEquipment ? new NotificationEquipment().initializeWithJSON(json.notificationEquipment) : null;
        this.notificationAso = json.notificationAso ? new NotificationAso().initializeWithJSON(json.notificationAso) : null;
        this.notificationOccurrence = json.notificationOccurrence ? new NotificationOccurrence().initializeWithJSON(json.notificationOccurrence) : null;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            description: this.description,
            createdAt: this.createdAt,
            userResponsable: this.userResponsable,
            checked: this.checked,
            userEmail: this.userEmail,
            floor: this.floor,
            notificationType: this.notificationType,
        };
    }

    public copyValues(notification: Notification) {
        this.description = notification.description;
        this.userResponsable = notification.userResponsable;
        this.checked = notification.checked;
    }
}
