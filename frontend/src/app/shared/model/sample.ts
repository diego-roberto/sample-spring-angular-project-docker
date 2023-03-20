export class Sample {
    id!: number;
    name!: string;
    status!: boolean;
    cpf!: string;
    address!: string;

    public constructor() { }

    public initializeWithJSON(json: any): Sample {
        this.id = json.id;
        this.name = json.name;
        this.cpf = json.cpf;
        this.address = json.address;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            cpf: this.cpf,
            address: this.address
        }
    }
}
