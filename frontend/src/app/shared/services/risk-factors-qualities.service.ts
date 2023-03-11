import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { RiskFactorsQualities } from 'app/shared/models/risk-factors-qualities.model';
import { Qualities } from 'app/shared/models/qualities.model';
import { RiskFactors } from 'app/shared/models/risk-factors.model';

@Injectable()
export class RiskFactorsQualitiesService {
    private endpoint = '/risk_factors_qualities';
    private riskQualities = '/risk_qualities';

    constructor(private service: HttpClientService) { }

    getRiskFactorsQualitiesList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.riskFactorsQualities.map((jsonRiskFactorsQualities) => {
                return new RiskFactorsQualities().initializeWithJSON(jsonRiskFactorsQualities);
            });
        });
    }

    getRiskQualitiesList(riskFactors: number[]) {
        return this.service.get(this.endpoint + this.riskQualities + '/' + riskFactors).map(jsonResponse => {
            return jsonResponse.riskQualities.map((jsonRiskQualities) => {
                return new Qualities().initializeWithJSON(jsonRiskQualities);
            });
        });
    }

    getRiskFactorsQualitiesById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new RiskFactorsQualities().initializeWithJSON(jsonResponse.FactorQualities);
        });
    }
}
