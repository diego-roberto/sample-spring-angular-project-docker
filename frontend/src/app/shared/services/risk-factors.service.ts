import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { RiskFactors } from 'app/shared/models/risk-factors.model';

@Injectable()
export class RiskFactorsService {
    public riskFactor: RiskFactors;
    private endpoint = '/risk_factors';

    constructor(private service: HttpClientService) { }

    getRiskFactorsList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.riskFactors.map((jsonRiskFactor) => {
                return new RiskFactors().initializeWithJSON(jsonRiskFactor);
            });
        });
    }

    getRiskFactorById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new RiskFactors().initializeWithJSON(jsonResponse.riskFactors);
        });
    }
}
