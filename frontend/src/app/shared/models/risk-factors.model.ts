import { RiskTypes } from './risk-types.model';

export class RiskFactors {
    id: number;
    name: string;
    riskType: RiskTypes;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.name = json.name;
        this.riskType = new RiskTypes().initializeWithJSON(json.riskType);
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            riskType: this.riskType
        };
    }
}
