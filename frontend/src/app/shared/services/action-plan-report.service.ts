import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { FilesService } from './files.service';
import { FileInfo } from '../models/file-info.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ActionPlanReportService {
    private endpoint = '/action-plan-report';

    constructor(private service: HttpClientService, private filesService: FilesService) { }

    public printActionPlane(actionPlanId: number): Observable<File> {
        return this.service.get(this.endpoint + '/' + actionPlanId)
            .map(
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