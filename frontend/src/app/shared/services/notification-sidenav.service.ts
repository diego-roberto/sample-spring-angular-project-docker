import { User } from 'app/shared/models/user.model';
import { SessionsService } from 'app/shared/services/sessions.service';
import { WebSocketService } from './web-socket.service';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { Notification } from 'app/shared/models/notifications.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Construction } from 'app/shared/models/construction.model';
import { NotificationTypeConstant } from "app/shared/models/notification-types.model";

@Injectable()
export class NotificationSidenavService {
  private dataObs$ = new Subject<boolean>();
  private state = false;

  public userNotifications: Notification[] = null;

  public constructionsNotifications = new BehaviorSubject<Notification[]>([]);
  public construtionsUnreadAmount = new BehaviorSubject<number>(0);

  public currentConstruction: Construction;

  constructor(private webSocketService: WebSocketService) {
    this.subscribeWs();
  }

  public isOpen() {
    return this.dataObs$;
  }

  public close() {
    this.state = false;
    this.dataObs$.next(this.state);
  }

  public toggle() {
    this.state = !this.state;
    this.dataObs$.next(this.state);
  }

  public setNotifications(notifications: Notification[]) {
    this.userNotifications = notifications;
    if (notifications) {
      const localConstructionNotifications = this.currentConstruction ? this.filterByConstruction(notifications) : [];
      this.constructionsNotifications.next(localConstructionNotifications);
      this.construtionsUnreadAmount.next(localConstructionNotifications.filter(x => !x.checked).length);
    }
  }

  public readNotification(id: number) {
    this.constructionsNotifications.getValue().find(x => x.id === id).checked = true;
    this.construtionsUnreadAmount.next(this.construtionsUnreadAmount.getValue() - 1);
    this.constructionsNotifications.next(this.constructionsNotifications.getValue());
  }

  private getUserId() {
    const current = localStorage.getItem('auth_current');
    return current ? JSON.parse(current).id.toString() : '';
  }

  public subscribeWs() {
    this.webSocketService.connect('/notification/' + this.getUserId()).subscribe((x: Array<any>) => {
      this.setNotifications(x.map(notification => new Notification().initializeWithJSON(notification)));
    });
  }

  public endSession() {
    this.setNotifications(null);
    this.webSocketService.send('/end', '');
  }

  public setConstruction(construction: Construction) {
    this.currentConstruction = construction;
    this.setNotifications(this.userNotifications);
  }

  private filterByConstruction(notifications: Notification[]): Notification[] {
    const localNotifications = notifications;
    const filteredNotifications: Notification[] = [];
    for (const notification of localNotifications) {

      // tipo: task
      if (notification.notificationTask && notification.notificationTask.constructionId === this.currentConstruction.id) {
        filteredNotifications.push(notification);
        continue;
      }

      // tipo: aso
      if (notification.notificationAso && this.currentConstruction.workers.some(worker => worker.id == notification.notificationAso.aso.workerId)) {
        filteredNotifications.push(notification);
        continue;
      }

      // tipo: equipment
      if (notification.notificationEquipment && this.currentConstruction.equipments.some(equipment => equipment.id == notification.notificationEquipment.equipment.id)) {
        filteredNotifications.push(notification);
        continue;
      }

      // tipo: occurrence
      if (notification.notificationOccurrence && notification.notificationOccurrence.occurrence.constructionId && notification.notificationOccurrence.occurrence.constructionId === this.currentConstruction.id) {
        filteredNotifications.push(notification);
        continue;
      }

      // tipo: cipa
      if (this.validateType(notification, NotificationTypeConstant.CIPA)) {
        filteredNotifications.push(notification);
        continue;
      }

      // tipo: habilitações
      if (this.validateType(notification, NotificationTypeConstant.HABILITACAO)) {
        filteredNotifications.push(notification);
        continue;
      }

      // tipo: epi
      if (this.validateType(notification, NotificationTypeConstant.EPI)) {
        filteredNotifications.push(notification);
        continue;
      }

    }
    return filteredNotifications;
  }

  private validateType(notification: Notification, typeId: any): boolean {
    return notification &&
      notification.notificationType &&
      notification.notificationType.id &&
      notification.notificationType.id != null &&
      notification.notificationType.id === typeId
  }

}
