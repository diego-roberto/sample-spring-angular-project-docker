export class Icon {

    id: number;
    name: string;
    size: [number, number];
    title: string;

    initializeWithJSON(json: any): Icon {
        this.id = json.id;
        this.name = json.name;
        this.title = json.title;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
