import { ChecklistQuestionAnswer } from 'app/shared/models/checklist-question-answer.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { ChecklistQuestion } from 'app/shared/models/checklist-question.model';
import { ChecklistPossibleAnswers } from 'app/shared/models/checklist-possible-answers.model';
import { FileInfo } from 'app/shared/models/file-info.model';

@Component({
  selector: 'checklist-section-question',
  templateUrl: './checklist-section-question.component.html',
  styleUrls: ['./checklist-section-question.component.scss']
})
export class ChecklistSectionQuestionComponent implements OnInit {

  hasAnswered = false;

  @Input() questionIndexes: Map<number, number>;
  @Input() question: ChecklistQuestion;
  @Input() checklistPossibleAnswers: ChecklistPossibleAnswers[];
  @Input() checklistAnswer: ChecklistAnswer;

  @Output() hasAnsweredSectionQuestion: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() hasChanged: EventEmitter<void> = new EventEmitter<void>();

  checklistQuestionAnswer: ChecklistQuestionAnswer = new ChecklistQuestionAnswer();

  constructor() { }

  ngOnInit() {
    for (let item of this.checklistAnswer.checklistQuestionAnswers) {
      if (item.idQuestion === this.question.id) {
        this.checklistQuestionAnswer = item;
        this.hasAnswered = item.questionAnswered;
        break;
      }
    }
  }

  answerQuestion(value: number) {
    if (value) {
      if (!this.hasAnswered) {
        this.hasAnsweredSectionQuestion.emit(true);
      }

      this.hasAnswered = true;
      this.hasChanged.emit();
    }
  }

  emitAttachmentValue(fileInfo: FileInfo) {
    const newAnswer = this.checklistQuestionAnswer;
    newAnswer.attachmentFiles.push(fileInfo);
  }
}
