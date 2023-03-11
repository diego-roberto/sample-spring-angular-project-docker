export class ConstructionSite {
    id: number;
    name: string;
    cep: string;
    city: string;
    address: string;
    cei: string;
    status: string;
    description: string;
    logo: any;
    featured: any;


    public toJson() {
        return JSON.stringify(this);
    }
}
