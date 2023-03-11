import { Injectable } from '@angular/core';
import { HttpClientService } from 'app/shared/services/http-client.service';
import { Observable } from 'rxjs/Observable';
import { FileInfo } from 'app/shared/models/file-info.model';

@Injectable()
export class FilesService {

  private readonly endpoint = '/files';
  private readonly endpointInfo = '/info';
  private readonly endpointChecklistQuestionAnswer = '/uploadFileChecklistQuestionAnswer';
  private readonly endpointFilesByFunctionality = '/getFilesByFunctionality';
  private readonly endpointFilesAndReplicatedFilesdByFunctionality = '/getFilesAndReplicatedFilesByFunctionality';

  constructor(private service: HttpClientService) { }

  uploadFile(functionality: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('functionality', functionality);
    formData.append('multipartFile', file);

    return this.service.postWithNoHeaders(this.endpoint, formData).map((response) => {
      return new FileInfo().initializeWithJSON(response);
    });
  }

  replicate(id: number, companiesId: number[]) {
    return this.service.post(this.endpoint + '/' + id + '/replicate', companiesId).map(jsonResponse => {
      return new FileInfo().initializeWithJSON(jsonResponse.file);
    });
  }

  uploadFileChecklistQuestionAnswer(functionality: string, file: File, idFunctionality: string): Observable<any> {
    const formData = new FormData();
    formData.append('functionality', functionality);
    formData.append('file', file);
    formData.append('idFunctionality', idFunctionality);

    return this.service.postWithNoHeaders(this.endpoint + this.endpointChecklistQuestionAnswer, formData).map((response) => {
      return new FileInfo().initializeWithJSON(response);
    });
  }

  downloadFile(id: number): Observable<any> {
    return this.service.get(this.endpoint + '/' + id).map((response) => {
      const fileInfo: FileInfo = new FileInfo().initializeWithJSON(response);

      const file: string = fileInfo.file;

      const byteCharacters = atob(file);

      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: fileInfo.fileType });

      return new File([blob], fileInfo.fileName, { type: fileInfo.fileType });
    });
  }

  getFileInfo(id: number): Observable<any> {
    return this.service.get(this.endpoint + this.endpointInfo + '/' + id).map((response) => {
      return new FileInfo().initializeWithJSON(response);
    });
  }

  deleteFile(id: number): Observable<any> {
    return this.service.delete(this.endpoint + '/' + id).map(
      response => response
    );
  }

  getFilesByFunctionality(functionality: string): Observable<any> {
    return this.service.get(this.endpoint + this.endpointFilesByFunctionality + '/' + functionality).map(
      response => response.files
    );
  }

  getFilesAndReplicatedFilesByFunctionality(functionality: string): Observable<any> {
    return this.service.get(this.endpoint + this.endpointFilesAndReplicatedFilesdByFunctionality + '/' + functionality).map(
      response => response.files
    );
  }
}
