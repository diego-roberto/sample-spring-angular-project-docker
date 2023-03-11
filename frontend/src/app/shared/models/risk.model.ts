import { Cone } from './cone.model';
import { RiskFactors } from './risk-factors.model';
import { RiskTypes } from './risk-types.model';

export class Risk {
    static readonly levelTypes: { id: number, value: string }[] = [
        { id: 1, value: 'Baixo' },
        { id: 2, value: 'Médio' },
        { id: 3, value: 'Alto' }
    ];

    id: number;
    cone: Cone;
    riskFactor: RiskFactors;
    level: number;
    riskType: RiskTypes;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.cone = json.cone ? new Cone().initializeWithJSON(json.cone) : null;
        this.riskFactor = json.riskFactor ? new RiskFactors().initializeWithJSON(json.riskFactor) : new RiskFactors();
        this.level = json.level;
        this.riskType = json.riskType ? new RiskTypes().initializeWithJSON(json.riskType) : new RiskTypes();
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            cone: this.cone ? this.cone.toJSON() : null,
            riskFactor: this.riskFactor ? this.riskFactor.toJSON() : null,
            level: this.level,
            riskType: this.riskType ? this.riskType.toJSON() : null
        };
    }
}
