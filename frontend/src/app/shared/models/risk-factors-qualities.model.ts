export class RiskFactorsQualities {
    id: number;
    riskFactorId: number;
    qualitiesId: number;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.riskFactorId = json.riskFactorId;
        this.qualitiesId = json.qualitiesId;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            riskFactorId: this.riskFactorId,
            qualitiesId: this.qualitiesId
        };
    }
}
