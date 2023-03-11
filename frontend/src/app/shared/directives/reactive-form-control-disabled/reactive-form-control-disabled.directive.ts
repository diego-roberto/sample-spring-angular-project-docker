import { NgControl, NgForm } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[reactiveFormControlDisabled]'
})
export class ReactiveFormControlDisabledDirective {

  @Input() set reactiveFormControlDisabled(doDisable: boolean) {
    if (doDisable) {
      this.ngControl.control.disable();
    } else {
      this.ngControl.control.enable();
    }
  }

  constructor(private ngControl: NgControl) { }

}
