import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from 'app/shared/models/user.model';
import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { Construction } from 'app/shared/models/construction.model';
import { SessionsService } from 'app/shared/services/sessions.service';

import * as _c from 'lodash/collection';
import * as _a from 'lodash/array';

@Component({
  selector: 'checklist-answers',
  templateUrl: 'checklist-answers.component.html',
  styleUrls: ['./checklist-answers.component.scss']
})

export class ChecklistAnswersComponent {

  @ViewChild('bodyContent') bodyContent: ElementRef;

  @Input() checklist: Checklist;
  @Input() taskScroll;
  @Input() construction: Construction;

  @Input() checklistAnswers: ChecklistAnswer[];

  @Output() activeChangeQuestions: EventEmitter<ChecklistAnswer> = new EventEmitter();
  @Output() verifyChecklistAnswer: EventEmitter<Checklist> = new EventEmitter();

  @Output() goBackChecklist: EventEmitter<Checklist> = new EventEmitter<Checklist>();
  @Output() hideFloatButton: EventEmitter<Checklist> = new EventEmitter<Checklist>();

  private currentUser: User;

  showSearch = false;
  showListDashboard = true;

  open = false;
  fixed = false;
  spin = true;
  direction = 'up';
  animationMode = 'fling';

  activeFilters = {
    text: '',
  };

  scrollChecklists = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sessionsService: SessionsService) {
    setTimeout(() => {
      this.hideFloatButton.emit();
    })
  }

  redirectTo(path) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  public getTaskScroll() {
    return this.taskScroll;
  }

  emitActiveQuestions(checklistAnswer: ChecklistAnswer) {
    this.activeChangeQuestions.emit(checklistAnswer);
  }

  emitVerifyChecklistAnswer(checklist: Checklist) {
    this.verifyChecklistAnswer.emit(checklist);
  }

  backChecklist(checklist: Checklist) {
    this.goBackChecklist.emit(this.checklist);
  }
}
