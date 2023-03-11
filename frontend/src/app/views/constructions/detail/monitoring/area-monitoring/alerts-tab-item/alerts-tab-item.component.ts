import { Component, OnInit, Input } from '@angular/core';

import { Alert } from 'app/shared/models/alert.model';

@Component({
  selector: 'safety-alerts-tab-item',
  templateUrl: './alerts-tab-item.component.html',
  styleUrls: ['./alerts-tab-item.component.scss']
})
export class AlertsTabItemComponent implements OnInit {

  @Input() alert: Alert;

  constructor() { }

  ngOnInit() { }

  isWrongAccess() {
    return this.alert.type === 'WRONG_ACCESS';
  }

  isLowBattery() {
    return this.alert.type === 'LOW_BATTERY';
  }

  isWorkerLowBattery() {
    return this.alert.worker && this.isLowBattery();
  }

  isConeLowBattery() {
    return this.alert.cone && this.isLowBattery();
  }

}
