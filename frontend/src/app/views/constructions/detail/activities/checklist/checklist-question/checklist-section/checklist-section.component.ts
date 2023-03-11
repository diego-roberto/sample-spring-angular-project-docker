import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ChecklistSession } from 'app/shared/models/checklist-session.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { ChecklistPossibleAnswers } from 'app/shared/models/checklist-possible-answers.model';
import { MdDialog } from '@angular/material';
import { ChecklistQuestion } from 'app/shared/models/checklist-question.model';

@Component({
  selector: 'checklist-section',
  templateUrl: './checklist-section.component.html',
  styleUrls: ['./checklist-section.component.scss']
})

export class ChecklistSectionComponent implements OnInit {

  hasAnswered = false;
  showSection = false;
  isChecked = false;

  @Input() questionIndexes: Map<number, number>;
  @Input() section: ChecklistSession;
  @Input() checklistPossibleAnswers: ChecklistPossibleAnswers[];
  @Input() checklistAnswer: ChecklistAnswer;

  @Output() sendAnswerValueChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() sendIfHasAnswerd: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sendIfHasChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor(public dialog: MdDialog) { }

  ngOnInit() {
    // this.seeIfHasAnswer();
  }

  answerQuestion(value: number, question: ChecklistQuestion, section) {
     let newAnswer;
     for (let item of this.checklistAnswer.checklistQuestionAnswers) {
        if (item.idQuestion === question.id) {
           newAnswer = item;
           break;
        }
    }
    newAnswer.observation = null;
    newAnswer.idAnswerPossible = value;
    newAnswer.questionAnswered = section;
  }

  hasAnsweredQuestion(value: boolean) {
    this.sendIfHasAnswerd.emit(value);
  }

  hasChangedAnswer() {
    this.sendIfHasChanged.emit();
  }

  toggle() {
    const checklistPossibleAnswer = this.checklistPossibleAnswers.filter(cPossibleAnswer => cPossibleAnswer.answer === 'NÃO SE APLICA');

    if (this.isChecked) {
        this.clearAnswerCount();
    }

    this.section.checklistQuestions.forEach((checklistQuestion) => {
      this.answerQuestion(checklistPossibleAnswer[0].id, checklistQuestion, this.showSection);
      this.hasAnsweredQuestion(this.isChecked);
    });
  }

  seeIfHasAnswer() {
    for (const question of this.checklistAnswer.checklistQuestionAnswers) {
      if (question.questionAnswered) {
        this.hasAnsweredQuestion(true);
        break;
      }
    }
  }

  private clearAnswerCount() {
    this.section.checklistQuestions.forEach((checklistQuestion) => {
    for (let item of this.checklistAnswer.checklistQuestionAnswers){
        if (item.idQuestion === checklistQuestion.id) {
          if (item.questionAnswered) {
            this.hasAnsweredQuestion(false);
          }
        }
     }
    });
  }

  changeToogle() {
    this.showSection = !this.showSection;
    this.isChecked = this.showSection;
    this.toggle();
  }
}
