import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistAnswer } from 'app/shared/models/checklist-answer.model';
import { User } from 'app/shared/models/user.model';
import { SessionsService } from 'app/shared/services/sessions.service';
import { PermissionService } from '../../../../../../../shared/services/permission.service';
import { Construction } from 'app/shared/models/construction.model';
import { ChecklistService } from '../../../../../../../shared/services/checklist.service';
import { getChecklistSavedOnWeb } from 'app/shared/util/localStorage';

@Component({
  selector: 'checklist-line-answer',
  templateUrl: './checklist-line-answer.component.html',
  styleUrls: ['./checklist-line-answer.component.scss'],
})
export class ChecklistLineAnswerComponent implements OnInit {

  @Input() checklist: Checklist;
  @Input() checklistAnswer: ChecklistAnswer;
  @Input() construction: Construction;

  @Output() verifyChecklist: EventEmitter<Checklist> = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() activeQuestions: EventEmitter<ChecklistAnswer> = new EventEmitter();
  @Output() activeResultList: EventEmitter<Checklist> = new EventEmitter();

  hasAppPendingChecklistQuestions: boolean = false;
  loading: boolean = true;

  selectedOption: Checklist;
  currentUser: User;

  constructor(private router: Router,
    private sessionsService: SessionsService,
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    private checklistService: ChecklistService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.sessionsService.getCurrent();
    this.verifyChecklistPending();
  }

  redirectTo(route) {
    this.router.navigate([route], { relativeTo: this.route });
  }

  emitActiveQuestions($event) {
    this.activeQuestions.emit(this.checklistAnswer);
  }

  verifyChecklistPending() {
    this.checklistService.hasPendingChecklistQuestions(this.checklistAnswer.id)
      .subscribe(response => {
        this.hasAppPendingChecklistQuestions = response;
        this.loading = false;

        const wasSavedOnWeb = getChecklistSavedOnWeb(
          this.sessionsService.getCurrentCompany().companyId,
          this.sessionsService.getCurrentConstruction(),
          this.checklistAnswer.id
        );

        if (wasSavedOnWeb) {
          this.hasAppPendingChecklistQuestions = false;
        }
      });
  }
}
