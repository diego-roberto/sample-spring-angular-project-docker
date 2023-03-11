import { User } from 'app/shared/models/user.model';
import { Notification } from 'app/shared/models/notifications.model';
import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import { Construction } from 'app/shared/models/construction.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationsService {

    private endpoint = '/notifications';
    private user = '/user';
    private read = '/read';
    private constructions = '/constructions';
    private unread = '/unread';

    constructor(private service: HttpClientService) { }

    getNotificationsList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.notifications.map((jsonEpiNotification) => {
                return new Notification().initializeWithJSON(jsonEpiNotification);
            });
        });
    }

    getNotificationsListByUser(user: User) {
        return this.service.get(this.endpoint + this.user + '/' + user.id).map(jsonResponse => {
            return jsonResponse.notifications.map((jsonEpiNotification) => {
                return new Notification().initializeWithJSON(jsonEpiNotification);
            });
        });
    }

    readNotification(id: number) {
        return this.service.put(this.endpoint + this.read + '/' + id, null).map(jsonResponse => {
            return jsonResponse;
        });
    }

    getUnreadByConstructions(constructions: Construction[]): Observable<Map<number, number>> {
        return this.service.post(this.endpoint + this.constructions + this.unread, JSON.stringify(constructions.map(x => x.toJSON()))).map((jsonResponse) => {
            const unreadByConstructionId = new Map<number, number>();
            for (const construction of constructions) {
                unreadByConstructionId.set(construction.id, jsonResponse.unreadAmount[construction.id]);
            }
            return unreadByConstructionId;
        });
    }

}
