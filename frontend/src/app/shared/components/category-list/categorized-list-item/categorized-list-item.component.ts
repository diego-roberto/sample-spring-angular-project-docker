import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'safety-categorized-list-item',
    templateUrl: './categorized-list-item.component.html',
    styleUrls: ['./categorized-list-item.component.scss']
})
export class CategorizedListItemComponent implements OnInit {

    @Input() name: string;
    @Input() maxLength: number;
    @Input() index: number;
    @Input() deletable: boolean;
    @Input() visualType: string;
    @Output() edited: EventEmitter<{ string, number }> = new EventEmitter();
    @Output() removed: EventEmitter<number> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

}
