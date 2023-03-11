import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'fab',
    templateUrl: 'fab.component.html',
    styleUrls: ['./fab.component.scss']
})

export class FabComponent {
    @Output() click: EventEmitter<any> = new EventEmitter();
}
