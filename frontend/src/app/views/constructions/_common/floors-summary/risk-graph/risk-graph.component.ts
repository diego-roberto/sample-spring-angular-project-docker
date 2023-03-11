import { Component, Input } from '@angular/core';
import { Risk } from 'app/shared/models/risk.model';

@Component({
    selector: 'risk-graph',
    templateUrl: 'risk-graph.component.html',
    styleUrls: ['./risk-graph.component.scss']
})

export class RiskGraphComponent {

    @Input() risks: Risk[];

    constructor() { }
}
