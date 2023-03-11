import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';

import { ActionPlanItemFormComponent } from 'app/views/constructions/detail/activities/action-plan/action/action-form/action-plan-item-form.component';
import { ActionListLineDetailComponent } from 'app/views/constructions/detail/activities/action-plan/action/action-list-line-detail/action-list-line-detail.component';

import { ActionPlanService } from 'app/shared/services/action-plan.service';
import { ActionPlanItemService } from 'app/shared/services/action-plan-item.service';
import { ActionPlanDialogService } from 'app/views/constructions/detail/activities/action-plan/service/action-plan-dialog.service';

import { ActionPlanDTO } from 'app/shared/models/action-plan.dto-model';
import { ActionPlanItem } from 'app/shared/models/action-plan-item.model';

@Component({
  selector: 'action-basic',
  templateUrl: './action-basic.component.html',
  styleUrls: ['./action-basic.component.scss']
})
export class ActionBasiComponent implements OnInit {

  @Input() actionPlan: ActionPlanDTO;
  @Output() updateLine: EventEmitter<number> = new EventEmitter();
  @Output() goBackToList: EventEmitter<void> = new EventEmitter<void>();
  listActions: Array<ActionPlanItem>;
  state = 'loading';

  @ViewChild('actionForm') actionForm: ActionPlanItemFormComponent;
  @ViewChild('actionLine') actionLine: ActionListLineDetailComponent;
  constructor(public dialog: MdDialog,
    private actionPlanService: ActionPlanService,
    private actionPlanItemService: ActionPlanItemService,
    private actionPlanDialogService: ActionPlanDialogService,
    public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.loadActionPlanItem();
  }

  private loadActionPlanItem() {
    this.actionPlanItemService.getList(this.actionPlan.idPlan).subscribe(actionPlanItems => {
        this.listActions = actionPlanItems;
        this.state = 'loaded';
    },
    error => {
        this.state = 'loaded';
        this.snackBar.open(error, null, { duration: 3000 });
    });
  }

  isLoadingActive(): boolean {
    return this.state === 'loading';
  }

  ispending(actionPlanItem: ActionPlanItem) {
    return actionPlanItem.status === 'pending';
  }

  onSaveItem(actionPlanItem: ActionPlanItem) {
    this.actionPlanItemService.updateItem(actionPlanItem).subscribe(updateItem => {
      this.snackBar.open('Ação Atualizada!', null, { duration: 3000 });
      this.loadActionPlanItem();
      this.actionFinheshed(actionPlanItem);
    },
    error => {
        this.snackBar.open(error, null, { duration: 3000 });
    });

  }

  openForm(actionPlanItem: ActionPlanItem) {
    this.actionPlanDialogService.openActionPlanItemForm(actionPlanItem).subscribe(itemUpdate => {
      this.actionPlanItemService.updateItem(itemUpdate).subscribe(item => {
        this.listActions.splice(this.listActions.findIndex(it => it.id === itemUpdate.id), 1, itemUpdate);
        this.updateLine.emit(actionPlanItem.idActionPlan);
        this.loadActionPlanItem();
      });

    });

  }

  actionFinheshed(actionPlanItem: ActionPlanItem) {
    this.doUpdateStatusInfo();
  }

  doGoBackToList() {
    this.goBackToList.emit();
  }

  doUpdateStatusInfo() {
    this.actionPlanService.retrieveId(this.actionPlan.idPlan).subscribe(response => {
      const itemUpdate = response[0];

      this.actionPlan.qtdeStatus01 = Number(itemUpdate.qtdeStatus01);
      this.actionPlan.qtdeStatus02 = Number(itemUpdate.qtdeStatus02);
      this.actionPlan.qtdeStatus03 = Number(itemUpdate.qtdeStatus03);
      this.actionPlan.qtdeStatus04 = Number(itemUpdate.qtdeStatus04);
      this.actionPlan.qtdeStatus05 = Number(itemUpdate.qtdeStatus05);
    });
  }

}
