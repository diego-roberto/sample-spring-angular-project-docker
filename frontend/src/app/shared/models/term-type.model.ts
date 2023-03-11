
export class TermType {
    id: number;
    description: string;
    termsType: TermType;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.description = json.description;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            description: this.description
        };
    }
}
