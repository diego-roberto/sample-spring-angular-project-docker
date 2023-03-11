export class ResponsibleEngineer {
    id: number;
    name: string;
    email: string;
    phone: string;

    public initializeWithJSON(json: any) {
        this.id = json.id;
        this.name = json.name;
        this.email = json.email;
        this.phone = json.phone;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone
        };
    }
}
