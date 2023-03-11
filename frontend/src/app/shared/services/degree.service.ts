import { Injectable } from '@angular/core';
import { HttpClientService, ClientType } from './http-client.service';
import { Observable } from 'rxjs';
import { Degree } from '../models/degree.model';


@Injectable()
export class DegreeService {

  private type = ClientType.backend;
  private endpoint = '/degree';

  constructor(private service: HttpClientService) { }
  
  getAllDegrees(): Observable<Degree[]> {
    return this.service.get(this.endpoint+'/', this.type).map((response) => {
      return response.degrees;
    });
  }

 saveDegree(degree: Degree): Observable<Degree> {
    return this.service.post(this.endpoint, degree, this.type)
        .map((jsonResponse) => {
            return jsonResponse.degree;
        });
  }
}
