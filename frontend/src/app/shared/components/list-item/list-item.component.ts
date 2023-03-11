import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'safety-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

    @Input() bulkEditable = false;
    @Input() checked = false;

    constructor() { }

    ngOnInit() { }

}
