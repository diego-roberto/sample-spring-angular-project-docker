import { HttpClientService } from './http-client.service';
import { Qualities } from 'app/shared/models/qualities.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QualitiesService {
  private endpoint = '/qualities';

  constructor(private service: HttpClientService) { }

  getQualitiesList(): Observable<Array<any>> {
    return this.service.get(this.endpoint)
    .map((jsonResponse) => {
        return jsonResponse.qualities.map(qualities => {
            return new Qualities().initializeWithJSON(qualities);
        });
    });
  }

  saveQuality(params: { id: number; name: string; }): Observable<any> {
    return this.service.post(this.endpoint, params);
  }

  deleteQuality(name: string): Observable<any> {
    return this.service.deleteByName(`${this.endpoint}`, name);
  }
}
