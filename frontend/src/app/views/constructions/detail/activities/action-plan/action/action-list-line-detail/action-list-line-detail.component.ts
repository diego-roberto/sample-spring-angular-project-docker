import { SessionsService } from './../../../../../../../shared/services/sessions.service';
import { MdSnackBar } from '@angular/material';
import { ActionPlanItemService } from './../../../../../../../shared/services/action-plan-item.service';
import { ActionPlanItem } from './../../../../../../../shared/models/action-plan-item.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'action-list-line-detail',
  templateUrl: './action-list-line-detail.component.html',
  styleUrls: ['./action-list-line-detail.component.scss']
})
export class ActionListLineDetailComponent implements OnInit {

  @Input() actionPlanItem: ActionPlanItem;
  @Output() openDialogEvent: EventEmitter<ActionPlanItem> = new EventEmitter();
  @Output() actionFinheshed: EventEmitter<ActionPlanItem> = new EventEmitter();

  constructor(private actionPlanItemService: ActionPlanItemService,
    private sessionsService: SessionsService,
    public snackBar: MdSnackBar) { }

  ngOnInit() { }


  finishedAction() {
    this.actionPlanItem.conclusionAt = new Date();
    this.actionPlanItem.status = 'completed';
    this.actionPlanItem.conclusionUser = this.sessionsService.getCurrent();
    this.actionPlanItemService.updateItem(this.actionPlanItem).subscribe(updateItem => {
      this.actionFinheshed.emit(Object.assign(this.actionPlanItem));
      this.snackBar.open('Ação Finalizada!', null, { duration: 3000 });
      error => {
        this.snackBar.open(error, null, { duration: 3000 });
      }
    });

  }

  openForm(actionPlanItem: ActionPlanItem) {
    this.openDialogEvent.emit(Object.assign(actionPlanItem));
  }

  isFinished(): boolean {
    return this.actionPlanItem.status !== 'completed';
  }

  getStatusName(): string {
    switch (this.actionPlanItem.status) {
      case 'completed':
        return 'CONCLUÍDA';
      case 'scheduled':
        return 'AGENDADA';
      case 'progress':
        return 'EM PROGRESSO';
      case 'delayed':
        return 'ATRASADA';
      default:
        return '';
    }

  }

}
