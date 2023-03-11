import { ISupplierContact, SupplierContact } from './supplier-contact.model';
import { Cnae } from './cnae.model';
import { SupplierDocumentation } from './supplier-documentation.model';

export interface ISupplier {
    id: number;
    cnpj: string;
    corporateName: string;
    traddingName: string;
    cnae: Cnae;
    cep: string;
    addressStreet: string;
    addressNumber: number;
    addressComplement: string;
    logoUrl: string;
    urlDomain: string;
    employerNumber: number;
    hasSesmt: boolean;
    hasCipa: boolean;
    isDesignatedCipa: boolean;
    logoFileName: string;
    active: boolean;
    supplierResponsible: ISupplierContact;
    supplierResponsibleSST: ISupplierContact;
    supplierContact: ISupplierContact;
    supplierDocumentationList: SupplierDocumentation[];
}

export class Supplier implements ISupplier {
    id: number;
    cnpj: string;
    corporateName: string;
    traddingName: string;
    cnae: Cnae;
    cep: string;
    addressStreet: string;
    addressNumber: number;
    addressComplement: string;
    urlDomain: string;
    employerNumber: number;
    hasSesmt: boolean;
    hasCipa: boolean;
    isDesignatedCipa: boolean;
    logoUrl: string;
    logoFileName: string;
    logoFile: File;
    active: boolean;
    supplierResponsible: SupplierContact;
    supplierResponsibleSST: SupplierContact;
    supplierContact: SupplierContact;
    supplierDocumentationList: SupplierDocumentation[];

    constructor(data?: ISupplier | any) {
        this.id = data && data.id || undefined;
        this.cnpj = data && data.cnpj || undefined;
        this.corporateName = data && data.corporateName || undefined;
        this.traddingName = data && data.traddingName || undefined;
        this.cnae = data && data.cnae || new Cnae();
        this.cep = data && data.cep || undefined;
        this.addressStreet = data && data.addressStreet || undefined;
        this.addressNumber = data && data.addressNumber || undefined;
        this.addressComplement = data && data.addressComplement || undefined;
        this.logoUrl = data && data.logoUrl || undefined;
        this.urlDomain = data && data.urlDomain || undefined;
        this.employerNumber = data && data.employerNumber || undefined;
        this.hasSesmt = data && data.hasSesmt || undefined;
        this.hasCipa = data && data.hasCipa || undefined;
        this.isDesignatedCipa = data && data.isDesignatedCipa || undefined;
        this.logoFileName = data && data.logoFileName || undefined;
        this.active = data && data.active || undefined;
        this.supplierResponsible = data && data.supplierResponsible || new SupplierContact();
        this.supplierResponsibleSST = data && data.supplierResponsibleSst || new SupplierContact();
        this.supplierContact = data && data.supplierContact || new SupplierContact();
        this.supplierDocumentationList = data && data.supplierDocumentationList || [];
    }

    public initializeWithJSON(json: any): Supplier {
        this.id = json.id;
        this.cnpj = json.cnpj;
        this.corporateName = json.corporateName;
        this.traddingName = json.traddingName;
        this.cnae = json.cnae ? new Cnae().initializeWithJson(json.cnae) : new Cnae();
        this.cep = json.cep;
        this.addressStreet = json.addressStreet;
        this.addressNumber = json.addressNumber;
        this.addressComplement = json.addressComplement;
        this.logoUrl = json.logoUrl;
        this.urlDomain = json.urlDomain;
        this.employerNumber = json.employerNumber;
        this.hasSesmt = json.hasSesmt;
        this.hasCipa = json.hasCipa;
        this.isDesignatedCipa = json.isDesignatedCipa;
        this.logoFileName = json.logoFileName;
        this.active = json.active;
        this.supplierResponsible = json.supplierResponsible ? new SupplierContact().initializeWithJSON(json.supplierResponsible) : new SupplierContact();
        this.supplierResponsibleSST = json.supplierResponsibleSst ? new SupplierContact().initializeWithJSON(json.supplierResponsibleSst) : new SupplierContact();
        this.supplierContact = json.supplierContact ? new SupplierContact().initializeWithJSON(json.supplierContact) : new SupplierContact();
        this.supplierDocumentationList = json.listSupplierDocumentation ? json.listSupplierDocumentation.map(supplierDocumentation => { return new SupplierDocumentation().initializeWithJSON(supplierDocumentation); }) : [];

        return this;
    }
}
