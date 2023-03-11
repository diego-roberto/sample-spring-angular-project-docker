import { Permission } from "./permission/permission";

export class Sensor{
    id: number;
    identification: string;
    type: number;
    
    public constructor() { }

    public initializeWithJSON(json: any): Sensor {
        this.id = Number.parseInt(json.id);
        this.identification = json.identification;
        this.type = json.type;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            identification: this.identification,
            type: this.type
        };
    }
}
