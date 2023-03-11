export class PotentialPenaltyDetailChart {
	legend: string;
	qtde: number;
	checklistFatherId: number;
	checklistName: string;

    public constructor() { }

    public initializeWithJSON(json: any): PotentialPenaltyDetailChart {
        this.legend = json.legend;
        this.qtde = json.qtde;
        this.checklistFatherId = json.checklistFatherId;
        this.checklistName = json.checklistName;

        return this;
    }

    public toJSON() {
        return {
            legend: this.legend,
            qtde: this.qtde,
            checklistFatherId: this.checklistFatherId,
            checklistName: this.checklistName
        };
    }

}
