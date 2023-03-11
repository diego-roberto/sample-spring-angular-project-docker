
export class ActionPlanChart {
    legend: string;
    completeTotal: number;
    scheduledTotal: number;
    delayedTotal: number;

    public constructor() { }

    public initializeWithJSON(json: any): ActionPlanChart {
        this.legend = json.legend;
        this.completeTotal = json.completeTotal;
        this.scheduledTotal = json.scheduledTotal;
        this.delayedTotal = json.delayedTotal;

        return this;
    }

    public toJSON() {
        return {
            legend: this.legend,
            completeTotal: this.completeTotal,
            scheduledTotal: this.scheduledTotal,
            delayedTotal: this.delayedTotal,
        };
    }

}
