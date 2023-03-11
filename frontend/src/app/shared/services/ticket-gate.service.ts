import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileInfo } from "../models/file-info.model";
import { HttpClientService } from "./http-client.service";
import * as FileSaver from "file-saver";

@Injectable()
export class TicketGateService {
  private endpoint = "/ticketGateAccessEvents";

  constructor(
    private service: HttpClientService,
  ) { }

  constructionsNames(): Observable<Array<any>> {
    return this.service.get(this.endpoint + '/constructionsNames').map((jsonResponse) => {
      return jsonResponse.constructions;
    });
  }

  findSuppliersNames(type: string): Observable<Array<any>> {
    return this.service.get(this.endpoint + '/findSuppliersNames?contractType=' + type).map((jsonResponse) => {
      return jsonResponse.suppliers;
    });
  }

  printViewTicketGateAccessEventsReport(params: any): Observable<File> {
    return this.service.post(
      this.endpoint + '/printViewTicketGateAccessEventsReport', params
    ).map((jsonResponse) => {
      const fileInfo: FileInfo = new FileInfo().initializeWithJSON(jsonResponse);
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

  printViewTicketGateAccessEventsReportXML(params: any): Observable<File> {
    return this.service.post(
      this.endpoint + '/printViewTicketGateAccessEventsReportXml', params
    ).map((jsonResponse) => {

      const fileInfo: FileInfo = new FileInfo().initializeWithJSON(jsonResponse);
      const sFile: string = fileInfo.file;

      const blob = new Blob([sFile], { type: fileInfo.fileType });

      FileSaver.saveAs(blob, fileInfo.fileName);

      return new File([blob], fileInfo.fileName, { type: fileInfo.fileType });
    });
  }
}
