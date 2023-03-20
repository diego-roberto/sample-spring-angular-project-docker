import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class HttpClientService {

  private url = "http://localhost:8082";
  private dockerizedUrl = "https://backend.docker.localhost";

  constructor(private http: HttpClient) { }

  private standardHeaders(): HttpHeaders {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.set('X-Authorization', '');

    return headers;
  }

  private blankHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Authorization': ""
    });
  }

  post(path: String, params: any): Observable<any> {
    return this.http
      .post(this.url + path, params, {
        headers: this.standardHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(map((response: any) => (response.length > 0 ? JSON.parse(response) : {})));
  }

  postWithNoHeaders(path: string, params: any): Observable<any> {
    return this.http.post<any>(`${this.url}${path}`, params, { headers: this.blankHeaders() });
  }

  putWithNoHeaders(path: string, params: any): Observable<any> {
    return this.http.put<any>(`${this.url}${path}`, params, { headers: this.blankHeaders() });
  }

  get(path: string): Observable<any> {
    return this.http.get<any>(`${this.url}${path}`, { headers: this.standardHeaders() });
  }

  getAbsolutePath(path: string): string {
    return `${this.url}${path}`;
  }

  put(path: string, params: any): Observable<any> {
    return this.http.put<any>(`${this.url}${path}`, params, { headers: this.standardHeaders() });
  }

  delete(path: string): Observable<any> {
    return this.http.delete<any>(`${this.url}${path}`, { headers: this.standardHeaders() });
  }

  deleteByName(path: string, body: any): Observable<any> {
    const options = {
      headers: this.standardHeaders(),
      body: { name: body }
    };
    return this.http.delete<any>(`${this.url}${path}`, options);
  }

}

