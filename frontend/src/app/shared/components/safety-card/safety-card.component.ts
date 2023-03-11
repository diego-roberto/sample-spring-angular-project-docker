import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    trigger,
    style,
    animate,
    transition
} from '@angular/animations';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'safety-card',
    templateUrl: 'safety-card.component.html',
    styleUrls: ['./safety-card.component.scss'],
    animations: [
        trigger('easeInOut', [
            transition(':enter', [
                style({
                    opacity: 0
                }),
                animate('0.3s ease-in',
                    style({
                        opacity: 1
                    })
                )
            ]),
            transition(':leave', [
                style({
                }),
                animate('0.3s ease-out', style({
                    opacity: 0,
                }))
            ])
        ])
    ]
})
export class SafetyCardComponent implements OnInit {
    state;
    toggleIcon;

    toggleDisabled = false;
    topBarDisabled = false;
    toolbarDisabled = false;

    @Input() noPadding = false;

    @Input()
    set toggleDisable(v: boolean) {
        this.toggleDisabled = this.coerceBooleanProperty(v);
    }

    @Input()
    set topBarDisable(v: boolean) {
        this.topBarDisabled = this.coerceBooleanProperty(v);
    }

    @Input()
    set toolbarDisable(v: boolean) {
        this.toolbarDisabled = this.coerceBooleanProperty(v);
    }

    private readonly isHiddenObservable = new BehaviorSubject<boolean>(false);

    get isHidden(): boolean {
        return this.isHiddenObservable.getValue();
    }

    @Input()
    set isHidden(hidden: boolean) {
        if (hidden !== this.isHidden) {
            this.isHiddenObservable.next(hidden);
        }
    }

    @Output()
    private readonly onOpen = new EventEmitter<void>();

    @Output()
    private readonly onClose = new EventEmitter<void>();

    ngOnInit() {
        this.isHiddenObservable.subscribe(hidden => {
            if (hidden) {
                this.state = 'inactive';
                this.toggleIcon = 'keyboard_arrow_down';

                this.onClose.emit();
            } else {
                this.state = 'active';
                this.toggleIcon = 'keyboard_arrow_up';

                this.onOpen.emit();
            }
        })
    }

    coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }

    close() {
        this.isHidden = true;
    }

    open() {
        this.isHidden = false;
    }

    click() {
        if (this.isHidden) {
            this.open();
        } else { this.close(); }
    }

}

@Component({
    selector: 'safety-card-header',
    template: "<ng-content></ng-content>",
    styles: [' :host { width: 100%; box-sizing: border-box; flex-direction: row; white-space: nowrap; } ']
})
export class SafetyCardHeaderComponent { }

@Component({
    selector: 'safety-card-content',
    template: '<ng-content></ng-content>',
})

export class SafetyCardContentComponent { }
