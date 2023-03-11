import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FileInfo } from 'app/shared/models/file-info.model';
import { Worker } from 'app/shared/models/worker.model';
import { TypeOccurrence } from './../models/occurrence.model';
import { Occurrence, OccurrenceSubType } from 'app/shared/models/occurrence.model';
import { OccurrencesFilter } from 'app/shared/models/occurrences-filter.model';
import { HttpClientService } from './http-client.service';
import { Paginator } from 'app/shared/models/paginator.model';

@Injectable()
export class OccurrenceService {

    private endpoint = '/occurrences';
    public occurrences: Array<Occurrence> = [];

    constructor(
        private http: Http,
        private service: HttpClientService,
        private dialog: MdDialog
    ) { }

    getOccurrenceList(constructionId): Observable<Array<any>> {
        return this.service.get(this.endpoint + '/byConstruction/' + constructionId)
            .map((jsonResponse) => {
                return jsonResponse.occurrences.map(task => {
                    return new Occurrence().initializeWithJSON(task);
                });
            });
    }

    getOccurrence(occurrenceId: number): Observable<any> {
        return this.service.get(this.endpoint + '/' + occurrenceId)
            .map((jsonResponse) => {
                const occurrence = new Occurrence();
                occurrence.id = jsonResponse.occurrence.id;
                occurrence.title = jsonResponse.occurrence.description;
                occurrence.sectorStr = jsonResponse.occurrence.sector;
                occurrence.eventDestination = jsonResponse.occurrence.eventDestination;
                occurrence.scheduleTo = jsonResponse.occurrence.dateTimeOccurrence ? new Date(jsonResponse.occurrence.dateTimeOccurrence) : undefined;

                occurrence.occurrenceType = new TypeOccurrence();
                occurrence.occurrenceType.id = jsonResponse.occurrence.occurrenceTypeId;
                occurrence.occurrenceSubType = new OccurrenceSubType();
                occurrence.occurrenceSubType.id = jsonResponse.occurrence.occurrenceSubTypeId;

                occurrence.workers = jsonResponse.occurrence.workers.map(jsonWorker => {
                    return new Worker().initializeWithJSON(jsonWorker);
                });

                occurrence.files = jsonResponse.occurrence.files.map(jsonFile => {
                    return new FileInfo().initializeWithJSON(jsonFile);
                });

                return occurrence;
            });
    }

    getOccurrenceDetail(occurrenceId): Observable<any> {
        return this.service.get(this.endpoint + '/detail/' + occurrenceId)
            .map((jsonResponse) => {
                return jsonResponse.occurrence;
            });
    }

    verifyOccurrenceDetail(occurrenceId): Observable<any> {
        return this.service.get(this.endpoint + '/detailValidate/' + occurrenceId)
            .map((jsonResponse) => {
                return jsonResponse.occurrence;
            });
    }


    saveOccurrence(occurrence: Occurrence): Observable<any> {
        if (occurrence.id) {
            //TODO chamar a requisição para a edição.
            return this.updateOccurrence(occurrence);
        } else {
            return this.createOcurrence(occurrence);
        }
    }

    private createOcurrence(occurrence: Occurrence): Observable<Occurrence> {
        const params = {
            id: occurrence.id ? occurrence.id.toString() : undefined,
            description: occurrence.title,
            sector: occurrence.sectorStr,
            eventDestination: occurrence.eventDestination,
            dateTimeOccurrence: occurrence.scheduleTo,
            occurrenceTypeId: occurrence.occurrenceType && occurrence.occurrenceType.id ? occurrence.occurrenceType.id.toString() : undefined,
            occurrenceSubTypeId: occurrence.occurrenceSubType && occurrence.occurrenceSubType.id ? occurrence.occurrenceSubType.id.toString() : undefined,
            authorId: occurrence.author && occurrence.author.id ? occurrence.author.id.toString() : undefined,
            workerId: occurrence.workerAuthor && occurrence.workerAuthor.id ? occurrence.workerAuthor.id.toString() : undefined,
            constructionId: occurrence.construction && occurrence.construction.id ? occurrence.construction.id.toString() : undefined,
            companyId: occurrence.companyId ? occurrence.companyId.toString() : undefined,
            workersId: [],
            filesId: []
        };

        for (const file of occurrence.files) {
            if (file.id) {
                params.filesId.push(file.id);
            }
        }

        for (const worker of occurrence.workers) {
            if (worker.id) {
                params.workersId.push(worker.id);
            }
        }

        return this.service.post(this.endpoint, params)
            .map((jsonResponse) => {
                occurrence.id = jsonResponse.response.id;
                return occurrence;
            });
    }

    private updateOccurrence(occurrence: Occurrence): Observable<boolean> {
        const params = new FormData();

        const occurrenceReq = {
            id: occurrence.id ? occurrence.id.toString() : undefined,
            description: occurrence.title,
            occurrenceTypeId: occurrence.occurrenceType && occurrence.occurrenceType.id ? occurrence.occurrenceType.id.toString() : undefined,
            occurrenceSubTypeId: occurrence.occurrenceSubType && occurrence.occurrenceSubType.id ? occurrence.occurrenceSubType.id.toString() : undefined,
            workers: []
        };

        for (const worker of occurrence.workers) {
            if (worker) {
                occurrenceReq.workers.push({ id: worker.id });
            }
        }

        params.append('occurrence', new Blob([JSON.stringify(occurrenceReq)], { type: 'application/json' }));

        for (const file of occurrence.files) {
            if (!file.id) {
                params.append('attachments', file.resourceFile, file.fileName);
            }
        }

        return this.service.putWithNoHeaders(this.endpoint, params).map(
            response => { return true; },
            error => { return false; }
        );
    }

    deleteOccurrence(occurrenceId: number): Observable<boolean> {
        return this.service.delete(this.endpoint + '/' + occurrenceId).map(
            response => { return true; },
            error => { return false; }
        );
    }

    getOccurrenceSubTypeList(occurrenceTypeId): Observable<Array<any>> {
        return this.service.get(this.endpoint + '/occurrenceSubType/' + occurrenceTypeId)
            .map((jsonResponse) => {
                return jsonResponse.listOccurrenceSubType.map(task => {
                    return new OccurrenceSubType().initializeWithJSON(task);
                });
            });
    }

    findOcurrencesByFilter(requestFilter: OccurrencesFilter): Observable<any> {
        return this.service.post(this.endpoint + '/findOccurrencesByFilter', requestFilter.toJSON())
            .map((jsonResponse) => {
                return jsonResponse.response.listOccurrences.map(occurrence => {
                    return new Occurrence().initializeWithJSON(occurrence);
                });
            });
    }

    findAllCountOccurrencesByStatus(beginAt:Date,endAt:Date,intervalType:string,constructionIds:Array<number>): Observable<Array<any>> {
        return this.service.post(this.endpoint + '/findAllCountOccurrencesByStatus',{
            beginAt:beginAt,
            endAt:endAt,
            intervalType:intervalType,
            constructionIds:constructionIds,
        })
            .map((jsonResponse) => {
                return jsonResponse.response;
            });
    }

}
