import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Worker } from 'app/shared/models/worker.model';
import { Cbos } from 'app/shared/models/cbos.model';
import { FileInfo } from 'app/shared/models/file-info.model';
import { Supplier } from 'app/shared/models/supplier.model';
import { WorkersChart } from '../models/workers-chart.model';
import { Profile } from '../models/profile.model';

@Injectable()
export class WorkerService {

  public worker: Worker;
  private endpointEPIWorkers = '/epi_workers';
  private endpointWorkers = '/workers';
  private endpointAsoAttach = '/aso-attachments';
  private endpointCbos = '/cbos';
  private endpointQualificationsAttach = '/qualification-attachments';
  private endpointWorkersPhoto = '/photo_profile';
  private endpointFunctions = '/functions';
  private endpointLike = '/like';
  private endpointByConstruction = '/byConstruction';

  constructor(private service: HttpClientService) { }

  getWorkerList() {
    return this.service.get(this.endpointWorkers).map(jsonResponse => {
      return jsonResponse.workers.map((jsonWorker) => {
        return new Worker().initializeWithJSON(jsonWorker);
      });
    });
  }

  getWorkerListByFilter(filter: any) {
    return this.service.post(this.endpointWorkers + '/findWorkers', filter).map(jsonResponse => {
      return jsonResponse.workers.map((jsonWorker) => {
        return new Worker().initializeWithJSON(jsonWorker);
      });
    });
  }

  getWorkerListByFilterAndPage(filter: any, pageNumber) {
    return this.service.post(this.endpointWorkers + `/findWorkersByPage?pageNumber=${pageNumber}`, filter).map(jsonResponse => {
      jsonResponse.workers = jsonResponse.workers.map((jsonWorker) => {
        return new Worker().initializeWithJSON(jsonWorker);
      });

      return jsonResponse;
    });
  }

  getWorkersAllowedToEditStatusByPage(pageNumber: number) {
    return this.service.get(this.endpointWorkers + `/findWorkersAllowedToEditStatusByPage?pageNumber=${pageNumber}`)
    .map(jsonResponse => jsonResponse);
  }

  getAllWorkersPaginated(pageNumber) {
    return this.service.post(this.endpointWorkers + `/findWorkersByPage?pageNumber=${pageNumber}`, {})
      .map(jsonResponse => jsonResponse);
  }


  updateAllStatus(workers: any[]) {
    return this.service.put(this.endpointWorkers + '/updateAllStatus', workers).map(jsonResponse => {
      return jsonResponse;
    });
  }

  getAllWorkers() {
    return this.service.get(this.endpointWorkers + '/findAll').map(jsonResponse => {
      return jsonResponse;
    });
  }

  getWorkerNotInConstruction(id: number) {
    return this.service.get(this.endpointWorkers + '/notInConstruction/' + id).map(jsonResponse => {
      return jsonResponse.workers.map((jsonWorker) => {
        return new Worker().initializeWithJSON(jsonWorker);
      });
    });
  }

  getWorkersByConstruction(id: number) {
    return this.service.post(this.endpointWorkers + this.endpointByConstruction, { constructionId: id.toString() }).map(jsonResponse => {
      return jsonResponse.workers.map((jsonWorker) => {
        return new Worker().initializeWithJSON(jsonWorker);
      });
    });
  }

  getActiveWorkersByConstruction(id: number) {
    return this.service.post(this.endpointWorkers + this.endpointByConstruction + '/active', { constructionId: id.toString() }).map(jsonResponse => {
      return jsonResponse.workers.map((jsonWorker) => {
        return new Worker().initializeWithJSON(jsonWorker);
      });
    });
  }

  getActiveNotUsersWorkersByConstruction(constructionId: number, companyId: number) {
    const jsonBody = {
      constructionId:constructionId,
       companyId: companyId
    }    
    return this.service.post(this.endpointWorkers + this.endpointByConstruction + '/active/notUsers', jsonBody).map(jsonResponse => {
      return jsonResponse.workers.map((jsonWorker) => {
        return new Worker().initializeWithJSON(jsonWorker);
      });
    });
  }

  getWorker(id: number) {
    return this.service.get(this.endpointWorkers + '/' + id).map((jsonResponse) => {
      return this.populateWorkerResponse(jsonResponse);
    });
  }

  newWorker() {
    this.worker = new Worker();
    return this.worker;
  }

  private populateWorkerResponse(jsonResponse: any): Worker {
    let worker = new Worker().initializeWithJSON(jsonResponse.worker.worker);
    worker.integration = jsonResponse.worker.integration;

    if (jsonResponse.worker.supplier) {
      worker.supplier = new Supplier().initializeWithJSON(jsonResponse.worker.supplier);
    }

    return worker;
  }

  saveDetailWorker(worker: Worker): Observable<any> {
    return this.service.put(this.endpointWorkers + '/saveDetailWorker', JSON.stringify(worker.toJSON())).map((jsonResponse) => {
      let workerEntity = this.populateWorkerResponse(jsonResponse);
      workerEntity.supplier = worker.supplier;
      worker.id = workerEntity.id;
      return worker;
    });
  }

  saveWorker(worker: Worker): Observable<any> {
    if (worker.id) {
      return this.updateWorker(worker);
    } else {
      return this.createWorker(worker);
    }
  }

  private updateWorker(worker: Worker): Observable<any> {
    return this.service.put(this.endpointWorkers + '/' + worker.id, JSON.stringify(worker.toJSON())).map((jsonResponse) => {
      return new Worker().initializeWithJSON(jsonResponse.worker);
    });
  }

  private createWorker(worker: Worker): Observable<any> {
    return this.service.post(this.endpointWorkers, JSON.stringify(worker.toJSON())).map((jsonResponse) => {
      return new Worker().initializeWithJSON(jsonResponse.worker);
    });
  }

  getWorkerByCpf(cpf: string): Observable<Worker> {
    cpf = cpf.replace(/[^0-9]+/g, '');

    return this.service.get(this.endpointWorkers + '/cpf/' + cpf)
    .map(jsonResponse => {
      if (jsonResponse.worker) {
        const worker = new Worker().initializeWithJSON(jsonResponse.worker);
        worker.supplier.id = jsonResponse.supplier_id;

        return worker;
      } else {
        return new Worker();
      }
    })
  }

  getServiceWorkerCBO(value) {
    return this.service.get(this.endpointCbos + '/' + value).map(jsonResponse => {
      return jsonResponse;
    });
  }

  getWorkerCBOByCodeLike(value) {
    return this.service.get(this.endpointCbos + '/' + value + this.endpointLike).map(jsonResponse => {
      return jsonResponse;
    });
  }

  updateServiceWorkerPhoto(workerDefinition: { id: number, imageFile: File }): Observable<Response> {
    const formData = new FormData();
    formData.append('file', workerDefinition.imageFile);
    return this.service.postWithNoHeaders(this.endpointWorkers + '/' + workerDefinition.id + this.endpointWorkersPhoto, formData).map((jsonResponse) => {
      return jsonResponse;
    });
  }


  uploadWorkers(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.service.postWithNoHeaders(this.endpointWorkers + '/uploadWorkers', formData).map((jsonResponse) => {
      return jsonResponse;
    });
  }

  deleteWorker(worker: Worker) {
    this.service.delete(this.endpointWorkers + '/' + worker.id).subscribe(
      response => { }
    );
  }

  getFunctions(): Observable<Array<any>> {
    return this.service.get(this.endpointWorkers + this.endpointFunctions).map((jsonResponse) => {
      return jsonResponse.cbos.map(cbos => {
        return new Cbos().initializeWithJSON(cbos);
      });
    });
  }

  updateWorkerWithQualificationAttachment(worker: Worker): Observable<any> {
    const formData = new FormData();

    // Put the worker on JSON format in an key named 'worker'
    formData.append('worker', JSON.stringify(worker.toJSON()));

    // Attach the files in an 'attachments' keys
    worker.qualifications.forEach((qualification, i) => {
      if (qualification.attachment) {
        formData.append('attachments', qualification.attachment);
        formData.append('attachments-index', i.toString());
      }
    });

    return this.service.postWithNoHeaders(this.endpointWorkers + '/' + worker.id + this.endpointQualificationsAttach, formData).map(jsonResponse => {
      return new Worker().initializeWithJSON(jsonResponse.worker);
    });
  }

  updateWorkerWithAsoAttachment(worker: Worker): Observable<any> {
    const formData = new FormData();

    formData.append('worker', JSON.stringify(worker.toJSON()));

    worker.aso.forEach((aso, i) => {
      if (aso.attachment) {
        formData.append('attachments', aso.attachment);
        formData.append('attachments-index', i.toString());
      }
    });

    return this.service.postWithNoHeaders(this.endpointWorkers + '/' + worker.id + this.endpointAsoAttach, formData).map(jsonResponse => {
      return new Worker().initializeWithJSON(jsonResponse.worker);
    });
  }

  private serializeWorker(json: Object) {
    const c = new Worker();
    c.initializeWithJSON(json);
    return c;
  }

  public getWorkersByCompany(companyId: number): Observable<Worker[]> {
    return this.service.get(this.endpointWorkers + '/getByCompany/' + companyId).map(jsonResponse => {
      return jsonResponse.workers.map((jsonWorker) => {
        return new Worker().initializeWithJSON(jsonWorker);
      });
    });
  }

  public toPrintEpiReport(workerId: number): Observable<File> {
    return this.service.get(this.endpointWorkers + '/printEpiReport/' + workerId)
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

  updatePassword(params: any): Observable<any> {
    return this.service.post(this.endpointWorkers + '/updatePassword', params).map(
      (response) => {
        return response;
      }
    );
  }

  validatePassword(params: any): Observable<any> {
    return this.service.post(this.endpointWorkers + '/validatePassword', params).map(
      (response) => {
        return response;
      }
    );
  }

  public getAllAdditionalFunctions(): Observable<Worker[]> {
    return this.service.get(this.endpointWorkers + '/getAllAdditionalFunctions').map(jsonResponse => {
      return jsonResponse.listAdditionalFunctions;
    });
  }

  getWorkersChart(filter: any): Observable<WorkersChart[]> {
    return this.service.post(this.endpointWorkers + '/workersChart', filter)
      .map((jsonResponse) => {
        return jsonResponse.response.items.map(item => new WorkersChart().initializeWithJSON(item));
      });
  }

  public toPrintWorkerByConstructionReport(filter: any): Observable<File> {
    return this.service.post(this.endpointWorkers + '/printWorkerByConstructionReport', filter)
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

  public toPrintEPIHistoryReport(filter: any): Observable<File> {
    const initialDate = new Date(filter.initialPeriod)
      .toISOString().split('T')[0].split("-").reverse().join("-");

    const finalDate = new Date(filter.finalPeriod)
      .toISOString().split('T')[0].split("-").reverse().join("-");

    return this.service.get(this.endpointEPIWorkers +
      `/printEpiWorkerByLoanPeriodReport?initialDate=${initialDate} 00:00&finalDate=${finalDate} 00:00`)
      .map(
        (response) => {
          const sFile: string = response.file;
          const byteCharacters = atob(sFile);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          return new File([blob], response.fileName, { type: 'application/pdf' });
        }
      );
  }

  getTurnstileProfiles(): Observable<Profile[]> {
    return this.service.get(this.endpointWorkers + '/turnstile/profile').map(response => {
      const profiles = [];
      for (const profile of response) {
        profiles.push({ value: profile.id, viewValue: profile.description });
      }
      return profiles;
    });
  }
}
