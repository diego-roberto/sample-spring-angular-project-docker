export class Tenant {
    id: number;
    frontendHost: string;
    servicesHost: string;
    active: boolean;
    createdAt: any;
    schema: string;

    public constructor() { }

    public initializeWithJSON(json: any): Tenant {
        this.id = json.id;
        this.frontendHost = json.frontendHost;
        this.servicesHost = json.servicesHost;
        this.active = json.active;
        this.createdAt = json.createdAt;
        this.schema = json.schema;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            frontendHost: this.frontendHost,
            servicesHost: this.servicesHost,
            active: this.active,
            createdAt: this.createdAt,
            schema: this.schema
        };
    }
}
