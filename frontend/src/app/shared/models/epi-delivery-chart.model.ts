export class EpiDeliveryChart {

    legend: string;
    epiValue: number;

    epiTypeId: number;
    epiType: string;

    public constructor() { }

    public initializeWithJSON(json: any): EpiDeliveryChart {
        this.legend = json.legend;
        this.epiType = json.epiType;
        this.epiTypeId = json.epiTypeId;
        this.epiValue = json.epiValue;

        return this;
    }

    public toJSON() {
        return {
            legend: this.legend,
            epiType: this.epiType,
            epiTypeId: this.epiTypeId,
            epiValue: this.epiValue
        };
    }

}
