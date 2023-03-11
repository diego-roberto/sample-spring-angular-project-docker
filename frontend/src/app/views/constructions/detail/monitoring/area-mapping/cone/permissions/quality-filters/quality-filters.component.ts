import { Component, Input } from '@angular/core';
import { Qualities } from 'app/shared/models/qualities.model';

@Component({
    selector: 'quality-filters',
    templateUrl: 'quality-filters.component.html',
    styleUrls: ['quality-filters.component.scss']
})

export class QualityFiltersComponent {
  @Input() qualities: Array<Qualities>;
}
