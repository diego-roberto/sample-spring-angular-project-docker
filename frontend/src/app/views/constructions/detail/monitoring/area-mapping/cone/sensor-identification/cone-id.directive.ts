import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import { ConeIdPipe } from 'app/shared/pipes/common.pipe';

@Directive({ selector: '[coneIdFormatter]' })
export class ConeIdFormatterDirective implements OnInit {

    private el: any;

    constructor(
        private elementRef: ElementRef,
        private coneIdPipe: ConeIdPipe
    ) {
        this.el = this.elementRef.nativeElement;

    }

    ngOnInit() {
        this.el.value = this.coneIdPipe.transform(this.el.value);
    }

    @HostListener('focus', ['$event.target.value'])
    onFocus(value) {
        this.el.value = this.coneIdPipe.parse(value); // opossite of transform
    }

    @HostListener('blur', ['$event.target.value'])
    onBlur(value) {
        this.el.value = this.coneIdPipe.transform(value);
    }
}
