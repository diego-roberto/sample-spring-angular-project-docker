import { HttpClientService } from 'app/shared/services/http-client.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Aso, AsoType } from 'app/shared/models/aso.model';

import { FileInfo } from 'app/shared/models/file-info.model';
import { WorkerAsoChart } from 'app/shared/models/worker-aso-chart.model.';

@Injectable()
export class AsoService {
  private endpoint = '/asos';
  private endpointExpiring = '/expiring';

  constructor(private service: HttpClientService) { }

  getExpiringAso(): Observable<Array<any>> {
      return this.service.get(this.endpoint + this.endpointExpiring).map((jsonResponse) => {
          const workers: Map<string, any> = new Map<string, any>();
          return jsonResponse.aso.map(aso => {
              if (aso.worker) {
                  if (typeof aso.worker === 'object') {
                      workers.set(aso.worker['@id'], aso.worker);
                  } else {
                      aso.worker = workers.get(aso.worker);
                  }
              }
              return new Aso().initializeWithJSON(aso);
          });
      });
  }

  public toPrintAsoReport(params: any): Observable<File> {
      return this.service.post(this.endpoint + '/printAsoReport', params).map(
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

  getWorkerAsoChart(filter: any): Observable<WorkerAsoChart[]> {
      return this.service.post(this.endpoint + '/workerAsoChart', filter).map((jsonResponse) => {
          return jsonResponse.response.items.map(item => new WorkerAsoChart().initializeWithJSON(item));
      });
  }

  getAsoTypesList(): Observable<AsoType[]>{
    return this.service.get(`${this.endpoint}/type`);
  }

  deleteAsoType(name: string){
    return this.service.deleteByName(`${this.endpoint}/type`, name);
  }

  saveAsoType(params: AsoType){
    return this.service.post(`${this.endpoint}/type`, params);
  }

  getNrTypesList(){
    return this.service.get(`${this.endpoint}/nr/type`);
  }
}
