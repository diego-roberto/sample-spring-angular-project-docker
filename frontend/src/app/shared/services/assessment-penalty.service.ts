import { ChecklistPenalty } from './../util/json/checklist-penalty';
import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { ChecklistSession } from 'app/shared/models/checklist-session.model';

@Injectable()
export class AssessmentPenaltyService {
    private endpoint = '/assessmentPenalty';
    private penalty = '/penalty';

    constructor(private service: HttpClientService) { }

    getChecklistPenalty(sessions: ChecklistSession[], answerId: number, numWorkers: number) {
        const params = {
            answerId: answerId,
            numWorkers: numWorkers,
            sessions: sessions.map(x => x.toJSON())
        };
        return this.service.post(this.endpoint + this.penalty, JSON.stringify(params)).map(jsonResponse => {
            return new ChecklistPenalty().initializeWithJSON(jsonResponse.checklistPenalty);
        });
    }
}
