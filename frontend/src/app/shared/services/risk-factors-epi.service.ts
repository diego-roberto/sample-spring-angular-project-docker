import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { RiskFactorsEpi } from 'app/shared/models/risk-factors-epi.model';
import { Epi } from 'app/shared/models/epi.model';

@Injectable()
export class RiskFactorsEpiService {
    private endpoint = '/risk_factors_epi';
    private riskEpis = '/risk_epis';

    constructor(private service: HttpClientService) { }

    getRiskFactorsEpiList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.riskFactorsEpi.map((jsonRiskFactorsEpi) => {
                return new RiskFactorsEpi().initializeWithJSON(jsonRiskFactorsEpi);
            });
        });
    }

    getRiskEpiList(riskFactors: number[]) {
        return this.service.get(this.endpoint + this.riskEpis + '/' + riskFactors).map(jsonResponse => {
            return jsonResponse.riskEpis.map((jsonRiskEpis) => {
                return new Epi().initializeWithJSON(jsonRiskEpis);
            });
        });
    }

    getRiskFactorsEpiById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new RiskFactorsEpi().initializeWithJSON(jsonResponse.riskFactorEpi);
        });
    }
}
