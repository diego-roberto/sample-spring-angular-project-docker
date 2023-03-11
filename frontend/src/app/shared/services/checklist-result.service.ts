import { ChecklistResultReport } from './../util/json/checklist-result-report';
import { FileInfo } from './../models/file-info.model';
import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { FilesService } from "app/shared/services/files.service";
import { User } from '../models/user.model';


@Injectable()
export class ChecklistResultService {
    private endpoint = '/checklist_result';

    constructor(private service: HttpClientService, private filesService: FilesService) { }

    printChecklistQuestionReport(checklistResultReport: ChecklistResultReport) {
        return this.service.post(this.endpoint + '/print_report', checklistResultReport)
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

    userHasProfileSalesman(user: User) {
      return this.service.get("/users/profile/permission/company/" + user.companyId + "/user/" + user.id + "/profiles/salesman")
        .map((response) => {
            return response;
        })
    }

}
