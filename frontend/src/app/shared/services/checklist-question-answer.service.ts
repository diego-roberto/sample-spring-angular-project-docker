import { ChecklistQuestionAnswer } from 'app/shared/models/checklist-question-answer.model';
import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';

import { ChecklistQuestionAnswersSessionsCount } from 'app/shared/util/json/checklist-question-answers-sessions-count';

@Injectable()
export class ChecklistQuestionAnswerService {
  private endpoint = '/checklist_question_answer';
  private fileEndpoint = '/filesChecklistQuestionAnswer';

  private countSession = '/count/sessions/';
  private appliedChecklistsChart = '/findAppliedChecklistsChartByPeriod';
  private countAppliedChecklists = '/countAppliedChecklistsByPeriod';
  private appliedChecklistsDetailsChart = '/findAppliedChecklistsDetailsChartByPeriod';
  private appliedChecklistsDetailsFilter = '/findAppliedChecklistsDetailsFilter';
  private byChecklistAnswer = '/findByChecklistAnswer';
  private filesByIdChecklistQuestionAnswer = '/findByIdChecklistQuestionAnswer';

  constructor(private service: HttpClientService) { }

  countAnswersSession(id: number, checklistId: number) {
    return this.service.get(this.endpoint + this.countSession + id + '/' + checklistId).map(jsonResponse => {
      return jsonResponse.answersBySession.map((jsonAnswersBySession) => {
        return new ChecklistQuestionAnswersSessionsCount().initializeWithJSON(jsonAnswersBySession);
      });
    });
  }

  saveChecklistQuestionAnswer(checklistQuestionAnswer: ChecklistQuestionAnswer): Observable<ChecklistQuestionAnswer> {
    if (checklistQuestionAnswer.id) {
      return this.updateChecklistQuestionAnswer(checklistQuestionAnswer);
    } else {
      return this.createChecklistQuestionAnswer(checklistQuestionAnswer);
    }
  }

  private createChecklistQuestionAnswer(checklistQuestionAnswer: ChecklistQuestionAnswer) {
    return this.service.post(this.endpoint, checklistQuestionAnswer.toJSON()).map(
      (response) => {
        return new ChecklistQuestionAnswer().initializeWithJSON(response.checklistQuestionAnswer);
      }
    );
  }

  private updateChecklistQuestionAnswer(checklistQuestionAnswer: ChecklistQuestionAnswer): Observable<ChecklistQuestionAnswer> {
    return this.service.put(this.endpoint + '/' + checklistQuestionAnswer.id,
      checklistQuestionAnswer.toJSON())
      .map((response) => {
        return new ChecklistQuestionAnswer().initializeWithJSON(response.checklistQuestionAnswer);
      });
  }

  findAppliedChecklistsChartData(beginAt: Date, endAt: Date, intervalType: string, constructionIds: Array<number>): Observable<Array<any>> {
    return this.service.post(this.endpoint + this.appliedChecklistsChart, {
      beginAt: beginAt,
      endAt: endAt,
      intervalType: intervalType,
      constructionIds: constructionIds,
    }).map((jsonResponse) => {
      return jsonResponse.response;
    });
  }

  countAppliedChecklistsByPeriod(beginAt: Date, endAt: Date, constructionIds: Array<number>): Observable<Array<any>> {
    return this.service.post(this.endpoint + this.countAppliedChecklists, {
      beginAt: beginAt,
      endAt: endAt,
      intervalType: null,
      constructionIds: constructionIds,
    }).map((jsonResponse) => {
      return jsonResponse.response;
    });
  }

  findAppliedChecklistsDetailsChartData(beginAt: Date, endAt: Date, intervalType: string, constructionIds: Array<number>, checklistsIDs: number[]) {
    return this.service.post(this.endpoint + this.appliedChecklistsDetailsChart, {
      beginAt: beginAt,
      endAt: endAt,
      intervalType: intervalType,
      constructionIds: constructionIds,
      checklistsIDs: checklistsIDs
    }).map((jsonResponse) => {
      return jsonResponse.response;
    });
  }

  findAppliedChecklistsDetailsFilters(beginAt: Date, endAt: Date, constructionIds: Array<number>): Observable<Array<any>> {
    return this.service.post(this.endpoint + this.appliedChecklistsDetailsFilter, {
      beginAt: beginAt,
      endAt: endAt,
      intervalType: null,
      constructionIds: constructionIds
    }).map((jsonResponse) => {
      return jsonResponse.response;
    });
  }

  findByChecklistAnswer(idAnswer: number): Observable<Array<any>> {
    return this.service.get(this.endpoint + this.byChecklistAnswer + '/' + idAnswer).map(jsonResponse => {
      return jsonResponse.questionAnswers.map((jsonQuestionAnswers) => {
        return new ChecklistQuestionAnswer().initializeWithJSON(jsonQuestionAnswers);
      });
    });
  }

  findChecklistQuestionAnswerImages(idAnswer: number) {
    return this.service.get(`${this.fileEndpoint}${this.filesByIdChecklistQuestionAnswer}/${idAnswer}`).map((response) => {
      return response;
    });
  }
}
