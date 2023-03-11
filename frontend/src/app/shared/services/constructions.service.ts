import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Construction } from '../models/construction.model';
import { Injectable } from '@angular/core';
import { ConstructionCount } from 'app/shared/util/json/construction-count';
import { Subject } from 'rxjs/Subject';
import { DashboardFilter } from '../models/dashboard-filter';
import { FileInfo } from "app/shared/models/file-info.model";

@Injectable()
export class ConstructionsService {

    private readonly endpoint = '/constructions';
    private readonly endpointEssential = '/essential';
    private readonly endpointPaginatedEssential = '/paginatedEssential?pageNumber=';
    private readonly endpointDropDown = '/dropdownConstruction';
    private readonly endpointSectors = '/sectors';
    private readonly endpointCount = '/dependencies/count';
    public constructions: Array<Construction> = [];
    public construction: Construction;

    public changeConstructionObservable: Observable<Construction>;
    private changeConstructionSubject: Subject<Construction>;

    constructor(private service: HttpClientService) {
        this.changeConstructionSubject = new Subject<Construction>();
        this.changeConstructionObservable = this.changeConstructionSubject.asObservable();
    }

    getConstruction(id: number) {

        return this.service.get(this.endpoint + '/' + id).map((jsonResponse) => {
            this.construction = this.serializeConstruction(jsonResponse.construction);
            this.changeConstructionSubject.next(this.construction);
            return Object.assign(new Construction(), this.construction);
        });
    }

    getModules(id: number): Observable<Array<number>> {

        return this.service.get('/constructions/modules/construction/' + id + '/modules').map((jsonResponse) => {
            return jsonResponse.modules;
        });
    }

    saveConstructionModules(construction: Construction, modules: number[]): Observable<Construction> {
        return this.service.post('/constructions/modules/construction/' + construction.id + '/modules', JSON.stringify(
            {
                modules: modules
            }

        )).map((jsonResponse) => {
            return jsonResponse;
        });
    }

    saveUserProfileConstruction(userId: number, constructionsProfiles: any[]): Observable<Construction> {
        return this.service.post('/users/profile/permission/construction/user/' + userId, JSON.stringify(
            constructionsProfiles

        )).map((jsonResponse) => {
            return jsonResponse;
        });
    }

    getConstructions(): Observable<Array<Construction>> {

        return this.service.get(this.endpoint).map((jsonResponse) => {
            return jsonResponse.constructions.map((construction: Construction) => {
                return new Construction().initializeWithJSON(construction);
            });
        });
    }

    getConstructionsEssential(): Observable<Array<Construction>> {
        return this.service.get(this.endpoint + this.endpointEssential).map((jsonResponse) => {
            return jsonResponse.constructions.map((construction: Construction) => {
                return new Construction().initializeWithJSON(construction);
            });
        });
    }

    getConstructionsPaginatedEssential(filter: any, pageNumber) {
        return this.service.post(this.endpoint + this.endpointPaginatedEssential + pageNumber, filter).map((jsonResponse) => {
          jsonResponse.constructions = jsonResponse.constructions.map((jsonConstruction) => {
                return new Construction().initializeWithJSON(jsonConstruction);
            });
            return jsonResponse;
        });
    }

    getDropdownConstruction(): Observable<Array<Construction>> {
        return this.service.get(this.endpoint + this.endpointDropDown).map((jsonResponse) => {
            return jsonResponse.constructions.map((construction: Construction) => {
                return new Construction().initializeWithJSON(construction);
            });
        });
    }

    countDependencies(): Observable<ConstructionCount[]> {
        return this.service.get(this.endpoint + this.endpointCount).map((jsonResponse) => {
            return jsonResponse.counts.map((jsonCount) => {
                return new ConstructionCount().initializeWithJSON(jsonCount);
            });
        });
    }

    newConstruction() {
        this.construction = new Construction();
        return this.construction;
    }

    saveConstruction(construction: Construction): Observable<Construction> {
        if (construction.id) {
            return this.updateConstruction(construction);
        } else {
            return this.createConstruction(construction);
        }
    }

    deleteConstruction(construction: Construction) {
        return this.service.delete(this.endpoint + '/' + construction.id).map((jsonResponse) => {
            return jsonResponse;
        });
    }

    saveConstructionDocumentationList(construction: Construction): Observable<Construction> {
        const params = new FormData();

        const constructionReq = {
            id: construction.id,
            listConstructionDocumentation: construction.constructionDocumentationList.map(constructionDocumentation => {
                return {
                    id: constructionDocumentation.id,
                    description: constructionDocumentation.description,
                    dueDate: constructionDocumentation.dueDate,
                    accessBlocked: constructionDocumentation.accessBlocked,
                    shelved: constructionDocumentation.shelved,
                    shelvedAt: constructionDocumentation.shelvedAt,
                    originRenew: constructionDocumentation.originRenew ? {
                        id: constructionDocumentation.originRenew.id
                    } : undefined,
                    fileName: constructionDocumentation.fileName,
                    fileUrl: constructionDocumentation.fileUrl,
                    fileIndexLink: constructionDocumentation.file ? constructionDocumentation.file.name + '_[' + construction.constructionDocumentationList.indexOf(constructionDocumentation) + ']' : undefined
                };
            })
        };

        params.append('construction', new Blob([JSON.stringify(constructionReq)], { type: 'application/json' }));

        for (const constructionDocumentation of construction.constructionDocumentationList) {
            if (constructionDocumentation.file !== undefined) {
                params.append('attachments', constructionDocumentation.file, constructionDocumentation.file.name + '_[' + construction.constructionDocumentationList.indexOf(constructionDocumentation) + ']');
            }
        }

        return this.service.postWithNoHeaders(this.endpoint + '/constructionDocumentation', params)
            .map((response) => {
                return new Construction().initializeWithJSON(response.construction);
            });
    }

    updateConstructionLogo(construction: { id: number, logoFile: File }): Observable<Construction> {
        const formData = new FormData();
        formData.append('file', construction.logoFile);

        return this.service.postWithNoHeaders(this.endpoint + '/' + construction.id + '/logo', formData).map((response) => {
            return new Construction().initializeWithJSON(response.construction);
        });
    }

    updateConstructionCei(construction: { id: number, ceiFile: File }): Observable<Construction> {
        const formData = new FormData();
        formData.append('file', construction.ceiFile);

        return this.service.postWithNoHeaders(this.endpoint + '/' + construction.id + '/cei', formData).map((response) => {
            return new Construction().initializeWithJSON(response.construction);
        });
    }

    private createConstruction(construction: Construction): Observable<Construction> {
        return this.service.post(this.endpoint, JSON.stringify(construction.toJSON())).map((jsonResponse) => {
            return new Construction().initializeWithJSON(jsonResponse.construction);
        });
    }

    private updateConstruction(construction: Construction): Observable<Construction> {
        return this.service.put(this.endpoint + '/' + construction.id, JSON.stringify(construction.toJSON())).map((jsonResponse) => {
            return new Construction().initializeWithJSON(jsonResponse.construction);
        });
    }

    private serializeConstruction(json: Object) {
        const c = new Construction();
        c.initializeWithJSON(json);
        return c;
    }

    getAllModulesGroupByConstruction(): Observable<Array<any>> {

        return this.service.get('/constructions/modules/findAllModulesGroupByConstruction').map((jsonResponse) => {
            return jsonResponse.modulesByConstruction;
        });
    }

    updateCounterWidget(dashboardFilter: DashboardFilter): Observable<any> {
        return this.service.post(this.endpoint + "/counterWidget", { dashboardFilter: dashboardFilter })
        .map((jsonResponse) => {
            return jsonResponse;
        });
    }

    public printConstructionDocumentationReport(params: any): Observable<File> {
        return this.service.post(this.endpoint + '/printConstructionDocumentationReport', params).map(
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

    public printConstructionChecklistReport(params: any): Observable<File> {
        return this.service.post(this.endpoint + '/printConstructionChecklistReport', params).map(
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
