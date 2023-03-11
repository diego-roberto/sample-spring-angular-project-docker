import { ChecklistStatus } from './../models/checklist-status.model';
import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';

import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistSession } from './../models/checklist-session.model';
import { ChecklistReplicateProccess } from '../models/checklist-replicate-proccess.model';
import { PotentialEmbargoChart } from 'app/shared/models/potential-embargo-chart.model';
import { PotentialPenaltyChart } from 'app/shared/models/potential-penalty-chart.model';
import { PotentialPenaltyDetailChart } from 'app/shared/models/potential-penalty-detail-chart.model';
import { FileInfo } from '../models/file-info.model';
import * as FileSaver from "file-saver";

@Injectable()
export class ChecklistService {
  private endpoint = '/checklist';
  private questionsEndpoint = '/checklistQuestions';

  constructor(private service: HttpClientService) { }

  getChecklistById(id: number): Observable<any> {
    return this.service.get(this.endpoint + '/' + id).map(jsonResponse => {
      return new Checklist().initializeWithJSON(jsonResponse.checklist);
    });
  }

  getChecklistIndexes(session: ChecklistSession[]) {
    let questionIndex = 0;
    const questionIndexes: Map<number, number> = new Map<number, number>();

    for (const questionSession of session) {
      for (const question of questionSession.checklistQuestions) {
        questionIndex++;
        questionIndexes.set(question.id, questionIndex);
      }
    }
    return questionIndexes;
  }

  getChecklistList() {
    return this.service.get(this.endpoint).map(jsonResponse => {
      return jsonResponse.checklists.map((jsonChecklist) => {
        return new Checklist().initializeWithJSON(jsonChecklist);
      });
    });
  }

  getChecklistListWithState(idUser: number, idConstruction: number) {
    return this.service.get(this.endpoint + '/checklistwithstate/' + idUser + '/' + idConstruction).map(jsonResponse => {
      return jsonResponse.checklists.map((jsonChecklist) => {
        return new Checklist().initializeWithJSON(jsonChecklist);
      });
    });
  }

  getChecklistChart(): Observable<Checklist[]> {
    return this.service.get(this.endpoint + '/checklistChart').map(jsonResponse => {
      return jsonResponse.checklists.map((jsonChecklist) => {
        return new Checklist().initializeWithJSON(jsonChecklist);
      });
    });
  }

  filter(checklists: Checklist[]): FilteredChecklist[] {
    const filteredChecklist: FilteredChecklist[] = [];
    const today = new Date();

    checklists.forEach((checklist) => {

      filteredChecklist.push({ checklist: checklist });
    });
    return filteredChecklist;
  }

  deleteChecklist(id: number): Observable<any> {
    return this.service.delete(this.endpoint + '/' + id)
      .map((response) => {
        return response;
      });
  }

  saveChecklist(checklist: Checklist): Observable<Checklist> {
    return this.service.post(this.endpoint + '/save', checklist)
      .map((response) => {
        return new Checklist().initializeWithJSON(response.checklist);
      });
  }

  getChecklistStatusList(): Observable<ChecklistStatus[]> {
    return this.service.get(this.endpoint + '/status')
      .map((response) => {
        return response.checklistStatusList.map(checklistStatus => new ChecklistStatus().initializeWithJSON(checklistStatus));
      });
  }

  replicate(id: number, companiesId: number[]) {
    return this.service.post(this.endpoint + '/' + id + '/replicate', companiesId).map(jsonResponse => {
      return new Checklist().initializeWithJSON(jsonResponse.checklist);
    });
  }

  getChecklistProccessStatusList(id: number) {
    return this.service.get(this.endpoint + '/' + id + '/replicate/status').map(jsonResponse => {
      return jsonResponse.listChecklistReplicateProccess.map((jsonChecklist) => {
        return jsonChecklist as ChecklistReplicateProccess;
      });
    });
  }

  getPotentialPenaltyChart(filter: any): Observable<PotentialPenaltyChart[]> {
    return this.service.post(this.endpoint + '/potentialPenaltyChart', filter)
      .map((jsonResponse) => {
        return jsonResponse.response.items.map(item => new PotentialPenaltyChart().initializeWithJSON(item));
      });
  }

  getPotentialPenaltyDetailChart(filter: any): Observable<PotentialPenaltyDetailChart[]> {
    return this.service.post(this.endpoint + '/potentialPenaltyDetailChart', filter)
      .map((jsonResponse) => {
        return jsonResponse.response.itemsDetail.map(item => new PotentialPenaltyDetailChart().initializeWithJSON(item));
      });
  }

  getPotentialEmbargoChart(filter: any): Observable<PotentialEmbargoChart[]> {
    return this.service.post(this.endpoint + '/potentialEmbargoChart', filter)
      .map((jsonResponse) => {
        return jsonResponse.response.items.map(item => new PotentialEmbargoChart().initializeWithJSON(item));
      });
  }

  hasPendingChecklistQuestions(idChecklistAnswer: number): Observable<any> {
    return this.service.get(`${this.questionsEndpoint}/hasPendingChecklistQuestions/${idChecklistAnswer}`).map(jsonResponse => jsonResponse);
  }

  printChecklistReport(params: any): Observable<File> {
    return this.service.post(
      this.endpoint + '/printChecklistReport', params
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

  printChecklistReportXML(params: any): Observable<File> {
    return this.service.post(
      this.endpoint + '/printChecklistReportXml', params).map(
        (jsonResponse) => {
        const fileInfo: FileInfo = new FileInfo().initializeWithJSON(jsonResponse);
        const sFile: string = fileInfo.file;

        const blob = new Blob([sFile], { type: fileInfo.fileType });

        FileSaver.saveAs(blob, fileInfo.fileName);
        
        return new File([blob], fileInfo.fileName, { type: fileInfo.fileType });
      });
    }
  }

export interface FilteredChecklist {
  checklist: Checklist;
  // tslint:disable-next-line:eofline
}
