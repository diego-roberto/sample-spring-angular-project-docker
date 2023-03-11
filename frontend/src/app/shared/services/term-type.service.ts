import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { TermType } from 'app/shared/models/term-type.model';

@Injectable()
export class TermTypeService {
    public termType: TermType;
    private endpoint = '/termsTypes';

    constructor(private service: HttpClientService) { }

    getTermTypeList() {
        return this.service.get(this.endpoint + '/findAll/').map(jsonResponse => {
            return jsonResponse.termType.map((jsonTermType) => {
                return new TermType().initializeWithJSON(jsonTermType);
            });
        });
    }

    getTermTypeById(id: number) {
        return this.service.get(this.endpoint + '/findById/' + id).map(jsonResponse => {
            return jsonResponse.termType.map((jsonTermType) => {
                return new TermType().initializeWithJSON(jsonTermType);
            });
        });
    }

    getTermTypeByDescription(description: string) {
        return this.service.get(this.endpoint + '/findByDescription/' + description).map(jsonResponse => {
            return jsonResponse.termType.map((jsonTermType) => {
                return new TermType().initializeWithJSON(jsonTermType);
            });
        });
    }

    saveTermType(termType: TermType) {
        if (termType.id) {
          return this.updateTermType(termType);
        } else {
          return this.createTermType(termType);
        }
      }
    
      private createTermType(termType: TermType) {
        return this.service
          .post(this.endpoint, JSON.stringify(termType.toJSON()))
          .map(jsonResponse => {
            return new TermType().initializeWithJSON(jsonResponse.termType);
          });
      }
    
      private updateTermType(termType: TermType) {
        return this.service
          .put(this.endpoint + "/update/" + termType.id, JSON.stringify(termType.toJSON()))
          .map(jsonResponse => {
            return new TermType().initializeWithJSON(jsonResponse.termType);
          });
      }
}
