export class Cbos {
    id: number;
    code: string;
    title: string;
    riskFactor: number;
    description: string;

    constructor() { }

    public initializeWithJSON(json: any) {
        this.id    = json.id;
        this.code  = json.code;
        this.title = json.title;
        this.riskFactor = json.riskFactorId;
        this.description = json.description;
        return this;
    }
}
