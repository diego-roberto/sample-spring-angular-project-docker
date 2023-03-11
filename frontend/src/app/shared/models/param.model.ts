export interface IParam {
    id: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    paramLabel: string;
    paramDate: Date;
    paramValue: number;
    paramDecimal: number;
    paramBoolean: boolean;
}

export class Param implements IParam {
    id: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    paramLabel: string;
    paramDate: Date;
    paramValue: number;
    paramDecimal: number;
    paramBoolean: boolean;

    public constructor() { }

    public initializeWithJSON(json: any): Param {
        if(json.id && json.id != null) this.id = Number.parseInt(json.id);
        if(json.description && json.description != null) this.description = json.description;
        if(json.createdAt && json.createdAt != null) this.createdAt = new Date(json.createdAt);
        if(json.updatedAt && json.updatedAt != null) this.updatedAt = new Date(json.updatedAt);
        if(json.paramLabel && json.paramLabel != null) this.paramLabel = json.paramLabel;
        if(json.paramDate && json.paramDate != null) this.paramDate = new Date(json.paramDate);
        if(json.paramValue && json.paramValue != null) this.paramValue = Number.parseInt(json.paramValue);
        if(json.paramDecimal && json.paramDecimal != null) this.paramDecimal = Number.parseFloat(json.paramDecimal);
        if(json.paramBoolean && json.paramBoolean != null) this.paramBoolean = json.paramBoolean;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            paramLabel: this.paramLabel,
            paramDate: this.paramDate,
            paramValue: this.paramValue,
            paramDecimal: this.paramDecimal,
            paramBoolean: this.paramBoolean
        };
    }
}
