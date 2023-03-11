export class UserProfile {
    id: number;
    name: string;


    public constructor() { }

    public initializeWithJSON(json: any): UserProfile {
        this.id = json.id;
        this.name = json.name;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name
        };
    }
}
