import { Component, Input } from '@angular/core';

@Component({
    selector: 'filtered-section-list',
    templateUrl: 'filtered-section-list.component.html',
    styleUrls: ['./filtered-section-list.component.scss']
})

export class FilteredSectionListComponent {
    @Input() sections = [];

    constructor() { }
}
