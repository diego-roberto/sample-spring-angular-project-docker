import { Injectable } from "@angular/core";
import { HttpClientService } from "./http-client.service";
import { CaEpi } from "app/shared/models/ca-epi.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CaEpiService {
  public caEpi: CaEpi;

  private endpoint = "/ca_epi";
  private valid = "/valid";

  constructor(private service: HttpClientService) {}

  getCaEpiList() {
    return this.service.get(this.endpoint).map(jsonResponse => {
      return jsonResponse.caEpis.map(jsonCaEpi => {
        return new CaEpi().initializeWithJSON(jsonCaEpi);
      });
    });
  }

  getCaEpiById(id: number) {
    return this.service.get(this.endpoint + "/" + id).map(jsonResponse => {
      return new CaEpi().initializeWithJSON(jsonResponse.caEpi);
    });
  }

  getCaEpiByCa(ca) {
    return this.service.get(this.endpoint + "/ca/" + ca).map(jsonResponse => {
      return jsonResponse;
    });
  }

  uploadFile(id: number, formData: any, type: string) {
    return this.service
      .postWithNoHeaders(this.endpoint + "/" + id + "/" + type, formData)
      .map(response => {
        return response;
      });
  }

  updateEpiImage(caEpi: CaEpi) {
    const formData = new FormData();
    formData.append("file", caEpi.epiFile);

    return this.service
      .postWithNoHeaders(this.endpoint + "/" + caEpi.id + "/image", formData)
      .map(response => {
        return new CaEpi().initializeWithJSON(response.caEpi);
      });
  }

  saveCaEpi(_caEpisk: CaEpi) {
    if (_caEpisk.id) {
      return this.updateCaEpi(_caEpisk);
    } else {
      return this.createCaEpi(_caEpisk);
    }
  }

  createCa(ca) {
    return this.service
      .post("/external_import_epi/create", JSON.stringify(ca.toJSON()))
      .map(jsonResponse => {
        return jsonResponse;
      });
  }

  createCaEpi(_caEpis: CaEpi) {
    return this.service
      .post(this.endpoint, JSON.stringify(_caEpis.toJSON()))
      .map(jsonResponse => {
        return new CaEpi().initializeWithJSON(jsonResponse.caEpi);
      });
  }

  updateCaEpi(_caEpisk: CaEpi) {
    return this.service
      .put(this.endpoint + "/" + _caEpisk.id, JSON.stringify(_caEpisk.toJSON()))
      .map(jsonResponse => {
        return new CaEpi().initializeWithJSON(jsonResponse.updateCaEpi);
      });
  }

  updateCaEpis(caEpis: CaEpi[]): Observable<CaEpi[]> {
    return this.service
      .put(this.endpoint, JSON.stringify(caEpis.map(x => x.toJSON())))
      .map(jsonResponse => {
        return jsonResponse.caEpis.map(caEpi => {
          return new CaEpi().initializeWithJSON(caEpi);
        });
      });
  }

  getCaEpiExpiredList() {
    return this.service.get(this.endpoint + "/expired").map(jsonResponse => {
      return jsonResponse.caEpis.map(jsonCaEpi => {
        return new CaEpi().initializeWithJSON(jsonCaEpi);
      });
    });
  }

  getCaEpiForthComingMaturitiesList() {
    return this.service
      .get(this.endpoint + "/forthComingMaturities")
      .map(jsonResponse => {
        return jsonResponse.caEpis.map(jsonCaEpi => {
          return new CaEpi().initializeWithJSON(jsonCaEpi);
        });
      });
  }

  removeCaEpiById(idCaEpi: Number) {
    return this.service
      .put(
        this.endpoint + "/removeCaEpiById/" + idCaEpi,
        JSON.stringify(this.caEpi)
      )
      .map(response => {
        return response;
      });
  }

  getValidCaEpiList() {
    return this.service.get(this.endpoint + this.valid).map(jsonResponse => {
      return jsonResponse.caEpis.map(jsonCaEpi => {
        return new CaEpi().initializeWithJSON(jsonCaEpi);
      });
    });
  }

  filter(caEpi: CaEpi[]): FilteredCaEpi[] {
    const filteredCaEpi: FilteredCaEpi[] = [];
    const today = new Date();

    caEpi.forEach(epi => {
      if (epi.ca.due_date < today) {
        filteredCaEpi.push({ caEpi: epi, expired: true });
      } else {
        filteredCaEpi.push({ caEpi: epi, expired: false });
      }
    });
    return filteredCaEpi;
  }
}

export interface FilteredCaEpi {
  caEpi: CaEpi;
  expired: boolean;
}
