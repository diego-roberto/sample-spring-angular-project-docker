import { NotificationType } from 'app/shared/models/notification-types.model';
import { Notification } from 'app/shared/models/notifications.model';
import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { EpiTypes } from 'app/shared/models/epi-types.model';

@Injectable()
export class NotificationTypesService {
    private endpoint = '/notification_types';

    constructor(private service: HttpClientService) { }

    getNotificationTypes() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.notificationTypes.map((jsonNotificationTypes) => {
                return new NotificationType().initializeWithJSON(jsonNotificationTypes);
            });
        });
    }

    getNotificationTypeById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new NotificationType().initializeWithJSON(jsonResponse.notificationType);
        });
    }
}
