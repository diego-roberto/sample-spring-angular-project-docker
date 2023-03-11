import { MdDialogRef, MD_DIALOG_DATA, PageEvent } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

import { ActionPlanItem } from 'app/shared/models/action-plan-item.model';

@Component({
  selector: 'update-action-plan-dialog',
  templateUrl: './update-action-plan-dialog.component.html',
  styleUrls: ['./update-action-plan-dialog.component.scss']
})
export class UpdateActionPlanDialogComponent implements OnInit {

  actionPlanItemPageSize = 5;

  actionPlanItemList: ActionPlanItem[];
  origin: number;
  actionPlanItemPageIndex: number;
  additionalMessage: string;

  constructor(
    @Inject(MD_DIALOG_DATA) public dialogData: any,
    private dialogRef: MdDialogRef<UpdateActionPlanDialogComponent>,
  ) { }

  ngOnInit() {
    this.actionPlanItemList = this.dialogData.actionPlanItemList;
    this.origin = this.dialogData.origin;
    this.actionPlanItemPageIndex = 1;
  }

  getActionPlanItemListPage(): ActionPlanItem[] {
    return this.actionPlanItemList.slice((this.actionPlanItemPageIndex - 1) * this.actionPlanItemPageSize, (this.actionPlanItemPageIndex - 1) * this.actionPlanItemPageSize + this.actionPlanItemPageSize);
  }

  getActionPlanItemTotalPages(): number {
    return Math.floor(this.actionPlanItemList.length / this.actionPlanItemPageSize) + 1;
  }

  goToActionPlanItemPage(pageIndex: any) {
    if (pageIndex < 1) { pageIndex = 1; }
    if (pageIndex > this.getActionPlanItemTotalPages()) { pageIndex = this.getActionPlanItemTotalPages(); }
    this.actionPlanItemPageIndex = pageIndex;
  }

  goToActionPlanItemPreviousPage() {
    this.goToActionPlanItemPage(--this.actionPlanItemPageIndex);
  }

  goToActionPlanItemNextPage() {
    this.goToActionPlanItemPage(++this.actionPlanItemPageIndex);
  }
  doCancel() {
    this.dialogRef.close(false);
  }

  doConfirm() {
    this.dialogRef.close(true);
  }

  getDialogTitle(): string {
    if (this.origin === 2) { return 'Imprimir'; }

    return 'Atualizar ações';
  }

  getConfirmButtonLabel(): string {
    if (this.origin === 2) { return 'Imprimir'; }

    return 'Confirmar';
  }

  getCancelButtonLabel(): string {
    if (this.origin === 2) { return 'Fechar'; }

    return 'Cancelar';
  }
}
