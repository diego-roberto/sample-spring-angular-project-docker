import { Component, OnChanges, OnInit, Input, Output, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MdSnackBar } from '@angular/material';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';

import { ActionPlanListLineDetailComponent } from 'app/views/constructions/detail/activities/action-plan/action-plan-list/action-plan-list-line-detail/action-plan-list-line-detail.component';

import { ActionPlanService } from 'app/shared/services/action-plan.service';
import { ConstructionsService } from 'app/shared/services/constructions.service';

import { ActionPlanDTO } from 'app/shared/models/action-plan.dto-model';

@Component({
  selector: 'action-plan-list',
  templateUrl: './action-plan-list.component.html',
  styleUrls: ['./action-plan-list.component.scss']
})
export class ActionPlanListComponent implements OnChanges, OnInit {

  @Input() taskScroll;
  @Input() items: ActionPlanDTO[];
  loadingStack: Set<string>;
  actionPlans: ActionPlanDTO[];
  actionPlansFiltered: ActionPlanDTO[];
  state = 'loading';
  isShow = false;
  searchValue = '';

  @Output() updateItem: EventEmitter<ActionPlanDTO> = new EventEmitter();
  @Output() openActionPlan: EventEmitter<ActionPlanDTO> = new EventEmitter();

  @ViewChild(VirtualScrollComponent)
  private virtualScroll: VirtualScrollComponent;
  @ViewChild('viewLine') viewLine: ActionPlanListLineDetailComponent;
  constructor(private actionPlanService: ActionPlanService,
    private constructionsService: ConstructionsService,
    private snackBar: MdSnackBar,
    private datepipe: DatePipe) {

    this.loadingStack = new Set<string>();
  }

  ngOnInit() {
    this.getActionPlans();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  getActionPlans() {
    const construction = this.constructionsService.construction;
    this.addToLoadingStack('getActionPlans');
    this.actionPlanService.retrieveAll(construction.id).subscribe(
      actionPlans => {
        this.state = 'loaded';
        this.removeFromLoadingStack('getActionPlans');
        this.actionPlans = actionPlans;
        this.actionPlansFiltered = this.actionPlans;
      },
      error => {
        this.state = 'loaded';
        this.removeFromLoadingStack('getActionPlans');
        this.snackBar.open('Não foi possível recuperar os planos de ação! ', null, { duration: 2000 });
      }
    );
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText() {
    if (!this.searchValue || this.searchValue === '') {
      this.actionPlansFiltered = this.actionPlans;
    } else {
      this.actionPlansFiltered = this.actionPlans.filter(actionPlan =>
        actionPlan.description.toLowerCase()
          .includes(this.searchValue.trim().toLowerCase()) ||
        this.datepipe.transform(actionPlan.creation, 'dd/MM/yyyy HH:mm:ss')
          .includes(this.searchValue.trim().toLowerCase())
      );
    }
  }

  inactivateActionPlan(actionPlan: ActionPlanDTO) {
    if (this.actionPlans.findIndex(a => a.idPlan === actionPlan.idPlan) > -1) {
      this.actionPlans.splice(this.actionPlans.findIndex(a => a.idPlan === actionPlan.idPlan), 1);
    }

    if (this.actionPlansFiltered.findIndex(a => a.idPlan === actionPlan.idPlan) > -1) {
      this.actionPlansFiltered.splice(this.actionPlansFiltered.findIndex(a => a.idPlan === actionPlan.idPlan), 1);
    }

    this.virtualScroll.refresh();
  }

  doOpenActionPlan(actionPlan: ActionPlanDTO) {
    this.openActionPlan.emit(actionPlan);
  }

  addToLoadingStack(key: string) {
    this.loadingStack.add(key);
  }

  removeFromLoadingStack(key: string) {
    this.loadingStack.delete(key);
  }

  isLoadingActive(): boolean {
    return this.state == 'loading';
  }

  clickExtend() {
    this.isShow = true;
  }

  updateLine(id: number) {
    this.actionPlanService.retrieveId(id).subscribe(response => {
      const itemUpdate = response[0];
      const itemSelected: ActionPlanDTO = this.virtualScroll.viewPortItems.find(it => it.idPlan == itemUpdate.idPlan);
      const insdexSelected = this.actionPlansFiltered.findIndex(it => it.idPlan == itemUpdate.idPlan);

      if (itemSelected && insdexSelected) {
        itemSelected.qtdeStatus01 = Number(itemUpdate.qtdeStatus01);
        itemSelected.qtdeStatus02 = Number(itemUpdate.qtdeStatus02);
        itemSelected.qtdeStatus03 = Number(itemUpdate.qtdeStatus03);
        itemSelected.qtdeStatus04 = Number(itemUpdate.qtdeStatus04);
        itemSelected.qtdeStatus05 = Number(itemUpdate.qtdeStatus05);
        this.virtualScroll.viewPortItems[insdexSelected] = itemSelected;
      }
    });
  }


}
