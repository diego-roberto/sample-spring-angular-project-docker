import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from 'app/shared/models/user.model';
import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { SessionsService } from 'app/shared/services/sessions.service';

import * as _c from 'lodash/collection';
import * as _a from 'lodash/array';

@Component({
  selector: 'checklist-list',
  templateUrl: 'checklist-list.component.html',
  styleUrls: ['./checklist-list.component.scss']
})

export class ChecklistListComponent implements OnInit {

  @ViewChild('bodyContent') bodyContent: ElementRef;

  @Input() checklistsFilteredList: Checklist[];
  @Input() checklistsList: Checklist[];
  @Input() taskScroll;

  @Input() lastChecklistAnswers: ChecklistAnswer[];

  @Output() activeChangeQuestions: EventEmitter<any> = new EventEmitter();
  @Output() verifyChecklistAnswer: EventEmitter<any> = new EventEmitter();

  @Output() activeResultList: EventEmitter<Checklist> = new EventEmitter();

  private currentUser: User;

  showSearch = false;
  showListDashboard = true;

  open = false;
  fixed = false;
  spin = true;
  direction = 'up';
  animationMode = 'fling';
  searchValue = '';

  activeFilters = {
    text: '',
  };

  scrollChecklists = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sessionsService: SessionsService) {
  }

  ngOnInit() {
    var filter = JSON.parse(sessionStorage.getItem('checklist_filter'))
    if (filter != null) {
      this.storagedFilter(filter);
    }
  }

  redirectTo(path) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText(storageFilter = '') {
    this.activeFilters.text = storageFilter || this.searchValue;
    sessionStorage.setItem('checklist_filter', JSON.stringify({ name: storageFilter || this.searchValue }))
    this.filterListChecklists();
  }

  filterListChecklists() {
    this.checklistsFilteredList = this.checklistsList
      .filter(Checklist =>
        !(this.activeFilters.text.length > 0 && Checklist.name.toLowerCase()
          .indexOf(this.activeFilters.text.trim().toLowerCase()) === -1)
      );
  }

  order(sort: { field, order }) {
    this.checklistsList = _c.orderBy(this.checklistsList, ['checklist.name', sort.field], ['asc', sort.order]);
    this.checklistsFilteredList = _c.orderBy(this.checklistsFilteredList, ['checklist.name', sort.field], ['asc', sort.order]);
  }

  lastIndex(checklist: Checklist) {
    const index = _a.findIndex(this.checklistsFilteredList, ['name', checklist.name]);

    if (checklist === this.checklistsFilteredList[index]) {
      return true;
    }
    return false;
  }

  getLastChecklistAnswer(idChecklist: number): ChecklistAnswer {
    if (this.lastChecklistAnswers) {
      return this.lastChecklistAnswers.find(e => e.idChecklist === idChecklist);
    }
    return null;
  }

  public getTaskScroll() {
    return this.taskScroll;
  }

  emitActiveQuestions(data) {
      this.activeChangeQuestions.emit(data);
  }

  emitVerifyChecklistAnswer(data) {
      this.verifyChecklistAnswer.emit(data);
  }

  emitActiveResultList(checklist: Checklist) {
      this.activeResultList.emit(checklist);
  }

  storagedFilter(filtered){
      if (filtered.name != undefined) {
          this.filterByText(filtered.name);
      }
  }
}
