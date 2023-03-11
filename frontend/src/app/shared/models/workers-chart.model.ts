
export class WorkersChart {
    legend: string;
    ownTotal: number;
    thirdpartyTotal: number;

    public constructor() { }

    public initializeWithJSON(json: any): WorkersChart {
        this.legend = json.legend;
        this.ownTotal = json.ownTotal;
        this.thirdpartyTotal = json.thirdpartyTotal;

        return this;
    }

    public toJSON() {
        return {
            legend: this.legend,
            ownTotal: this.ownTotal,
            thirdpartyTotal: this.thirdpartyTotal,
        };
    }

}
