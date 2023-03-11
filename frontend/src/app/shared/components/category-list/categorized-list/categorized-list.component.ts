import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'safety-categorized-list',
  templateUrl: './categorized-list.component.html',
  styleUrls: ['./categorized-list.component.scss']
})
export class CategorizedListComponent implements OnInit {

  @Input() newCategoryLabel: string;
  @Output() added: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}
