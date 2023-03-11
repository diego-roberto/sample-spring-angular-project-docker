import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Assessment } from '../models/assessment.model';

@Injectable()
export class AssessmentService {
    private endpoint = '/assessment';

    constructor(private service: HttpClientService) { }

    getEpiTypeList() {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.epiTypes.map((jsonAssessments) => {
                return new Assessment().initializeWithJSON(jsonAssessments);
            });
        });
    }
}
