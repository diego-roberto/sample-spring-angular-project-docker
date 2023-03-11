import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MdInputDirective } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('searchState', [
      state('false', style({ width: '0' })),
      state('true', style({ width: '150px' })),
      transition('false <=> true', animate('0.3s'))
    ])
  ],
})

export class SearchComponent implements OnDestroy {

  @ViewChild('textFilterInput', { read: MdInputDirective }) searchInput: MdInputDirective;

  @Input()
  get showSearch() { return this.showSearchChange.getValue(); }
  set showSearch(showing: boolean) { this.showSearchChange.next(showing); }

  @Output() showSearchChange: BehaviorSubject<boolean> = new BehaviorSubject(false);
  @Output() onTextChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() applyFilter: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  get value() { return this._value };
  set value(text: string) {
    this._value = text
  };

  _value: string;
  inputState: string;
  searchTimeout = null;

  constructor() {
    this.showSearchChange.subscribe(showing => {
      this.inputState = String(showing);
    });

    this.showSearchChange.subscribe(showing => {
      if (showing) {
        this.searchInput.focus();
      }
    });
  };

  handlePressEnter() {
    clearTimeout(this.searchTimeout);
    this.applyFilter.emit();
  }

  textChange(text: string) {
    this.onTextChange.emit(text);

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.handlePressEnter();
    }, 500);
  }

  ngOnDestroy() {
    this.showSearchChange.complete();
  }
}
