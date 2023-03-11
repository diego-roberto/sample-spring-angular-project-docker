export class EpiTypes {
    id: number;
    description: string;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.description = json.description;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            description: this.description,
        };
    }
}
