import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientService, ClientType } from './http-client.service';
import { Term } from 'app/shared/models/term.model';

@Injectable()
export class TermService {
    public term: Term;
    private endpoint = '/terms';

    private type = ClientType.auth;

    constructor(private service: HttpClientService) { }

    getTermList() {
        return this.service.get(this.endpoint + `/findAll/`, this.type).map(jsonResponse => {
            return jsonResponse.term.map((jsonTerm) => {
                return new Term().initializeWithJSON(jsonTerm);
            });
        });
    }

    getTermById(id: number) {
        return this.service.get(this.endpoint + `/findById?id=${id}`, this.type).map(jsonResponse => {
            return jsonResponse.term.map((jsonTerm) => {
                return new Term().initializeWithJSON(jsonTerm);
            });
        });
    }

    getTermByTermTypeId(id: number) {
        return this.service.get(this.endpoint + `/findByTermTypeId?id=${id}`, this.type).map(jsonResponse => {
            return jsonResponse.term.map((jsonTerm) => {
                return new Term().initializeWithJSON(jsonTerm);
            });
        });
    }

    getMaxVersionByTermTypeId(id: number) {
        return this.service.get(this.endpoint + `/findMaxVersionByTermTypeId?id=${id}`, this.type).map(jsonResponse => {
            return new Term().initializeWithJSON(jsonResponse);
        });
    }

    saveTerm(term: Term): Observable<any> {
        if (term.id) {
          return this.updateTerm(term);
        } else {
          return this.createTerm(term);
        }
      }
    
    private createTerm(term: Term): Observable<any> {
        return this.service
        .post(this.endpoint + '/save', JSON.stringify(term.toJSON()), this.type)
        .map(jsonResponse => {
            return new Term().initializeWithJSON(jsonResponse.term);
        });
    }

    private updateTerm(term: Term): Observable<any> {
        return this.service
        .put(this.endpoint + `/update?id=${term.id}`, JSON.stringify(term.toJSON()), this.type)
        .map(jsonResponse => {
            return new Term().initializeWithJSON(jsonResponse.term);
        });
    }
}
