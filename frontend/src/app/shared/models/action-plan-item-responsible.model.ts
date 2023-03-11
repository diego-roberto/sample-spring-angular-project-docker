
export class ActionPlanItemResponsible {
    id: number;
    name: string;
    type: string;

    public constructor() { }

    public initializeWithJSON(json: any): ActionPlanItemResponsible {
        this.id = Number.parseInt(json.id);
        this.name = json.name;
        this.type = json.type;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type
        };
    }
}
