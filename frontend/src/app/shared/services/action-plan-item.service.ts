import { ActionPlanChartFilterModel } from 'app/shared/models/action-plan-chart-filter.model';
import { ActionPlanChart } from './../models/action-plan-chart.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientService, ClientType } from './http-client.service';

import { ActionPlanItem } from 'app/shared/models/action-plan-item.model';
import { ActionPlanItemObservation } from 'app/shared/models/action-plan-item-observation.model';


@Injectable()
export class ActionPlanItemService {

  private endpoint = '/actionPlanItem';
  private type: ClientType = ClientType.backend;

  constructor(private service: HttpClientService) { }

  getList(id: number): Observable<ActionPlanItem[]> {
    return this.service.get(this.endpoint + '/' + id).map(response => {
      return response.actionPlanItems.map(
        actionPlanItem => { return new ActionPlanItem().initializeWithJSON(actionPlanItem); }
      );
    },
      error => { return null; }
    );
  }

  updateItem(actionPlanItem: ActionPlanItem) {
    const objectJson: any = new ActionPlanItem().toJSONFormat(actionPlanItem);
    return this.service.put(this.endpoint + '/' + actionPlanItem.id, JSON.stringify(objectJson), this.type)
        .map((jsonResponse) => {
          return new ActionPlanItem().initializeWithJSON(jsonResponse.actionPlanItemUpdate);
      });
  }

  addObservation(actionPlanItemObservation: ActionPlanItemObservation): Observable<ActionPlanItemObservation> {
    const jsonRequest = {
      actionPlanItemId: actionPlanItemObservation.actionPlanItemId,
      userId: actionPlanItemObservation.user.id,
      observation: actionPlanItemObservation.observation
    };

    return this.service.put(this.endpoint + '/observation', jsonRequest, this.type)
        .map((jsonResponse) => {
          return new ActionPlanItemObservation().initializeWithJSON(jsonResponse.observation);
      });
  }

  verifyToCompleteActions(id: number): Observable<ActionPlanItem[]> {
    return this.service.get(this.endpoint + '/verifyToCompleteActions/' + id).map(response => {
      return response.actionPlanItems.map(
        actionPlanItem => { return new ActionPlanItem().initializeWithJSON(actionPlanItem); }
      );
    },
      error => { return null; }
    );
  }

  getActionPlanChart(filter: any): Observable<ActionPlanChart[]> {
    return this.service.post(this.endpoint + '/actionPlanChart', filter)
        .map((jsonResponse) => {
            return jsonResponse.response.items.map(item => new ActionPlanChart().initializeWithJSON(item));
        });
  }


  getActionPlanChartFiltered(filter: any): Observable<ActionPlanChart[]> {
    return this.service.post(this.endpoint + '/actionPlanChartFiltered', filter)
        .map((jsonResponse) => {
            return jsonResponse.response.items.map(item => new ActionPlanChart().initializeWithJSON(item));
        });
  }

  getActionPlanChartFilter(filter: any): Observable<ActionPlanChartFilterModel[]> {
    return this.service.post(this.endpoint + '/actionPlanChartFilter', filter)
        .map((jsonResponse) => {
            return jsonResponse.response.items.map(item => new ActionPlanChartFilterModel().initializeWithJSON(item));
        });
  }

}
