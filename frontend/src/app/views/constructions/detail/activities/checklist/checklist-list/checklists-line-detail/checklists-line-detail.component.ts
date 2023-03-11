import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { User } from 'app/shared/models/user.model';
import { SessionsService } from 'app/shared/services/sessions.service';
import { PermissionService } from '../../../../../../../shared/services/permission.service';
import { ChecklistAnswerService } from 'app/shared/services/checklist-answer.service';
import { Construction } from 'app/shared/models/construction.model';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { EnumPermission } from 'app/shared/models/permission/enum-permission';
import { ChecklistService } from '../../../../../../../shared/services/checklist.service';

@Component({
  selector: 'checklists-line-detail',
  templateUrl: './checklists-line-detail.component.html',
  styleUrls: ['./checklists-line-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChecklistsLineDetailComponent implements OnInit {

  @Input() checklist: Checklist;
  @Input() lastChecklistAnswer: ChecklistAnswer;

  @Output() verifyChecklist: EventEmitter<any> = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() activeQuestions: EventEmitter<any> = new EventEmitter();
  @Output() activeResultList: EventEmitter<Checklist> = new EventEmitter();

  activeQuestionLoading = false;
  loading = false;

  selectedOption: Checklist;
  currentUser: User;

  constructor(private router: Router,
    private sessionsService: SessionsService,
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    private checklistAnswerService: ChecklistAnswerService,
    private checklistService: ChecklistService,
    private appMessage: AppMessageService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.sessionsService.getCurrent();
  }

  redirectTo(route) {
    this.router.navigate([route], { relativeTo: this.route });
  }

  removeMyself() {
    this.removed.emit(this);
  }

  emitActiveQuestions() {
    this.activeQuestionLoading = true;

    this.activeQuestions.emit({checklistSelected: this.checklist, cb: () => {
      this.activeQuestionLoading = false;
    }});
  }

  emitVerifyChecklist() {
    this.loading = true;

    this.verifyChecklist.emit({checklistSelected: this.checklist, cb: () => {
      this.loading = false;
    }});
  }

  emitActiveResultList() {
    this.activeResultList.emit(this.checklist);
  }

  emitEditChecklist() {
    this.redirectTo('./' + this.checklist.id + '/edit');
  }

  hasEditPermission(): boolean {
    if (this.checklist.sesiBelongs) {
      return this.permissionService.hasSomePermission([EnumPermission.CONSTRUCTION_ACTIVITIES_CHECKLIST_SESI_EDIT]);
    } else {
      return this.permissionService.hasSomePermission([EnumPermission.CONSTRUCTION_ACTIVITIES_CHECKLIST_EDIT]);
    }
  }

  getCheckpoint(checklist: Checklist): any {

    if (checklist.status && checklist.status.id === 4) {
      const inativo = { text: 'inativo', class: 'checkpoint-inativo' };
      return inativo;
    }

    if (checklist.id && checklist.fatherId) {
      if (checklist.id === checklist.fatherId && !checklist.hasAnswer && checklist.status.id === 3) {
        const novo = { text: 'novo', class: 'checkpoint-novo' };
        return novo;
      }

      if (checklist.id !== checklist.fatherId && !checklist.hasAnswer) {
        const atualizado = { text: 'atualizado', class: 'checkpoint-atualizado' };
        return atualizado;
      }
    }

    return null;
  }

  replicate(): any {

    this.redirectTo('./' + this.checklist.id + '/replicate');
  }

}
