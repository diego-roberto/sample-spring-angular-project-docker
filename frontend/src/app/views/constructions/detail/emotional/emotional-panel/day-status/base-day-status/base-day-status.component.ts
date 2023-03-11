import { Component, Input } from '@angular/core';

@Component({
    selector: 'base-day-status',
    templateUrl: 'base-day-status.component.html',
    styleUrls: ['./base-day-status.component.scss'],
})
export class BaseDayStatusComponent {
    @Input() image: string;
    @Input() label: string;
    @Input() value: number;

    constructor() { }
}
