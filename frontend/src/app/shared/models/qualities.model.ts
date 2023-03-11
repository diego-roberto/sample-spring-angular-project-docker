export class Qualities {
    id: number;
    name: string;
    recyclingId: number;
    riskFactor: number;

    public initializeWithJSON(json: any) {
        this.id = json.id;
        this.name = json.name;
        this.riskFactor = json.riskFactorId;
        this.recyclingId = json.recyclingId;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            riskFactorId: this.riskFactor,
            recyclingId: this.recyclingId,
        };
    }
}
