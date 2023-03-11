import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Risk } from 'app/shared/models/risk.model';

@Injectable()
export class RiskService {
    private endpoint = '/risks';
    private cone = '/cone';

    constructor(private service: HttpClientService) { }

    getRiskList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.risk.map((jsonRiskTypes) => {
                return new Risk().initializeWithJSON(jsonRiskTypes);
            });
        });
    }

    getRiskListCone(coneId: number) {
        return this.service.get(this.endpoint + this.cone + '/' + coneId).map(jsonResponse => {
            return jsonResponse.risks.map((jsonRiskTypes) => {
                return new Risk().initializeWithJSON(jsonRiskTypes);
            });
        });
    }

    getRiskById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new Risk().initializeWithJSON(jsonResponse.risk);
        });
    }

    createRisk(risk: Risk) {
        return this.service.post(this.endpoint, risk.toJSON())
            .map((jsonResponse) => {
                return new Risk().initializeWithJSON(jsonResponse.risk);
            });
    }
}
