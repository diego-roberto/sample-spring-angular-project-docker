import { HttpClientService } from './http-client.service';
import { Qualification } from 'app/shared/models/qualification.model';
import { Worker } from 'app/shared/models/worker.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FileInfo } from "app/shared/models/file-info.model";
import { WorkerQualificationChart } from "app/shared/models/worker-qualification-chart.model.";

@Injectable()
export class QualificationsService {

    private endpoint = '/qualifications';
    private list = '/list';
    private workers = '/workers';
    private atachment = '/attachment';
    private endpointExpiring = '/expiring';

    constructor(private service: HttpClientService) { }

    getQualificationsList(): Observable<Array<any>> {
        return this.service.get(this.endpoint + this.list)
            .map((jsonResponse) => {
                return jsonResponse.qualification.map(qualification => {
                    return new Qualification().initializeWithJSON(qualification);
                });
            });
    }

    getQualificationsWorkersList(quality: number): Observable<Array<Worker>> {
        return this.service.get(this.endpoint + this.workers + '/' + quality)
            .map((jsonResponse) => {
                return jsonResponse.qualificationWorkers.map(workers => {
                    return new Worker().initializeWithJSON(workers);
                });
            });
    }

    deleteQualification(qualification: Qualification) {
        this.service.delete(this.endpoint + '/' + qualification.id).subscribe(
            response => { }
        );
    }

    updateQualificationAtachment(qualification: Qualification) {
        const formData = new FormData();
        formData.append('file', qualification.attachment);
        return this.service.postWithNoHeaders(this.endpoint + this.atachment + '/' + qualification.id, formData).map((jsonResponse) => {
            return jsonResponse;
        });
    }

    getExpiringQualifications(): Observable<Array<any>> {
        return this.service.get(this.endpoint + this.endpointExpiring).map((jsonResponse) => {
            const workers: Map<String, any> = new Map<String, any>();
            return jsonResponse.qualification.map(qualification => {
                if (qualification.worker) {
                    if (typeof qualification.worker === 'object') {
                        workers.set(qualification.worker['@id'], qualification.worker);
                    } else {
                        qualification.worker = workers.get(qualification.worker);
                    }
                }
                return new Qualification().initializeWithJSON(qualification);
            });
        });
    }

    public toPrintQualificationReport(params: any): Observable<File> {
        return this.service.post(this.endpoint + '/printQualificationReport', params).map(
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

    getWorkerQualificationChart(filter: any): Observable<WorkerQualificationChart[]> {
        return this.service.post(this.endpoint + '/workerQualificationChart', filter).map((jsonResponse) => {
            return jsonResponse.response.items.map(item => new WorkerQualificationChart().initializeWithJSON(item));
        });
    }    

}
