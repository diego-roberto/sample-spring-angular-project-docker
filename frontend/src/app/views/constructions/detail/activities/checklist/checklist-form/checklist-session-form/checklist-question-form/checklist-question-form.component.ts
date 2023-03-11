import { UtilValidators } from 'app/shared/util/validators.util';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MdSelectChange, MdRadioChange, MdCheckboxChange } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';

import { isNullOrUndefined } from 'util';

import { ChecklistQuestion } from 'app/shared/models/checklist-question.model';
import { ChecklistQuestionRule } from 'app/shared/models/checklist-question-rule.model';
import { ChecklistQuestionRuleType } from 'app/shared/models/checklist-question-rule-type.model';
import { PermissionService } from '../../../../../../../../shared/services/permission.service';

@Component({
  selector: 'checklist-question-form',
  templateUrl: './checklist-question-form.component.html',
  styleUrls: ['./checklist-question-form.component.scss']
})
export class ChecklistQuestionFormComponent implements OnInit, DoCheck {

  readonly questionRuleIdentifierList = [ 'SI1', 'SI2', 'SI3', 'SI4', 'MI1', 'MI2', 'MI3', 'MI4' ];

  @Input() required: boolean;
  @Input() checklistQuestion: ChecklistQuestion;
  @Input() checklistGeneratesActionPlan: boolean;
  @Output() addForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  checklistQuestionForm: FormGroup;
  questionRuleIdentifierSelected: string;

  questionTitleMaxLength = 500;
  questionHelpMaxLength = 500;
  questionBaseActionPlanMaxLength = 500;

  constructor(private formBuilder: FormBuilder,public permissionService:PermissionService) {
    this.checklistQuestionForm = this.formBuilder.group({
      questionTitle: new FormControl(undefined, [Validators.required]),
      questionHelp: new FormControl(undefined, []),
      questionRuleIdentifier: new FormControl(undefined, []),
    });
  }

  ngOnInit() {
    this.initializeQuestionRuleIdentifierSelected();
    this.addForm.emit(this.checklistQuestionForm);
  }

  ngDoCheck() {
    this.toggleQuestionBaseActionPlanFormControl();
  }

  toggleQuestionBaseActionPlanFormControl() {
    if (this.checklistGeneratesActionPlan) {
      this.checklistQuestionForm.addControl('questionBaseActionPlan', new FormControl(undefined, [Validators.required]));
    } else {
      this.checklistQuestionForm.removeControl('questionBaseActionPlan');
    }
  }

  initializeQuestionRuleIdentifierSelected() {
    const checklistQuestionRule: ChecklistQuestionRule = this.checklistQuestion.checklistQuestionRules.find((r: ChecklistQuestionRule) => r.rule === ChecklistQuestionRuleType.FAULT || r.rule === ChecklistQuestionRuleType.MORE_FISCALIZED);
    if (checklistQuestionRule) {
      this.questionRuleIdentifierSelected = this.questionRuleIdentifierList.find((questionRuleIdentifier: string) => questionRuleIdentifier === checklistQuestionRule.identifier);
    }
  }

  questionRuleIdentifierSelectionChangeHandler(event: MdSelectChange) {
    if (this.questionRuleIdentifierSelected) {
      if (this.hasQuestionRule(ChecklistQuestionRuleType.FAULT) === undefined) { this.doAddQuestionFault(); }
      this.checklistQuestion.checklistQuestionRules.forEach((checklistQuestionRule: ChecklistQuestionRule) => checklistQuestionRule.identifier = this.questionRuleIdentifierSelected);
    } else {
      this.removeQuestionRules([ ChecklistQuestionRuleType.FAULT, ChecklistQuestionRuleType.MORE_FISCALIZED ]);
    }
  }

  doAddQuestionFault() {
      const newRule: ChecklistQuestionRule = new ChecklistQuestionRule();
      newRule.identifier = this.questionRuleIdentifierSelected;
      newRule.rule = ChecklistQuestionRuleType.FAULT;
      this.checklistQuestion.checklistQuestionRules.push(newRule);
  }

  isEmbargoChecked(): boolean {
    return this.hasQuestionRule(ChecklistQuestionRuleType.EMBARGO) !== undefined;
  }

  embargoChangeHandler(event: MdCheckboxChange) {
    this.removeQuestionRules([ ChecklistQuestionRuleType.EMBARGO ]);

    if (event.checked) {
      const newRule: ChecklistQuestionRule = new ChecklistQuestionRule();
      newRule.identifier = this.questionRuleIdentifierSelected;
      newRule.rule = ChecklistQuestionRuleType.EMBARGO;
      this.checklistQuestion.checklistQuestionRules.push(newRule);
    }
  }

  isMoreFiscalizedChecked(): boolean {
    return this.hasQuestionRule(ChecklistQuestionRuleType.MORE_FISCALIZED) !== undefined;
  }

  moreFiscalizedChangeHandler(event: MdCheckboxChange) {
    this.removeQuestionRules([ ChecklistQuestionRuleType.MORE_FISCALIZED ]);

    if (event.checked) {
      const newRule: ChecklistQuestionRule = new ChecklistQuestionRule();
      newRule.identifier = this.questionRuleIdentifierSelected;
      newRule.rule = ChecklistQuestionRuleType.MORE_FISCALIZED;
      this.checklistQuestion.checklistQuestionRules.push(newRule);
    }
  }

  isQuestionFaultEnabled(): boolean {
    return ! isNullOrUndefined(this.questionRuleIdentifierSelected) && this.questionRuleIdentifierSelected !== '';
  }

  isMoreFiscalizedEnabled(): boolean {
    return ! isNullOrUndefined(this.questionRuleIdentifierSelected) && this.questionRuleIdentifierSelected !== '';
  }

  hasQuestionRule(questionRuleType: ChecklistQuestionRuleType) {
    return this.checklistQuestion.checklistQuestionRules.find((checklistQuestionRule: ChecklistQuestionRule) => checklistQuestionRule.rule === questionRuleType);
  }

  removeQuestionRules(questionRuleTypeList: ChecklistQuestionRuleType[]) {
    if (questionRuleTypeList) {
      questionRuleTypeList.forEach((questionRuleType: ChecklistQuestionRuleType) => {
        this.checklistQuestion.checklistQuestionRules = this.checklistQuestion.checklistQuestionRules.filter((checklistQuestionRule: ChecklistQuestionRule) => checklistQuestionRule.rule !== questionRuleType);
      });
    }
  }

}
