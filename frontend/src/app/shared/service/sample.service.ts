import { Injectable } from '@angular/core';
import { HttpClientService } from "./http-client.service";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sample } from '../model/sample';

interface SampleApiResponse {
  sample: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SampleService {  

  private endpointSample = '/samples';
  
  constructor(
    private service: HttpClientService,
    private http: HttpClient
  ) { }
  
  // getSampleList() {
  //   return this.service.get(this.endpointSample + '/findAll').pipe(
  //     map((jsonResponse: { sample: any[]; }) => {
  //       if (jsonResponse.sample) {
  //         return jsonResponse.sample.map((jsonSample: any) => {
  //           return new Sample().initializeWithJSON(jsonSample);
  //         });
  //       } else {
  //         return [];
  //       }
  //     })
  //   );
  // }
  getSampleList(): Observable<Sample[]> {
    return this.http.get<SampleApiResponse>(`${this.endpointSample}/findAll`).pipe(
      map(response => {
        if (response.sample) {
          return response.sample.map(jsonSample => new Sample().initializeWithJSON(jsonSample));
        } else {
          return [];
        }
      })
    );
  }
    
  // getSampleById(id: number) {
  //   return this.service.get(this.endpointSample + '/id/' + id)
  //     .pipe(map((response: Response) => {
  //       const jsonResponse = response.json();
  //       return new Sample().initializeWithJSON(jsonResponse);
  //     }));
  // }
  getSampleById(id: number): Observable<Sample> {
    return this.http.get<Sample>(`${this.endpointSample}/id/${id}`).pipe(
      map(jsonResponse => new Sample().initializeWithJSON(jsonResponse))
    );
  }
    
  // createSample(sample: Sample) {
  //   return this.service.post(this.endpointSample, sample.toJSON()).pipe(
  //     map((jsonResponse: any) => {
  //       return new Sample().initializeWithJSON(jsonResponse);
  //     })
  //   );
  // }
  createSample(sample: Sample): Observable<Sample> {
    return this.http.post<Sample>(this.endpointSample, sample.toJSON()).pipe(
      map(jsonResponse => new Sample().initializeWithJSON(jsonResponse))
    );
  }
  
  // updateSample(sample: Sample) {
  //   return this.service.put(this.endpointSample + `/${sample.id}`, sample.toJSON()).pipe(
  //     map((jsonResponse: any) => {
  //       return new Sample().initializeWithJSON(jsonResponse);
  //     })
  //   );
  // }
  updateSample(sample: Sample): Observable<Sample> {
    return this.http.put<Sample>(`${this.endpointSample}/${sample.id}`, sample.toJSON()).pipe(
      map(jsonResponse => new Sample().initializeWithJSON(jsonResponse))
    );
  }
  
  // deleteSample(id: number) {
  //   return this.service.delete(this.endpointSample + `/${id}`);
  // }
  deleteSample(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointSample}/${id}`);
  }
  
}