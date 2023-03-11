export class RiskFactorsCbos {
    id: number;
    riskFactorId: number;
    cboId: number;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.riskFactorId = json.riskFactorId;
        this.cboId = json.cboId;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            riskFactorId: this.riskFactorId,
            cboId: this.cboId
        };
    }
}
