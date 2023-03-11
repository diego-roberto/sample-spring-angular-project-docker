import { EmotionalResult } from 'app/shared/models/emotional-result.model';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'workers-overview',
    templateUrl: 'workers-overview.component.html',
    styleUrls: ['./workers-overview.component.scss']
})
export class WorkersOverviewComponent {
    @Input() results: EmotionalResult;
    @Input() total = 0;
}
