export interface ISupplierContact {
    id: number;
    name: string;
    role: string;
    phone: string;
    celphone: string;
    email: string;
}

export class SupplierContact implements ISupplierContact {

    id: number;
    name: string;
    role: string;
    phone: string;
    celphone: string;
    email: string;

    constructor()
    constructor(data: ISupplierContact)
    constructor(data?: any) {
        this.id = data && data.id || undefined;
        this.name = data && data.name || undefined;
        this.role = data && data.role || undefined;
        this.phone = data && data.phone || undefined;
        this.celphone = data && data.celphone || undefined;
        this.email = data && data.email || undefined;
    }

    public initializeWithJSON(json: any): SupplierContact {
        this.id = json.id;
        this.name = json.name;
        this.role = json.role;
        this.phone = json.phone;
        this.celphone = json.celphone;
        this.email = json.email;

        return this;
    }

}