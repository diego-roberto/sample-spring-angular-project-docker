import { Component, OnInit, Input } from '@angular/core';

import { Alert } from 'app/shared/models/alert.model';

@Component({
    selector: 'safety-alerts-tab',
    templateUrl: './alerts-tab.component.html',
    styleUrls: ['./alerts-tab.component.scss']
})
export class AlertsTabComponent implements OnInit {

    public active: Boolean;
    @Input() alerts: Array<Alert>;

    constructor() { }

    ngOnInit() { }

    toggleActive() {
        this.active = !this.active;
    }

}
