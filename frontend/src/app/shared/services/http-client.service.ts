import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishLast';

@Injectable()
export class HttpClientService {

  private url = environment.backendUrl;
  private authToken;
  private tenantId;
  tenantSchema;

  constructor(private http: Http) { }

  setClientType(type?: ClientType) {
    switch (type) {
      case ClientType.auth:
        this.url = environment.authUrl;
        break;
      case ClientType.backend:
        this.url = environment.backendUrl;
        break;
      default:
        this.url = environment.backendUrl;
        break;
    }
  }

  standardHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this.authToken) {
      headers.append('X-Authorization', this.authToken);
    }
    if (this.tenantId) {
      headers.append('X-Tenant-ID', this.tenantId);
    }
    if (this.tenantSchema) {
      headers.append('X-Tenant-Schema', this.tenantSchema);
    }
    return { headers: headers };
  }

  blankHeaders() {
    const headers = new Headers();
    if (this.authToken) {
      headers.append('X-Authorization', this.authToken);
    }
    if (this.tenantId) {
      headers.append('X-Tenant-ID', this.tenantId);
    }
    if (this.tenantSchema) {
      headers.append('X-Tenant-Schema', this.tenantSchema);
    }
    return { headers: headers };
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  setTenantSchema(tenantSchema: string) {
    this.tenantSchema = tenantSchema;
  }

  post(path: String, params: any, type?: ClientType) {
    this.setClientType(type);
    return this.http.post(this.url + path, params, this.standardHeaders()).map((response: Response) => {
      return response.text().length > 0 ? response.json() : {};
    });
  }

  postWithNoHeaders(path: String, params: any, type?: ClientType) {
    this.setClientType(type);
    return this.http.post(this.url + path, params, this.blankHeaders()).publishLast().refCount().map((response: Response) => {
      return response.text().length > 0 ? response.json() : {};
    });
  }

  putWithNoHeaders(path: String, params: any, type?: ClientType) {
    this.setClientType(type);
    return this.http.put(this.url + path, params, this.blankHeaders()).map((response: Response) => {
      return response.text().length > 0 ? response.json() : {};
    });
  }

  get(path: string, type?: ClientType) {
    this.setClientType(type);
    return this.http.get(this.url + path, this.standardHeaders()).map((response: Response) => {
      return response.json();
    });
  }

  getAbsolutePath(path: string, type?: ClientType) {
    this.setClientType(type);
    return this.url + path;
  }

  put(path: String, params, type?: ClientType) {
    this.setClientType(type);
    return this.http.put(this.url + path, params, this.standardHeaders()).map((response: Response) => {
      return response.text().length > 0 ? response.json() : {};
    });
  }

  delete(path: string, type?: ClientType) {
    this.setClientType(type);
    return this.http.delete(this.url + path, this.standardHeaders()).map((response: Response) => {
      return response;
    });
  }

  deleteByName(path: string, body: any, type?: ClientType) {
    this.setClientType(type);
    return this.http.delete(this.url + path, { headers: this.standardHeaders().headers, body: {name: body}}).map((response: Response) => {
      return response;
    });
  }
}

export enum ClientType {
  backend = 1,
  auth = 0
}
