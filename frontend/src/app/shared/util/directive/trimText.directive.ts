import { NgControl } from '@angular/forms';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[trimText]'
})
export class TrimTextDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
    if ( this.ngControl.value )
      this.ngControl.control.setValue((<string> this.ngControl.value).trim());
  }

}
