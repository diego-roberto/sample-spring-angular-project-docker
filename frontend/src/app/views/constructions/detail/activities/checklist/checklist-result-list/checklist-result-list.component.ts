import { DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _c from 'lodash/collection';
import * as _a from 'lodash/array';

import { User } from 'app/shared/models/user.model';
import { Checklist } from 'app/shared/models/checklist.model';

import { SessionsService } from 'app/shared/services/sessions.service';
import { ChecklistAnswerService } from 'app/shared/services/checklist-answer.service';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { Construction } from 'app/shared/models/construction.model';

@Component({
  selector: 'checklist-result-list',
  templateUrl: 'checklist-result-list.component.html',
  styleUrls: ['./checklist-result-list.component.scss']
})

export class ChecklistResultListComponent implements OnInit {
  @ViewChild('bodyContent') bodyContent: ElementRef;

  @Input() checklistsFilteredList: Checklist[];
  @Input() checklistsList: Checklist[];
  @Input() taskScroll;
  @Input() construction: Construction;
  @Input() checklist: Checklist;

  @Output() activeChangeQuestions: EventEmitter<Checklist> = new EventEmitter();
  @Output() verifyChecklistAnswer: EventEmitter<Checklist> = new EventEmitter();

  @Output() activeResultList: EventEmitter<Checklist> = new EventEmitter();
  @Output() hideFloatButton: EventEmitter<Checklist> = new EventEmitter();

  checklistAnswers: ChecklistAnswer[];
  checklistAnswersFiltered: ChecklistAnswer[];
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

  loadingQueue: Set<string>;

  scrollChecklists = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sessionsService: SessionsService,
    private checklistAnswerService: ChecklistAnswerService,
    private datepipe: DatePipe,
    private appMessage: AppMessageService) {
    this.loadingQueue = new Set<string>();
  }

  ngOnInit(): void {
    this.hideFloatButton.emit();
    this.getChecklistAnswers(this.checklist);
  }

  getChecklistAnswers(checklist: Checklist): any {
    this.addToLoadingQueue('getChecklistAnswers');
    this.checklistAnswerService.getAccomplishedChecklistAnswerByChecklistId(this.construction.id, this.checklist.id).subscribe((checklistAnswers: ChecklistAnswer[]) => {
      this.checklistAnswersFiltered = checklistAnswers;
      this.checklistAnswers = checklistAnswers;
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível carregar o histórico do checklist ');
      },
      () => {
        this.removeFromLoadingQueue('getChecklistAnswers');
      });
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

  filterByText() {
    this.activeFilters.text = this.searchValue.trim();
    this.filterListChecklists();
  }

  filterListChecklists() {
    if (!this.activeFilters.text || this.activeFilters.text === '') {
      this.checklistAnswersFiltered = this.checklistAnswers;
    } else {
      this.checklistAnswersFiltered = this.checklistAnswers
        .filter(checklistAnswer =>
          this.datepipe.transform(checklistAnswer.endAnswer, 'dd/MM/yyyy HH:mm')
            .includes(this.activeFilters.text.toLowerCase()) ||
          checklistAnswer.user.name.toLowerCase()
            .includes(this.activeFilters.text.toLowerCase())
        );
    }
  }

  order(sort: { field, order }) {
    this.checklistAnswers = _c.orderBy(this.checklistAnswers, ['checklist.name', sort.field], ['asc', sort.order]);
    this.checklistAnswersFiltered = _c.orderBy(this.checklistAnswersFiltered, ['checklist.name', sort.field], ['asc', sort.order]);
  }

  lastIndex(checklist: Checklist) {
    const index = _a.findIndex(this.checklistsFilteredList, ['name', checklist.name]);

    if (checklist === this.checklistsFilteredList[index]) {
      return true;
    }
    return false;
  }

  public getTaskScroll() {
    return this.taskScroll;
  }

  addToLoadingQueue(key: string) {
    this.loadingQueue.add(key);
  }

  removeFromLoadingQueue(key: string) {
    this.loadingQueue.delete(key);
  }

  isLoadingActive(): boolean {
    return this.loadingQueue.size !== 0;
  }

  emitActiveQuestions(checklist: Checklist) {
    this.activeChangeQuestions.emit(checklist);
  }

  emitVerifyChecklistAnswer(checklist: Checklist) {
    this.verifyChecklistAnswer.emit(checklist);
  }

  emitActiveResultList(checklist: Checklist) {
    this.activeResultList.emit(checklist);
  }
}
