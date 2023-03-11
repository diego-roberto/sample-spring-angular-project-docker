import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter, ChangeDetectorRef, DoCheck } from '@angular/core';

import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';

import { ChecklistQuestionFormComponent } from 'app/views/constructions/detail/activities/checklist/checklist-form/checklist-session-form/checklist-question-form/checklist-question-form.component';

import { ChecklistSession } from 'app/shared/models/checklist-session.model';
import { ChecklistQuestion } from 'app/shared/models/checklist-question.model';

@Component({
  selector: 'checklist-session-form',
  templateUrl: './checklist-session-form.component.html',
  styleUrls: ['./checklist-session-form.component.scss']
})
export class ChecklistSessionFormComponent implements OnInit, DoCheck {

  @Input() required: boolean;
  @Input() checklistSession: ChecklistSession;
  @Input() checklistQuestionOnEdit: ChecklistQuestion;
  @Input() checklistGeneratesActionPlan: boolean;
  @Output() checklistQuestionOnEditChange = new EventEmitter<ChecklistQuestion>();
  @Output() addForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  checklistSessionForm: FormGroup;

  constructor(
    private confirmDialogHandler: ConfirmDialogHandler,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {
    this.checklistSessionForm = this.formBuilder.group({
      sessionTitle: new FormControl(null, [Validators.required]),
      checklistQuestionFormList: this.formBuilder.array([])
    });
  }

  ngOnInit() {

    this.checklistSessionForm.patchValue(
      {
        sessionTitle:  this.checklistSession.session
      }
    );
   
    this.addForm.emit(this.checklistSessionForm);
  }

  ngDoCheck(): void {
    this.checklistQuestionOnEditChange.emit(this.checklistQuestionOnEdit);
  }

  doAddNewQuestion() {
    const newLength = this.checklistSession.checklistQuestions.push(new ChecklistQuestion());
    this.setChecklistQuestionOnEdit(this.checklistSession.checklistQuestions[newLength - 1]);
  }

  doRemoveQuestion(event: any) {
    this.confirmDialogHandler.call('Excluir Questão', 'Esta ação irá excluir esta pergunta. Deseja continuar?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        const removedChecklistQuestionList = this.checklistSession.checklistQuestions.splice(event, 1);
        if (removedChecklistQuestionList.includes(this.checklistQuestionOnEdit)) {
          this.setChecklistQuestionOnEdit(this.checklistSession.checklistQuestions[event - 1]);
        }
        this.doRemoveChecklistQuestionForm(event);
      }
    });
  }

  doAddChecklistQuestionForm(event: FormGroup, index: any) {
    const checklistQuestionFormList = this.checklistSessionForm.get('checklistQuestionFormList') as FormArray;
    this.doRemoveChecklistQuestionForm(index);
    checklistQuestionFormList.insert(index, event);
  }

  doRemoveChecklistQuestionForm(index: any) {
    const checklistQuestionFormList = this.checklistSessionForm.get('checklistQuestionFormList') as FormArray;
    checklistQuestionFormList.removeAt(index);
  }

  checklistQuestionHeaderTitle(question: ChecklistQuestion, card: SafetyCardComponent): string {
    return 'Questão ' + (this.checklistSession.checklistQuestions.indexOf(question) + 1) + (question.title && card.isHidden ? ' - ' + question.title : '');
  }

  checklistQuestionRequired(): boolean {
    return ! (this.checklistSession.checklistQuestions && this.checklistSession.checklistQuestions.length > 1);
  }

  isChecklistQuestionOnEdit(checklistQuestion: ChecklistQuestion): boolean {
    return this.checklistQuestionOnEdit === checklistQuestion;
  }

  setChecklistQuestionOnEdit(checklistQuestion: ChecklistQuestion) {
    this.checklistQuestionOnEdit = checklistQuestion;
  }

}
