import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { ChecklistQuestion } from 'app/shared/models/checklist-question.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistPossibleAnswers } from 'app/shared/models/checklist-possible-answers.model';
import { ChecklistService } from 'app/shared/services/checklist.service';

import * as _c from 'lodash/collection';
import { MaskUtil } from 'app/shared/util/mask.util';

@Component({
  selector: 'checklist-question',
  templateUrl: './checklist-question.component.html',
  styleUrls: ['./checklist-question.component.scss']
})
export class ChecklistQuestionComponent implements OnInit, OnDestroy {

  _checklistAnswer: ChecklistAnswer;
  @Input() set checklistAnswer(checklistAnswer: ChecklistAnswer) {
    this._checklistAnswer = checklistAnswer;
  }
  get checklistAnswer(): ChecklistAnswer {
    return this._checklistAnswer;
  }

  _checklist: Checklist;
  @Input() set checklist(checklist: Checklist) { this._checklist = checklist; };
  get checklist(): Checklist { return this._checklist; };
  @Input() checklistQuestions: ChecklistQuestion[];
  @Input() checklistPossibleAnswers: ChecklistPossibleAnswers[];
  @Input() userId: number;
  @Input() constructionId: number;
  @Input('editable') editable: boolean;

  @Output() goBackChecklist: EventEmitter<ChecklistAnswer> = new EventEmitter<ChecklistAnswer>();
  @Output() goVisualizeResult: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideFloatButton: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeEditable: EventEmitter<any> = new EventEmitter<any>();

  supportedFileTypes: Array<string> = ['image/png', 'image/jpeg'];
  enable = false;
  hasAnswered = false;
  questionIndexes: Map<number, number> = new Map<number, number>();
  count = 0;
  hasChanged = false;
  subscription: Subscription;
  goingBack = false;
  number = MaskUtil.variableLengthMask(MaskUtil.NUMBER, 10);

  constructor(
    private checklistService: ChecklistService,
    private location: Location) { }

  ngOnInit() {
    this.checklistAnswer.checklistQuestionAnswers = _c.orderBy(this.checklistAnswer.checklistQuestionAnswers, ['idQuestion']);
    this.subscription = <Subscription>this.location.subscribe(() => {
      if (this.hasChanged && !this.goingBack) {
        if (window.confirm('Deseja salvar para continuar depois?')) {
          this.continueLaterChecklist();
        }
        this.goingBack = true;
      }
    });

    this.enableSection();

    this.questionIndexes = this.checklistService.getChecklistIndexes(this.checklist.checklistSessions);

    this.checklist.checklistSessions.forEach((item) => {
      this.count += item.checklistQuestions.length;
    });

    for (const answer of this.checklistAnswer.checklistQuestionAnswers) {
      if (answer.questionAnswered) {
        this.setHasAnswered(true);
      }
    }

    this.hideFloatButton.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  continueLaterChecklist() {
    this.goBackChecklist.emit(this.checklistAnswer);
  }

  goBack() {
    if (window.confirm('Deseja mesmo sair da tela de preenchimento? Dados não salvos serão descartados.')) {
      window.location.reload();
    }
  }

  visualizeResult() {
    this.goVisualizeResult.emit(this.checklistAnswer);
  }

  enableSection() {
    this.enable = (this.checklistAnswer.numberWorkers && this.checklistAnswer.numberWorkers > 0);
  }

  setHasAnswered(value: boolean) {
    if (value) {
      this.count--;
    } else {
      this.count++;
    }
    this.hasAnswered = this.count === 0;
  }

  setHasChanged() {
    this.hasChanged = true;
  }
}
