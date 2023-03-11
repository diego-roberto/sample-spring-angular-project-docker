import { Component, Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { Icon } from 'app/shared/models/icon.model';

@Component({
    selector: 'app-toolbox',
    templateUrl: 'toolbox.component.html',
    styleUrls: ['toolbox.component.scss']
})

export class ToolboxComponent implements OnChanges {

    @Output() change: EventEmitter<Icon> = new EventEmitter();

    @Input() icons: Icon[];

    private selectedIcon: Icon;

    constructor() { }

    ngOnChanges() { }

    select(icon: Icon) {
        this.selectedIcon = this.selectedIcon !== icon ? icon : null;
        this.change.emit(this.selectedIcon);
    }
}
