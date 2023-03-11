import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'mapping-stages',
    styleUrls: ['mapping-stages.component.scss'],
    templateUrl: 'mapping-stages.component.html'
})

export class MappingStagesComponent {

    @Input() current: number;
    @Input() total: number;

    @Output() back = new EventEmitter<void>();
}
