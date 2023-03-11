import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[ngModel][lowercase]'
})
export class LowerCaseDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.toLowerCase();
    this.ngModelChange.emit(this.value);
  }
}
  
