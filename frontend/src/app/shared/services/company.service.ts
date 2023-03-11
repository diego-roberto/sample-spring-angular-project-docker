import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { HttpClientService, ClientType } from "./http-client.service";
import { Company } from "app/shared/models/company.model";
import { CompanyDocumentation } from "app/shared/models/company-documentation.model";
import { FileInfo } from "app/shared/models/file-info.model";
import { SessionsService } from "app/shared/services/sessions.service";

@Injectable()
export class CompanyService {
  private endpoint = "/companies";
  private integrationEndpoint = "/s/empresa";
  private type: ClientType = ClientType.auth;

  constructor(
    private service: HttpClientService,
    private sessionsService: SessionsService
  ) { }

  getIntegrationCompanies(cnpj: string) {
    return this.service.get(`${this.integrationEndpoint}?cnpj=${cnpj}`);
  }

  getCompany(id: number) {
    return this.service
      .get(this.endpoint + "/" + id, this.type)
      .map(response => {
        return new Company().initializeWithJSON(response.company);
      });
  }

  getCompanies(id: number) {
    return this.service
      .get(this.endpoint + "/user/" + id + "/not-linked", this.type)
      .map(response => {
        return response;
      });
  }

  saveCompany(company: Company) {

    const companyReq = {
      userId: this.sessionsService.getCurrent().id,
      currentCompanyId: this.sessionsService.getCurrentCompany().companyId,
      company: {
        id: company.id,
        cnpj: company.cnpj,
        corporateName: company.corporateName,
        fakeName: company.fakeName,
        integration: company.integration,
        businessUnit: company.businessUnit,
      }
    };

    return this.service
      .post(this.endpoint, companyReq, this.type)
      .map(response => {
        return new Company().initializeWithJSON(response.company);
      });
  }

  updateCompanyDetails(company: Company) {
    const params = new FormData();

    const companyReq = {
      id: company.id,
      cnpj: company.cnpj,
      corporateName: company.corporateName,
      fakeName: company.fakeName,
      cep: company.cep,
      addressStreet: company.addressStreet,
      addressNumber: company.addressNumber,
      addressComplement: company.addressComplement,
      urlDomain: company.urlDomain,
      logoFileName: company.logoFileName,
      logoUrl: company.logoUrl,
      cnae: undefined,
      businessUnit: company.businessUnit,
      integration: company.integration
    };

    if (company.cnae && company.cnae.code) {
      companyReq.cnae = {
        id: company.cnae.id,
        code: company.cnae.code,
        description: company.cnae.description
      };
    }

    params.append(
      "company",
      new Blob([JSON.stringify(companyReq)], { type: "application/json" })
    );

    if (company.logoFile) {
      params.append("attachments", company.logoFile, company.logoFile.name);
    }

    return this.service
      .putWithNoHeaders(this.endpoint + "/detail", params, this.type)
      .map(response => {
        return response;
      });
  }

  updateCompanyResponsibleData(company: Company) {
    const companyReq = {
      id: company.id,
      responsibleCompany: {
        id: company.responsibleCompany.id,
        name: company.responsibleCompany.name,
        role: company.responsibleCompany.role,
        phone: company.responsibleCompany.phone,
        celphone: company.responsibleCompany.celphone,
        email: company.responsibleCompany.email
      }
    };

    return this.service
      .put(this.endpoint + "/responsible", { company: companyReq }, this.type)
      .map(response => {
        return response;
      });
  }

  updateCompanyResponsibleSstData(company: Company) {
    const companyReq = {
      id: company.id,
      responsibleSst: {
        id: company.responsibleSst.id,
        name: company.responsibleSst.name,
        role: company.responsibleSst.role,
        phone: company.responsibleSst.phone,
        celphone: company.responsibleSst.celphone,
        email: company.responsibleSst.email
      }
    };

    return this.service
      .put(
        this.endpoint + "/responsibleSst",
        { company: companyReq },
        this.type
      )
      .map(response => {
        return response;
      });
  }

  updateCompanyContactData(company: Company) {
    const companyReq = {
      id: company.id,
      contact: {
        id: company.contact.id,
        name: company.contact.name,
        role: company.contact.role,
        phone: company.contact.phone,
        celphone: company.contact.celphone,
        email: company.contact.email
      }
    };

    return this.service
      .put(this.endpoint + "/contact", { company: companyReq }, this.type)
      .map(response => {
        return response;
      });
  }

  saveCompanyDocumentationList(
    company: Company
  ): Observable<CompanyDocumentation[]> {
    const params = new FormData();

    const companyReq = {
      id: company.id,
      listCompanyDocumentation: company.companyDocumentationList.map(
        companyDocumentation => {
          return {
            id: companyDocumentation.id,
            description: companyDocumentation.description,
            dueDate: companyDocumentation.dueDate,
            accessBlocked: companyDocumentation.accessBlocked,
            shelved: companyDocumentation.shelved,
            shelvedAt: companyDocumentation.shelvedAt,
            originRenew: companyDocumentation.originRenew
              ? {
                id: companyDocumentation.originRenew.id
              }
              : undefined,
            fileName: companyDocumentation.fileName,
            fileUrl: companyDocumentation.fileUrl,
            fileIndexLink: companyDocumentation.file
              ? companyDocumentation.file.name +
              "_[" +
              company.companyDocumentationList.indexOf(companyDocumentation) +
              "]"
              : undefined
          };
        }
      )
    };

    params.append(
      "company",
      new Blob([JSON.stringify(companyReq)], { type: "application/json" })
    );

    for (const companyDocumentation of company.companyDocumentationList) {
      if (companyDocumentation.file !== undefined) {
        params.append(
          "attachments",
          companyDocumentation.file,
          companyDocumentation.file.name +
          "_[" +
          company.companyDocumentationList.indexOf(companyDocumentation) +
          "]"
        );
      }
    }

    return this.service
      .postWithNoHeaders(
        this.endpoint + "/companyDocumentation",
        params,
        this.type
      )
      .map(response => {
        return response.company.listCompanyDocumentation.map(
          companyDocumentation =>
            new CompanyDocumentation().initializeWithJSON(companyDocumentation)
        );
      });
  }

  updateCompanyAdditionalInformation(company: Company) {
    const companyReq = {
      id: company.id,
      hasSesmt: company.hasSesmt,
      hasCipa: company.hasCipa,
      employerNumber: company.employerNumber,
      isDesignatedCipa: company.isDesignatedCipa
    };

    return this.service
      .put(
        this.endpoint + "/additionalInformation",
        { company: companyReq },
        this.type
      )
      .map(response => {
        return response;
      });
  }

  printCompanyDocumentationReport(params: any): Observable<File> {
    return this.service
      .post("/company/printCompanyDocumentationReport", params)
      .map(response => {
        const fileInfo: FileInfo = new FileInfo().initializeWithJSON(response);
        const sFile: string = fileInfo.file;
        const byteCharacters = atob(sFile);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: fileInfo.fileType });

        return new File([blob], fileInfo.fileName, { type: fileInfo.fileType });
      });
  }
}
