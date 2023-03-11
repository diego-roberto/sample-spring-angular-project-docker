import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { RiskFactorsCbos } from 'app/shared/models/risk-factors-cbos.model';

@Injectable()
export class RiskFactorsCbosService {
    private endpoint = '/risk_factors_cbos';

    constructor(private service: HttpClientService) { }

    getRiskFactorsCboList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.riskFactorsCbos.map((jsonRiskFactorsCbos) => {
                return new RiskFactorsCbos().initializeWithJSON(jsonRiskFactorsCbos);
            });
        });
    }

    getRiskFactorsCboById(id: number) {
        return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
            return new RiskFactorsCbos().initializeWithJSON(jsonResponse.riskFactorCbo);
        });
    }
}
