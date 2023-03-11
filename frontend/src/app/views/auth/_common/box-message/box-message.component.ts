import { Component, Input } from '@angular/core';

@Component({
    selector: 'box-message',
    templateUrl: 'box-message.component.html',
    styleUrls: ['./box-message.component.scss']
})

export class BoxMessageComponent {
    @Input() message: string;
    @Input() type: string;
    @Input() title: string;
}
