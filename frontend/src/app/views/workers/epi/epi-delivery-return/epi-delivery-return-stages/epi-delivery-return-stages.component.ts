import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'epi-delivery-return-stages',
    templateUrl: './epi-delivery-return-stages.component.html',
    styleUrls: ['./epi-delivery-return-stages.component.scss']
})
export class EpiDeliveryReturnStagesComponent implements OnInit {

    @Input() currentStep: number;
    @Input() totalSteps: number;
    @Input() title: String;

    constructor() { }

    ngOnInit() { }

}
