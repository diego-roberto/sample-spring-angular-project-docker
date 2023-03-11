import { Injectable } from "@angular/core";
import { FileInfo } from "../models/file-info.model";
import { HttpClientService, ClientType } from "./http-client.service";

@Injectable()
export class ReportsService {
  private endpoint = "/company";
  private type: ClientType = ClientType.backend;

  constructor(
    private service: HttpClientService,
  ) { }

  findNamesCompaniesByUserLogged() {
    return this.service
      .get(this.endpoint + "/findNamesCompaniesByUserLogged", this.type)
      .map(response => {
        return response;
      });
  }

  findCompaniesAndConstructionsByUserLogged(params: any) {
    return this.service
      .post(this.endpoint + "/findCompaniesAndConstructionsByUserLogged", params, this.type)
      .map(response => {
        return response;
      });
  }

  printCompaniesAndConstructionsReport(params: any) {
    return this.service
      .post(this.endpoint + "/printCompaniesAndConstructionsReport", params, this.type)
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
