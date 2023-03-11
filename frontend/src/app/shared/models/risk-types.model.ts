export class RiskTypes {
    id: number;
    name: string;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.name = json.name;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        };
    }
}
