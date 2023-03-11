import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';
import { ChecklistAnswer } from '../models/checklist-answer.model';
import { ChecklistQuestionsAnswersCount } from '../util/json/checklist-questions-answers-count';

@Injectable()
export class ChecklistAnswerService {
  private endpoint = '/checklist_answer';
  private readonly endpointCount = '/answers/count';
  private readonly endpointLastChecklistAnswers = '/lastAnswers';
  private readonly endpointAccomplishedChecklistAnswers = '/accomplished';

  constructor(private service: HttpClientService) { }

  getChecklistAnswerById(id: number) {
    return this.service.get(this.endpoint + '/' + id).map((jsonResponse) => {
      return new ChecklistAnswer().initializeWithJSON(jsonResponse.checklistAnswer);
    });
  }

  getChecklistAnswerByChecklistId(id: number) {
    return this.service.get(this.endpoint + '/checklist/' + id).map(jsonResponse => {
      return jsonResponse.checklistAnswers.map((jsonEquipmentTypes) => {
        return new ChecklistAnswer().initializeWithJSON(jsonEquipmentTypes);
      });
    });
  }

  getAccomplishedChecklistAnswerByChecklistId(idConstrution: number, idChecklist: number) {
    return this.service.get(this.endpoint + '/' + idConstrution + this.endpointAccomplishedChecklistAnswers + '/' + idChecklist).map(jsonResponse => {
      return jsonResponse.checklistAnswers.map((jsonEquipmentTypes) => {
        return new ChecklistAnswer().initializeWithJSON(jsonEquipmentTypes);
      });
    });
  }

  getLastChecklistAnswersByConstructionId(idConstrution: number) {
    return this.service.get(this.endpoint + this.endpointLastChecklistAnswers + '/' + idConstrution).map(jsonResponse => {
      return jsonResponse.checklistAnswers.map((jsonChecklistAnswers) => {
        return new ChecklistAnswer().initializeWithJSON(jsonChecklistAnswers);
      });
    });
  }

  getChecklistAnswerByIdAndUser(id: number, idUser: number, idConstruction: number) {
    return this.service.get(this.endpoint + '/' + id + '/' + idUser + '/' + idConstruction).map(jsonResponse => {
      return new ChecklistAnswer().initializeJSON(jsonResponse.checklistAnswer);
    });
  }

  getChecklistAnswersByIdAndUser(id: number, idUser: number, idConstruction: number) {
    return this.service.get(this.endpoint + '/' + id + '/' + idUser + '/' + idConstruction).map(jsonResponse => {
      return jsonResponse.checklistAnswers.map((jsonChecklistAnswers) => {
        return new ChecklistAnswer().initializeJSON(jsonChecklistAnswers);
      });
    });
  }

  saveChecklistAnswer(answer: ChecklistAnswer): Observable<ChecklistAnswer> {
    if (answer.id) {
      return this.updateAnswer(answer);
    } else {
      return this.createAnswer(answer);
    }
  }

  private createAnswer(answer: ChecklistAnswer) {
    return this.service.post(this.endpoint, answer.toJSON()).map(
      (response) => {
        return new ChecklistAnswer().initializeWithJSON(response.checklistAnswer);
      }
    );
  }

  private updateAnswer(answer: ChecklistAnswer): Observable<ChecklistAnswer> {
    return this.service.put(this.endpoint + '/' + answer.id, JSON.stringify(answer.toJSON()))
      .map((jsonResponse) => {
        return new ChecklistAnswer().initializeWithJSON(jsonResponse.checklistAnswer);
      });
  }

  countAnswers(id: number): Observable<ChecklistQuestionsAnswersCount> {
    return this.service.get(this.endpoint + this.endpointCount + '/' + id).map((jsonResponse) => {
      return new ChecklistQuestionsAnswersCount().initializeWithJSON(jsonResponse.answerCount);
    });
  }

  deleteVerifyExistsChecklistAnswerAndDelete(id: number, idUser: number, idConstruction: number) {
    this.service.delete(this.endpoint + '/' + id + '/' + idUser + '/' + idConstruction).subscribe(
      response => { }
    );
  }
}
