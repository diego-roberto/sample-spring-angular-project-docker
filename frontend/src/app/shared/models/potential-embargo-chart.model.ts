export class PotentialEmbargoChart {
	legend: string;
	embargoQtde: number;
	maisFiscalizadoQtde: number;

    public constructor() { }

    public initializeWithJSON(json: any): PotentialEmbargoChart {
        this.legend = json.legend;
        this.embargoQtde = json.embargoQtde;
        this.maisFiscalizadoQtde = json.maisFiscalizadoQtde;

        return this;
    }

    public toJSON() {
        return {
            legend: this.legend,
            embargoQtde: this.embargoQtde,
            maisFiscalizadoQtde: this.maisFiscalizadoQtde
        };
    }

}
