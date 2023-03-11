import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ChecklistPossibleAnswers } from 'app/shared/models/checklist-possible-answers.model';
import { ChecklistQuestionAnswer } from 'app/shared/models/checklist-question-answer.model';

@Component({
  selector: 'checklist-possible-answer',
  templateUrl: './checklist-possible-answer.component.html',
  styleUrls: ['./checklist-possible-answer.component.scss']
})
export class ChecklistPossibleAnswerComponent implements OnInit {

  @Input() checklistPossibleAnswers: ChecklistPossibleAnswers[];
  @Input() answers: ChecklistQuestionAnswer;

  @Output() sendAnswerValue: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    if (!this.answers.questionAnswered) {
      this.answers.idAnswerPossible = 0;
    }
  }

  emitAnswerValue(value) {
    if ((value === 4 || value === 0) && this.answers.questionAnswered === false) {
      this.answers.questionAnswered = false;
    } else {
      this.answers.questionAnswered = true;
    }
    this.sendAnswerValue.emit(value);
  }

}
