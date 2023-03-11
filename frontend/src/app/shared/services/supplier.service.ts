import { SupplierDocumentation } from './../models/supplier-documentation.model';
import { SupplierContact } from 'app/shared/models/supplier-contact.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientService } from 'app/shared/services/http-client.service';

import { Supplier } from 'app/shared/models/supplier.model';

import { FileInfo } from 'app/shared/models/file-info.model';

@Injectable()
export class SupplierService {

    private endpoint = '/supplier';

    constructor(private service: HttpClientService) { }

    getAllSupplierList(): Observable<any> {
        return this.service.get(this.endpoint + '/all')
            .map(response => {
                const list = response.supplierList.map(supplier => new Supplier().initializeWithJSON(supplier));
                return list;
            });
    }

    getSupplierList(supplierRequest): Observable<any> {
        return this.service.post(this.endpoint + '/filter', supplierRequest)
            .map(response => {
                response.supplierList = response.supplierList.map(supplier => new Supplier().initializeWithJSON(supplier));
                return response;
            });
    }

    getSupplier(id): Observable<Supplier> {
        return this.service.get(this.endpoint + '/' + id)
            .map(response => {
                return new Supplier().initializeWithJSON(response.supplier);
            });
    }

    updateSupplierActive(supplierId: number, value: boolean): Observable<Supplier> {
        return this.service.post(this.endpoint + '/active/' + supplierId + '/' + value, null)
            .map((response) => {
                return new Supplier().initializeWithJSON(response.supplier);
            });
    }

    saveSupplierData(supplier: Supplier): Observable<Supplier> {
        const params = new FormData();

        const supplierReq = {
            id: supplier.id,
            cnpj: supplier.cnpj,
            corporateName: supplier.corporateName,
            traddingName: supplier.traddingName,
            cep: supplier.cep,
            addressStreet: supplier.addressStreet,
            addressNumber: supplier.addressNumber,
            addressComplement: supplier.addressComplement,
            urlDomain: supplier.urlDomain,
            logoFileName: supplier.logoFileName,
            logoUrl: supplier.logoUrl,
            cnae: undefined
        };

        if (supplier.cnae) {
            supplierReq.cnae = {
                id: supplier.cnae.id,
                code: supplier.cnae.code,
                description: supplier.cnae.description
            };
        }

        params.append('supplier', new Blob([JSON.stringify(supplierReq)], { type: 'application/json' }));

        if (supplier.logoFile) {
            params.append('attachments', supplier.logoFile, supplier.logoFile.name);
        }

        return this.service.postWithNoHeaders(this.endpoint, params)
            .map((response) => {
                return new Supplier().initializeWithJSON(response.supplier);
            });
    }

    saveSupplierResponsible(supplier: Supplier): Observable<SupplierContact> {
        const supplierReq = {
            id: supplier.id,
            supplierResponsible: {
                id: supplier.supplierResponsible.id,
                name: supplier.supplierResponsible.name,
                role: supplier.supplierResponsible.role,
                phone: supplier.supplierResponsible.phone,
                celphone: supplier.supplierResponsible.celphone,
                email: supplier.supplierResponsible.email
            }
        };

        return this.service.post(this.endpoint + '/responsible', { supplier: supplierReq })
            .map((response) => {
                return new SupplierContact().initializeWithJSON(response.supplierResponsible);
            });
    }

    saveSupplierResponsibleSST(supplier: Supplier): Observable<SupplierContact> {
        const supplierReq = {
            id: supplier.id,
            supplierResponsibleSst: {
                id: supplier.supplierResponsibleSST.id,
                name: supplier.supplierResponsibleSST.name,
                role: supplier.supplierResponsibleSST.role,
                phone: supplier.supplierResponsibleSST.phone,
                celphone: supplier.supplierResponsibleSST.celphone,
                email: supplier.supplierResponsibleSST.email
            }
        };

        return this.service.post(this.endpoint + '/responsibleSST', { supplier: supplierReq })
            .map((response) => {
                return new SupplierContact().initializeWithJSON(response.supplierResponsibleSst);
            });
    }

    saveSupplierContact(supplier: Supplier): Observable<SupplierContact> {
        const supplierReq = {
            id: supplier.id,
            supplierContact: {
                id: supplier.supplierContact.id,
                name: supplier.supplierContact.name,
                role: supplier.supplierContact.role,
                phone: supplier.supplierContact.phone,
                celphone: supplier.supplierContact.celphone,
                email: supplier.supplierContact.email
            }
        };

        return this.service.post(this.endpoint + '/contact', { supplier: supplierReq })
            .map((response) => {
                return new SupplierContact().initializeWithJSON(response.supplierContact);
            });
    }

    saveSupplierDocumentationList(supplier: Supplier): Observable<SupplierDocumentation[]> {
        const params = new FormData();

        const supplierReq = {
            id: supplier.id,
            listSupplierDocumentation: supplier.supplierDocumentationList.map(supplierDocumentation => {
                return {
                    id: supplierDocumentation.id,
                    description: supplierDocumentation.description,
                    dueDate: supplierDocumentation.dueDate,
                    accessBlocked: supplierDocumentation.accessBlocked,
                    shelved: supplierDocumentation.shelved,
                    shelvedAt: supplierDocumentation.shelvedAt,
                    originRenew: supplierDocumentation.originRenew ? {
                        id: supplierDocumentation.originRenew.id
                    } : undefined,
                    fileName: supplierDocumentation.fileName,
                    fileUrl: supplierDocumentation.fileUrl,
                    fileIndexLink: supplierDocumentation.file ? supplierDocumentation.file.name + '_[' + supplier.supplierDocumentationList.indexOf(supplierDocumentation) + ']' : undefined
                };
            })
        };

        params.append('supplier', new Blob([JSON.stringify(supplierReq)], { type: 'application/json' }));

        for (const supplierDocumentation of supplier.supplierDocumentationList) {
            if (supplierDocumentation.file !== undefined) {
                params.append('attachments', supplierDocumentation.file, supplierDocumentation.file.name + '_[' + supplier.supplierDocumentationList.indexOf(supplierDocumentation) + ']');
            }
        }

        return this.service.postWithNoHeaders(this.endpoint + '/supplierDocumentation', params)
            .map((response) => {
                return response.supplier.listSupplierDocumentation.map(supplierDocumentation => new SupplierDocumentation().initializeWithJSON(supplierDocumentation));
            });
    }

    updateSupplierAdditionalInformation(supplier: Supplier): Observable<Supplier> {
        const supplierReq = {
            id: supplier.id,
            employerNumber: supplier.employerNumber,
            hasSesmt: supplier.hasSesmt,
            hasCipa: supplier.hasCipa,
            isDesignatedCipa: supplier.isDesignatedCipa
        };

        return this.service.put(this.endpoint + '/additionalInformation', { supplier: supplierReq })
            .map((response) => {
                return new Supplier().initializeWithJSON(response.supplier);
            });
    }

    public printSupplierDocumentationReport(params: any): Observable<File> {
        return this.service.post(this.endpoint + '/printSupplierDocumentationReport', params).map(
            (response) => {
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
            }
        );

    }

}
