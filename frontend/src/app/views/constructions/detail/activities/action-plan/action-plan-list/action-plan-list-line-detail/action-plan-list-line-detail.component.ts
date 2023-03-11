import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { ActionPlanService } from 'app/shared/services/action-plan.service';
import { ActionPlanReportService } from 'app/shared/services/action-plan-report.service';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';

import { ActionPlanDTO } from 'app/shared/models/action-plan.dto-model';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'action-plan-list-line-detail',
  templateUrl: './action-plan-list-line-detail.component.html',
  styleUrls: ['./action-plan-list-line-detail.component.scss']
})
export class ActionPlanListLineDetailComponent implements OnInit {

  @Input() actionPlan: ActionPlanDTO;
  @Output() inactivateActionPlanEvent: EventEmitter<ActionPlanDTO> = new EventEmitter<ActionPlanDTO>();
  @Output() openActionPlan: EventEmitter<void> = new EventEmitter<void>();

  public onPrinting: Boolean = false;

  constructor(
    private actionPlanService: ActionPlanService,
    private snackBar: MdSnackBar,
    private confirmDialogHandler: ConfirmDialogHandler,
    private actionPlanReportService: ActionPlanReportService,
  ) { }

  ngOnInit() {
  }

  questioningInactiveActionPlan() {
    this.confirmDialogHandler.call('Excluir', 'Deseja realmente excluir esse plano de ação?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.inactivateActionPlan();
      }
    });
  }

  inactivateActionPlan() {

    this.actionPlanService.delete(this.actionPlan.idPlan).subscribe(
      success => {
        if (success) {
          this.inactivateActionPlanEvent.emit(this.actionPlan);
        } else {
          this.snackBar.open('Não foi possível excluir o plano de ação! ', null, { duration: 2000 });
        }
      },
      error => {
        this.snackBar.open('Não foi possível excluir o plano de ação! ', null, { duration: 2000 });
      }
    );
  }

  doOpenActionPlan() {
    this.openActionPlan.emit();
  }

  public printActionPlane(actionPlanId: number) {
    this.onPrinting = true;
    this.actionPlanReportService.printActionPlane(actionPlanId).subscribe((response) => {
      openNewTab(URL.createObjectURL(response));

      this.onPrinting = false;
    },
      (error) => {
        this.onPrinting = false;
        this.snackBar.open('Não foi possível carregar gerar o relatório', null, { duration: 2000 });
      }, () => {
        this.onPrinting = false;
      });
  }

  updateCounts(actionPlan: ActionPlanDTO): void {

    this.actionPlan.qtdeStatus01 = actionPlan.qtdeStatus01;
    this.actionPlan.qtdeStatus02 = actionPlan.qtdeStatus02;
    this.actionPlan.qtdeStatus03 = actionPlan.qtdeStatus03;
    this.actionPlan.qtdeStatus04 = actionPlan.qtdeStatus04;
    this.actionPlan.qtdeStatus05 = actionPlan.qtdeStatus05;
  }


}
