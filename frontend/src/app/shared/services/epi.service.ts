import { Injectable } from "@angular/core";
import { HttpClientService } from "./http-client.service";
import { Observable } from "rxjs/Observable";
import { Epi } from "app/shared/models/epi.model";
import { DashboardFilter } from "../models/dashboard-filter";
import "rxjs/add/operator/map";
import { EpiDeliveryChart } from "app/shared/models/epi-delivery-chart.model";

@Injectable()
export class EpiService {
  private endpoint = "/epi";
  private endpointFile = "/epi_file";
  private chart = "/epiDeliveryChart";
  private detailChart = this.endpoint + "/epiDeliveryDetailChart";

  constructor(private service: HttpClientService) { }

  getEpiList() {
    return this.service.get(this.endpoint).map(jsonResponse => {
      return jsonResponse.epis.map(jsonEpi => {
        return new Epi().initializeWithJSON(jsonEpi);
      });
    });
  }

  getEpiByEpiTypesIdList(id: number) {
    return this.service
      .get(this.endpoint + "/epiTypesId/" + id)
      .map(jsonResponse => {
        return jsonResponse.epis.map(jsonEpi => {
          return new Epi().initializeWithJSON(jsonEpi);
        });
      });
  }

  getEpiById(id: number) {
    return this.service.get(this.endpoint + "/" + id).map(jsonResponse => {
      return new Epi().initializeWithJSON(jsonResponse.epi);
    });
  }

  saveEpi(epi: Epi) {
    if (epi.id) {
      return this.updateEpi(epi);
    } else {
      return this.createEpi(epi);
    }
  }

  private createEpi(epi: Epi) {
    return this.service
      .post(this.endpoint, JSON.stringify(epi.toJSON()))
      .map(jsonResponse => {
        return new Epi().initializeWithJSON(jsonResponse.epi);
      });
  }

  private updateEpi(epi: Epi) {
    return this.service
      .put(this.endpoint + "/" + epi.id, JSON.stringify(epi.toJSON()))
      .map(jsonResponse => {
        return new Epi().initializeWithJSON(jsonResponse.epi);
      });
  }

  updateChart(
    dashboardFilter: DashboardFilter,
    mode: String
  ): Observable<EpiDeliveryChart[]> {
    return this.service
      .post(this.endpoint + this.chart, {
        dashboardFilter: dashboardFilter,
        mode: mode
      })
      .map(jsonResponse => {
        return jsonResponse.response.records.map(json =>
          new EpiDeliveryChart().initializeWithJSON(json)
        );
      });
  }

  getEpiDeliveryDetailChart(filter: any): Observable<EpiDeliveryChart[]> {
    return this.service.post(this.detailChart, filter).map(jsonResponse => {
      return jsonResponse.response.items.map(item =>
        new EpiDeliveryChart().initializeWithJSON(item)
      );
    });
  }
}
