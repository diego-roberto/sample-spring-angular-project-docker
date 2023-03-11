export interface ICompanyContact {
    id: number;
    name: string;
    role: string;
    phone: string;
    celphone: string;
    email: string;
}

export class CompanyContact implements ICompanyContact {

    id: number;
    name: string;
    role: string;
    phone: string;
    celphone: string;
    email: string;

    constructor()
    constructor(data: ICompanyContact)
    constructor(data?: any) {
        this.id = data && data.id || undefined;
        this.name = data && data.name || undefined;
        this.role = data && data.role || undefined;
        this.phone = data && data.phone || undefined;
        this.celphone = data && data.celphone || undefined;
        this.email = data && data.email || undefined;
    }

    public initializeWithJSON(json: any): CompanyContact {
        this.id = json.id;
        this.name = json.name;
        this.role = json.role;
        this.phone = json.phone;
        this.celphone = json.celphone;
        this.email = json.email;

        return this;
    }

}