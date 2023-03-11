import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[safetyAutofocus]'
})
export class AutofocusDirective implements OnInit {

    constructor(private elementRef: ElementRef) { };

    ngOnInit(): void {
        this.elementRef.nativeElement.focus();
    }

}
