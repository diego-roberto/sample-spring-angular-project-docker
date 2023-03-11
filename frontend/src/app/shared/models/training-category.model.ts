
export class TrainingCategory {
    id: number;
    name: string;

    public initializeWithJSON(json: any): TrainingCategory {
        this.id     = json.id;
        this.name   = json.name;

        return this;
    }

    public toJSON() {
        return {
            id:     this.id,
            name:   this.name
        };
    }
}

