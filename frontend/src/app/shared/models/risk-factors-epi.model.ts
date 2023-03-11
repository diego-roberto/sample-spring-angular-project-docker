export class RiskFactorsEpi {
    id: number;
    riskFactorId: number;
    epiId: number;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.riskFactorId = json.riskFactorId;
        this.epiId = json.epiId;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            riskFactorId: this.riskFactorId,
            epiId: this.epiId
        };
    }
}
