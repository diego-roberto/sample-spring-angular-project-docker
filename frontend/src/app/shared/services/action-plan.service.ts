import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { ActionPlanDTO } from './../models/action-plan.dto-model';
import { ActionPlan } from './../models/action-plan.model';
import { HttpClientService } from './http-client.service';

@Injectable()
export class ActionPlanService {

  private endpoint = '/actionPlan';

  constructor(private service: HttpClientService) { }

  retrieveAll(constructionId): Observable<ActionPlanDTO[]> {
    return this.service.get(this.endpoint + "/" + constructionId).map(
      response => {
        return response.actionPlans.map(
          actionPlan => { return new ActionPlanDTO().initializeWithJSON(actionPlan); }
        );
      },
      error => { return null; }
    );
  }

  create(checklistAnswerId: number, userId: number): Observable<any> {
    const params = {
      checklistAnswerId: checklistAnswerId,
      userId: userId
    };

    return this.service.post(this.endpoint, params).map(
      response => { return response; },
      error => { return null; }
    );
  }

  retrieve(actionPlanId: number): Observable<ActionPlan> {
    return this.service.get(this.endpoint + '/' + actionPlanId).map(
      response => { return new ActionPlan().initializeWithJSON(response); },
      error => { return null; }
    );
  }

  delete(actionPlanId: number): Observable<boolean> {
    return this.service.delete(this.endpoint + '/' + actionPlanId).map(
        response => { return true; },
        error => { return false; }
    );
  }

  retrieveId(id: number): Observable<ActionPlanDTO[]> {
    return this.service.get(this.endpoint + '/line/' + id).map(
      response => {
        return response.actionPlans.map(
          actionPlan => { return new ActionPlanDTO().initializeWithJSON(actionPlan); }
        );
      },
      error => { return null; }
    );
  }

}
