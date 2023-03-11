import { Component, Input, } from '@angular/core';
import { Epi } from 'app/shared/models/epi.model';

@Component({
    selector: 'epi-filters',
    templateUrl: 'epi-filters.component.html',
    styleUrls: ['epi-filters.component.scss']
})

export class EpiFiltersComponent {

    @Input() epis: Epi[];

    constructor() { }
}
