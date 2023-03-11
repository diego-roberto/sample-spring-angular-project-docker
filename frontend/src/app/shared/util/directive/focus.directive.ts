import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective implements OnInit {

    @Input() focus: boolean;

    constructor(private elementRef: ElementRef) { };

    ngOnInit(): void {
        if (this.focus) {
            this.elementRef.nativeElement.focus();
        }
    }

}
