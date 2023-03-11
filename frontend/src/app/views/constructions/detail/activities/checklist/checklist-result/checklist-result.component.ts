import { ChecklistAnswerService } from './../../../../../../shared/services/checklist-answer.service';
import { ActionPlanService } from './../../../../../../shared/services/action-plan.service';
import { ActionPlanItemService } from './../../../../../../shared/services/action-plan-item.service';
import { SessionsService } from './../../../../../../shared/services/sessions.service';
import { User } from './../../../../../../shared/models/user.model';
import { Checklist } from './../../../../../../shared/models/checklist.model';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { ChecklistResultReport } from './../../../../../../shared/util/json/checklist-result-report';
import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { Construction } from 'app/shared/models/construction.model';
import { ChecklistSession } from 'app/shared/models/checklist-session.model';
import { ChecklistPossibleAnswers } from 'app/shared/models/checklist-possible-answers.model';
import { ChecklistQuestionAnswer } from 'app/shared/models/checklist-question-answer.model';
import { ChecklistInfo } from 'app/shared/models/checklist-info';
import { ChecklistGeneralInfo } from 'app/shared/models/checklist-general-info';
import { ChecklistConstructionInfo } from 'app/shared/models/checklist-construction-info';

import { ChecklistResultService } from 'app/shared/services/checklist-result.service';
import { AppMessageService } from 'app/shared/util/app-message.service';

import { ChecklistQuestionsAnswersCount } from 'app/shared/util/json/checklist-questions-answers-count';
import { ChecklistQuestionAnswersSessionsCount } from 'app/shared/util/json/checklist-question-answers-sessions-count';
import { ChecklistPenalty } from 'app/shared/util/json/checklist-penalty';

import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { FilesService } from 'app/shared/services/files.service';
import { UpdateActionPlanDialogService } from 'app/views/constructions/detail/_common/update-action-plan-dialog.service';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { ChecklistQuestionAnswerService } from 'app/shared/services/checklist-question-answer.service';
import { EnumPermission } from 'app/shared/models/permission/enum-permission';
import { InfoDialogHandler } from 'app/shared/util/generic/info-dialog/info-dialog.handler';

import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'checklist-result',
  templateUrl: './checklist-result.component.html',
  styleUrls: ['./checklist-result.component.scss']
})
export class ChecklistResultComponent implements OnInit {

  @ViewChild('checklistResultCard') checklistResultCard: SafetyCardComponent;

  @Input()
  set checklistPenalty(checklistPenalty: ChecklistPenalty) { this._checklistPenalty = checklistPenalty; }
  get checklistPenalty(): ChecklistPenalty { return this._checklistPenalty; }
  @Input()
  set savedAnswer(savedAnswer: ChecklistAnswer) { this._savedAnswer = savedAnswer; }
  get savedAnswer(): ChecklistAnswer { return this._savedAnswer; }
  @Input()
  set answersCount(answersCount: ChecklistQuestionsAnswersCount) { this._answersCount = answersCount; }
  get answersCount() { return this._answersCount; }
  @Input()
  set answersSessionsCount(answersSessionsCount: ChecklistQuestionAnswersSessionsCount[]) { this._answersSessionsCount = answersSessionsCount; }
  get answersSessionsCount() { return this._answersSessionsCount; }
  @Input()
  set resultSessions(resultSessions: ChecklistSession[]) { this._resultSessions = resultSessions; }
  get resultSessions(): ChecklistSession[] { return this._resultSessions; }
  @Input() construction: Construction;
  @Input() checklistPossibleAnswers: ChecklistPossibleAnswers[];
  @Input() checklist: Checklist;
  @Input() lastChecklistAnswer: ChecklistAnswer;

  @Output() goBackToChecklistQuestions: EventEmitter<any> = new EventEmitter<any>();
  @Output() backScroll: EventEmitter<any> = new EventEmitter<any>();
  @Output() returnToList: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideFloatButton: EventEmitter<any> = new EventEmitter<any>();


  _answersSessionsCount: ChecklistQuestionAnswersSessionsCount[];
  _answersCount: ChecklistQuestionsAnswersCount;
  _savedAnswer: ChecklistAnswer;
  _resultSessions: ChecklistSession[];
  _checklistPenalty: ChecklistPenalty;
  currentUser: User;

  msgPrintChecklist = 'Após imprimir não será possível editar o checklist.';

  step = 0;
  onPrinting: boolean;
  onLoading: boolean;

  checklistInfos: ChecklistInfo;

  checklistQuestionAnswers: ChecklistQuestionAnswer[] = [];

  generateActionPlanButtonLabel = 'Gerar Plano de Ação';

  constructor(private checklistResultService: ChecklistResultService,
    private sessionsService: SessionsService,
    private actionPlanService: ActionPlanService,
    private actionPlanItemService: ActionPlanItemService,
    private updateActionPlanDialogService: UpdateActionPlanDialogService,
    private filesService: FilesService,
    private checklistAnswerService: ChecklistAnswerService,
    public confirmDialogHandler: ConfirmDialogHandler,
    private appMessage: AppMessageService,
    public permissionService: PermissionService,
    private questionAnswerService: ChecklistQuestionAnswerService,
    private infoDialogHandler: InfoDialogHandler
  ) { }

  ngOnInit() {
    this.onPrinting = false;

    this.onLoading = true;

    this.currentUser = this.sessionsService.getCurrent();

    this.checklistInfos = new ChecklistInfo().initializeWithJSON({});

    let addressTemp = '';
    addressTemp = this.concatTextClean(addressTemp, this.construction.addressStreet, ' ');
    addressTemp = this.concatTextClean(addressTemp, this.construction.addressNumber, ' - Nº ');
    addressTemp = this.concatTextClean(addressTemp, this.construction.addressComplement, ' / ');

    this.checklistInfos.constructionInfo = new ChecklistConstructionInfo().initializeWithJSON({
      name: this.construction.name,
      cei: this.construction.ceiCode,
      address: addressTemp,
      contact: this.construction.responsibleEngineer ? this.construction.responsibleEngineer.name : '',
      phone: this.construction.responsibleEngineer ? this.construction.responsibleEngineer.phone : '',
      email: this.construction.responsibleEngineer ? this.construction.responsibleEngineer.email : '',
      numWorks: this.savedAnswer.numberWorkers
    });

    this.questionAnswerService.findByChecklistAnswer(this.savedAnswer.id).subscribe(listQuestionAnswers => {
      this.checklistQuestionAnswers = listQuestionAnswers;
    });

    this.actionPlanItemService.verifyToCompleteActions(this.savedAnswer.id).subscribe(listActionPlanItem => {
      if (listActionPlanItem.length !== 0) {
        this.generateActionPlanButtonLabel = 'Atualizar Plano de Ação';
      }
    });
  }

  private concatTextClean(obj01, obj02, separator: string): string {
    const txt01 = this.nullableClean(obj01);
    const txt02 = this.nullableClean(obj02);

    if (txt01.trim() === '' || txt02.trim() === '') {
      return txt01.trim() + txt02.trim();
    }

    return (txt01.trim() + separator + txt02.trim()).trim();
  }

  private nullableClean(obj): string {
    if (obj && obj != null) {
      return ('' + obj).trim();
    }
    return '';
  }

  nextStep() {
    this.backScroll.emit();
    this.step++;
  }

  previousStep() {
    if (this.step > 0) {
      this.backScroll.emit();
      this.step--;
    } else {
      this.goBackToChecklistQuestions.emit();
    }
  }

  private imprimir(origin: number) {

    this.onPrinting = true;
    const checklistResultReport: ChecklistResultReport = new ChecklistResultReport();
    checklistResultReport.checklistQuestionsAnswersCount = this.answersCount;
    checklistResultReport.answerSessions = this.answersSessionsCount;
    checklistResultReport.checklistSessions = this.resultSessions;
    checklistResultReport.checklistPenalty = this.checklistPenalty;
    checklistResultReport.checklistInfo = this.checklistInfos;
    checklistResultReport.savedAnswer = this.savedAnswer;
    checklistResultReport.checklist = this.checklist;

    checklistResultReport.checklistPossibleAnswers = this.checklistPossibleAnswers;
    this.checklistResultService.printChecklistQuestionReport(checklistResultReport).subscribe(
      async response => {
        <ChecklistAnswer>await this.uploadChecklistResultFile(response);
        if (!this.savedAnswer.endAnswer) { this.savedAnswer.endAnswer = new Date(); };
        <ChecklistAnswer>await this.saveChecklistAnswer(this.savedAnswer);

        if (origin === 2) {
          this.generateActionPlan();
        }
        
        openNewTab(URL.createObjectURL(response));
  
        this.returnToList.emit();
      },
      error => {
        this.onPrinting = false;
        this.appMessage.showError('Não foi possível gerar o relatório, tente novamente mais tarde.');
      }, () => {
        this.onPrinting = false;
      });
  }

  generateActionPlan() {
    this.actionPlanService.create(this.savedAnswer.id, this.currentUser.id).subscribe(actionPlan => {
      this.appMessage.showSuccess('Plano de ação gerado com sucesso! ');
    },
      error => {
        this.appMessage.showError('Não foi possível gerar o plano de ação! ');
      });
  }

  generateActionPlanConfirmation() {
    this.actionPlanItemService.verifyToCompleteActions(this.savedAnswer.id).subscribe(listActionPlanItem => {
      if (listActionPlanItem.length === 0) {
        let hasNonCompliance = false;

        this.checklistQuestionAnswers.forEach(questionAnswer => {
          if (questionAnswer.idAnswerPossible === 2 || questionAnswer.idAnswerPossible === 3) {
            hasNonCompliance = true;
          }
        });

        if (hasNonCompliance) {
          this.confirmDialogHandler.call('Gerar plano de ação', this.msgPrintChecklist, { trueValue: 'Imprimir', falseValue: 'Fechar' }).subscribe((confirm) => {
            if (confirm) {
              this.imprimir(2);
            }
          });
        } else {
          this.infoDialogHandler.call('Plano de Ação', 'Não foram encontradas irregularidades, não é possível gerar plano de ação.');
        }
      } else {
        this.updateActionPlanDialogService.requestDialog(listActionPlanItem, 2).subscribe(confirm => {
          if (confirm) {
            this.imprimir(2);
          };
        });
      }
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível verificar ações a serem concluídas! ');
      });
  }

  printConfirmation() {
    this.confirmDialogHandler.call('IMPRIMIR', this.msgPrintChecklist, { trueValue: 'Imprimir', falseValue: 'Fechar' }).subscribe((confirm) => {
      if (confirm) {
        this.imprimir(1);
      }
    });
  }

  uploadChecklistResultFile(file: File): Promise<ChecklistAnswer> {
    return new Promise<ChecklistAnswer>((resolve, reject) => {
      this.filesService.uploadFile('checklist_result', file).subscribe(savedFile => {
        this._savedAnswer.fileInfo = savedFile;
        resolve(this._savedAnswer);
      },
        error => {
          this.appMessage.errorHandle(error, 'Erro no upload do arquivo! ');
        });
    });
  }

  saveChecklistAnswer(checklistAnswer: ChecklistAnswer): Promise<ChecklistAnswer> {
    return new Promise<ChecklistAnswer>((resolve, reject) => {
      this.checklistAnswerService.saveChecklistAnswer(checklistAnswer).subscribe(
        savedAnswer => { resolve(savedAnswer); },
        error => { this.appMessage.errorHandle(error, 'Erro ao salvar resposta! '); }
      );
    });
  }

  previousStepEnabled(): boolean {
    return this.onPrinting || this.savedAnswer.endAnswer !== undefined;
  }

  isGenerateActionPlanEnabled() {
    return (this.step === 4 && this.permissionService.hasSomePermission([EnumPermission.CONSTRUCTION_ACTIVITIES_CHECKLIST_GENERATE_ACTION_PLAN]) && this.checklist.generatesActionPlan);
  }

}
