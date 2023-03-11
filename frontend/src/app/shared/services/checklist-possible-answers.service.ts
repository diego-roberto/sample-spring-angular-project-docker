import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';
import { ChecklistPossibleAnswers } from '../models/checklist-possible-answers.model';

@Injectable()
export class ChecklistPossibleAnswersService {
    private endpoint = '/checklist_possible_answers';

    constructor(private service: HttpClientService) { }

    getChecklistPossibleAnswers(): Observable<Array<ChecklistPossibleAnswers>> {
        return this.service.get(this.endpoint).map((jsonResponse) => {
            return jsonResponse.checklistPossibleAnswers.map((checklistPossibleAnswers: ChecklistPossibleAnswers) => {
                return new ChecklistPossibleAnswers().initializeWithJSON(checklistPossibleAnswers);
            });
        });
    }
    // tslint:disable-next-line:eofline
}
