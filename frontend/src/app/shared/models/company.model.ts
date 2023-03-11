import { CompanyContact } from './company-contact.model';
import { Cnae } from './cnae.model';
import { Tenant } from './tenant.model';
import { CompanyDocumentation } from 'app/shared/models/company-documentation.model';
import { BusinessUnit } from './business-unit.model';

export interface ICompany {
    id: number;
    cnpj: string;
    corporateName: string;
    fakeName: string;
    cnae: Cnae;
    cep: string;
    addressStreet: string;
    addressNumber: number;
    addressComplement: string;
    hasSesmt: boolean;
    hasCipa: boolean;
    isDesignatedCipa: boolean;
    employerNumber: number;
    logoUrl: string;
    urlDomain: string;
    logoFileName: string;
    companyDocumentationList: CompanyDocumentation[];
    businessUnit: BusinessUnit;
}

export class Company {
    id: number;
    cnpj: string;
    corporateName: string;
    fakeName: string;
    cnae: Cnae;
    cep: string;
    addressStreet: string;
    addressNumber: number;
    addressComplement: string;
    hasSesmt: boolean;
    hasCipa: boolean;
    isDesignatedCipa: boolean;
    employerNumber: number;
    logoUrl: string;
    urlDomain: string;
    logoFileName: string;
    responsibleCompany: CompanyContact;
    responsibleSst: CompanyContact;
    contact: CompanyContact;
    companyDocumentationList: CompanyDocumentation[];
    tenant: Tenant;
    logoForm: FormData;
    logoFile: File;
    businessUnit: BusinessUnit;
    integration: boolean;

    constructor()
    // tslint:disable-next-line:unified-signatures
    constructor(data: ICompany)
    constructor(data?: any) {
        this.id = data && data.id || undefined;
        this.cnpj = data && data.cnpj || undefined;
        this.corporateName = data && data.corporateName || undefined;
        this.fakeName = data && data.fakeName || undefined;
        this.cnae = data && data.cnae || new Cnae();
        this.cep = data && data.cep || undefined;
        this.addressStreet = data && data.addressStreet || undefined;
        this.addressNumber = data && data.addressNumber || undefined;
        this.addressComplement = data && data.addressComplement || undefined;
        this.hasSesmt = data && data.hasSesmt || undefined;
        this.hasCipa = data && data.hasCipa || undefined;
        this.employerNumber = data && data.employerNumber || undefined;
        this.isDesignatedCipa = data && data.isDesignatedCipa || undefined;
        this.logoUrl = data && data.logoUrl || undefined;
        this.urlDomain = data && data.urlDomain || undefined;
        this.logoFileName = data && data.logoFileName || undefined;
        this.responsibleCompany = data && data.responsibleCompany || new CompanyContact();
        this.responsibleSst = data && data.responsibleSst || new CompanyContact();
        this.contact = data && data.contact || new CompanyContact();
        this.companyDocumentationList = data && data.companyDocumentationList || [];
        this.businessUnit = data && data.businessUnit;
        this.integration = data && data.integration || false;
    }

    public initializeWithJSON(json: any): Company {
        this.id = json.id;
        this.cnpj = json.cnpj;
        this.corporateName = json.corporateName;
        this.fakeName = json.fakeName;
        this.cnae = json.cnae ? new Cnae().initializeWithJson(json.cnae) : new Cnae();
        this.cep = json.cep;
        this.addressStreet = json.addressStreet;
        this.addressNumber = json.addressNumber;
        this.addressComplement = json.addressComplement;
        this.hasSesmt = json.hasSesmt;
        this.hasCipa = json.hasCipa;
        this.employerNumber = json.employerNumber;
        this.isDesignatedCipa = json.isDesignatedCipa;
        this.logoUrl = json.logoUrl;
        this.urlDomain = json.urlDomain;
        this.logoFileName = json.logoFileName;
        this.integration = json.integration || false;
        this.responsibleCompany = json.responsibleCompany ? new CompanyContact().initializeWithJSON(json.responsibleCompany) : new CompanyContact();
        this.responsibleSst = json.responsibleSst ? new CompanyContact().initializeWithJSON(json.responsibleSst) : new CompanyContact();
        this.contact = json.contact ? new CompanyContact().initializeWithJSON(json.contact) : new CompanyContact();
        this.companyDocumentationList = json.listCompanyDocumentation ? json.listCompanyDocumentation.map(companyDocumentation => { return new CompanyDocumentation().initializeWithJSON(companyDocumentation); }) : [];
        this.tenant = json.tenant ? new Tenant().initializeWithJSON(json.tenant) : new Tenant();
        this.businessUnit = json.businessUnit as BusinessUnit;
        return this;
    }
}
