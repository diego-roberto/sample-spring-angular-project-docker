import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { RiskTypes } from 'app/shared/models/risk-types.model';

@Injectable()
export class RiskTypesService {
    private endpoint = '/risk_types';

    constructor(private service: HttpClientService) { }

    getRiskTypesList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.riskTypes.map((jsonRiskTypes) => {
                return new RiskTypes().initializeWithJSON(jsonRiskTypes);
            });
        });
    }

    getRiskTypeById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new RiskTypes().initializeWithJSON(jsonResponse.riskType);
        });
    }
}
