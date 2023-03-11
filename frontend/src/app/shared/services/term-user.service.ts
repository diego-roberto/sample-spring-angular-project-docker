import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientService, ClientType } from './http-client.service';
import { TermUser } from 'app/shared/models/term-user.model';

@Injectable()
export class TermUserService {
    public termUser: TermUser;
    private endpoint = '/termsUsers';

    private type = ClientType.auth;

    constructor(private service: HttpClientService) { }

    getTermUserList() {
        return this.service.get(this.endpoint + `/findAll/`, this.type).map(jsonResponse => {
            return jsonResponse.termUser.map((jsonTermUser) => {
                return new TermUser().initializeWithJSON(jsonTermUser);
            });
        });
    }

    getTermUserById(id: number) {
        return this.service.get(this.endpoint + `/findById/${id}`, this.type).map(jsonResponse => {
            return jsonResponse.termUser.map((jsonTermUser) => {
                return new TermUser().initializeWithJSON(jsonTermUser);
            });
        });
    }

    getTermUserByUserId(id: number) {
        return this.service.get(this.endpoint + `/findByUserIdAndTermId/${id}`, this.type).map(jsonResponse => {
            return jsonResponse.termUser.map((jsonTermUser) => {
                return new TermUser().initializeWithJSON(jsonTermUser);
            });
        });
    }

    getMaxVersionByUserIdAndTermId(userId: number, termId: number){
            return this.service.get(this.endpoint + `/checkTermUser?userId=${userId}&termTypeId=${termId}`, this.type).map((jsonResponse) => {
            return jsonResponse.termUser.map((jsonTermUser) => {
                return new TermUser().initializeWithJSON(jsonTermUser);
            });
        });
    }
    
    checkTermUser(userId: number, termTypeId: number){
        return this.service.get(this.endpoint + `/checkTermUser?userId=${userId}&termTypeId=${termTypeId}`, this.type).map((jsonResponse) => {
            return jsonResponse ;
        });
    }
    
    saveTermUser(termUser: TermUser): Observable<any> {
        if (termUser.id) {
            return this.updateTermUser(termUser);
        } else {
            return this.createTermUser(termUser);
        }
    }

    private createTermUser(termUser: TermUser): Observable<any> {
        return this.service
        .post(this.endpoint + '/save', JSON.stringify(termUser.toJSON()), this.type)
        .map(jsonResponse => {
            return new TermUser().initializeWithJSON(jsonResponse.termUser);
        });
    }

    private updateTermUser(termUser: TermUser): Observable<any> {
        return this.service
        .put(this.endpoint + `/update?id=${termUser.id}`, JSON.stringify(termUser.toJSON()), this.type)
        .map(jsonResponse => {
            return new TermUser().initializeWithJSON(jsonResponse.termUser);
        });
    }

}