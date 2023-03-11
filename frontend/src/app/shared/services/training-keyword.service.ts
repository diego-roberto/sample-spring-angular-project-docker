
import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs/Observable';
import { TrainingKeyword } from '../models/training-keyword.model';


@Injectable()
export class TrainingKeywordService {
    private endpoint = '/training_keywords';

    constructor(private service: HttpClientService) { }

    getKeywords(): Observable<Array<TrainingKeyword>> {
        return this.service.get(this.endpoint).map(jsonResponse => {
            return jsonResponse.keywords.map((jsonKeyword) => {
                return new TrainingKeyword().initializeWithJSON(jsonKeyword);
            });
        });
    }
}
