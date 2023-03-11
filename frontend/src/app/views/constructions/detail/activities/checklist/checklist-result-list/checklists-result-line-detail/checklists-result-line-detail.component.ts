import { UpdateActionPlanDialogService } from './../../../../_common/update-action-plan-dialog.service';
import { OnInit } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActionPlanService } from 'app/shared/services/action-plan.service';
import { ActionPlanItemService } from 'app/shared/services/action-plan-item.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { FilesService } from 'app/shared/services/files.service';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { ChecklistQuestionAnswerService } from 'app/shared/services/checklist-question-answer.service';

import { User } from 'app/shared/models/user.model';
import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { ChecklistQuestionAnswer } from 'app/shared/models/checklist-question-answer.model';

import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
    selector: 'checklists-result-line-detail',
    templateUrl: './checklists-result-line-detail.component.html',
    styleUrls: ['./checklists-result-line-detail.component.scss']
})
export class ChecklistsResultLineDetailComponent implements OnInit {

    @Input() checklist: Checklist;
    @Input() checklistAnswer: ChecklistAnswer;

    @Output() activeResultList: EventEmitter<Checklist> = new EventEmitter();

    generateActionPlanTooltip = 'Gerar Plano de Ação';

    checklistQuestionAnswers: ChecklistQuestionAnswer[] = [];

    currentUser: User;
    selectedOption: Checklist;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private sessionsService: SessionsService,
        private actionPlanService: ActionPlanService,
        private actionPlanItemService: ActionPlanItemService,
        private updateActionPlanDialogService: UpdateActionPlanDialogService,
        private filesService: FilesService,
        private appMessage: AppMessageService,
        private questionAnswerService: ChecklistQuestionAnswerService) { }

    ngOnInit(): void {
        this.currentUser = this.sessionsService.getCurrent();

        this.questionAnswerService.findByChecklistAnswer(this.checklistAnswer.id).subscribe(listQuestionAnswers => {
            this.checklistQuestionAnswers = listQuestionAnswers;
        });
    }

    redirectTo(route) {
        this.router.navigate([route], { relativeTo: this.route });
    }

    emitActiveResultList() {
        this.activeResultList.emit(this.checklist);
    }

    generateActionPlan() {
        this.actionPlanItemService.verifyToCompleteActions(this.checklistAnswer.id).subscribe(listActionPlanItem => {
            if (listActionPlanItem.length === 0) {
                this.executeGenerateActionPlan();
            } else {
                this.updateActionPlanDialogService.requestDialog(listActionPlanItem).subscribe(confirm => {
                    if (confirm) {
                        this.executeGenerateActionPlan();
                    };
                });
            }
        },
        error => {
            this.appMessage.errorHandle(error, 'Não foi possível verificar ações a serem concluídas! ');
        });
    }

    executeGenerateActionPlan() {
        this.actionPlanService.create(this.checklistAnswer.id, this.currentUser.id).subscribe(actionPlan => {
            this.appMessage.showSuccess('Plano de ação gerado com sucesso! ');
            this.checklistAnswer.idActionPlan = actionPlan.actionPlanId;
        },
        error => {
            this.appMessage.errorHandle(error, 'Não foi possível gerar o plano de ação! ');
        });
    }

    downloadChecklistResult() {
        this.filesService.downloadFile(this.checklistAnswer.fileInfo.id).subscribe((file: File) => {
            openNewTab(URL.createObjectURL(file));
        },
        error => {
            this.appMessage.showError('Erro no download do arquivo!');
        });
    }

    downloadMessage(): string {
        if (! this.isDownloadEnabled()) {
            return 'Arquivo indisponível';
        }
        return this.checklistAnswer.fileInfo.userFileName;
    }

    isDownloadEnabled(): boolean {
        return this.checklistAnswer.fileInfo !== undefined;
    }

    getGenerateActionPlanTooltip(): string {
        if (this.isGenerateActionPlanEnabled()) {
            return this.generateActionPlanTooltip;
        }

        return null;
    }

    isGenerateActionPlanEnabled(): boolean {
        let hasNonCompliance = false;

        this.checklistQuestionAnswers.forEach(questionAnswer => {
            if (questionAnswer.idAnswerPossible === 2 || questionAnswer.idAnswerPossible === 3) {
                hasNonCompliance = true;
            }
        });

        return (this.checklistAnswer.idActionPlan === undefined || this.checklistAnswer.idActionPlan === null) && this.checklistAnswer.isLastChecklistAnswer && this.checklist.generatesActionPlan && hasNonCompliance;
    }
}
