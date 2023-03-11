export class PotentialPenaltyChart {
	legend: string;
	qtde: number;

    public constructor() { }

    public initializeWithJSON(json: any): PotentialPenaltyChart {
        this.legend = json.legend;
        this.qtde = json.qtde;

        return this;
    }

    public toJSON() {
        return {
            legend: this.legend,
            qtde: this.qtde
        };
    }

}
