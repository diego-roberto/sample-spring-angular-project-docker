import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ActionPlanListComponent } from 'app/views/constructions/detail/activities/action-plan/action-plan-list/action-plan-list.component';

import { ConstructionsService } from 'app/shared/services/constructions.service';

import { ActionPlanDTO } from 'app/shared/models/action-plan.dto-model';

@Component({
  selector: 'action-plan',
  templateUrl: './action-plan.component.html',
  styleUrls: ['./action-plan.component.scss']
})
export class ActionPlanComponent implements OnInit, OnDestroy {

  @Input() taskScroll;

  @ViewChild('actionPlanList')
  actionPlanListComponent: ActionPlanListComponent;

  actionPlan: ActionPlanDTO;

  private changeConstructionSubscription: Subscription;

  constructor(private constructionsService: ConstructionsService) { }

  ngOnInit() {
    this.changeConstructionSubscription = this.constructionsService.changeConstructionObservable.subscribe(construction => {
      if (this.isActionPlanOpened()) {
        this.doGoBackToList();
      } else {
        this.actionPlanListComponent.getActionPlans();
      }
    });
  }

  ngOnDestroy(): void {
    this.changeConstructionSubscription.unsubscribe();
  }

  doOpenActionPlan(actionPlan: ActionPlanDTO) {
    this.actionPlan = actionPlan;
  }

  doGoBackToList() {
    this.actionPlan = undefined;
  }

  isActionPlanOpened(): boolean {
    return this.actionPlan !== undefined;
  }

}
