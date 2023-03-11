import { Directive, HostListener } from '@angular/core';
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[validateOnBlur]'
})
export class ValidateOnBlurDirective {
  
  constructor(private ngControl : NgControl) { }

  @HostListener('focus', ['$event.target'])
  onFocus(target) {
    this.ngControl.control.markAsUntouched();
  }

  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
    this.ngControl.control.markAsTouched();
  }
  
}
