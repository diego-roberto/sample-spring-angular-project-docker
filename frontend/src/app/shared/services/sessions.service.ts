import { NotificationSidenavService } from './notification-sidenav.service';
import { Injectable } from '@angular/core';
import { HttpClientService, ClientType } from './http-client.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { User } from 'app/shared/models/user.model';
import { Managements } from './../models/managements.model';
import { Observable } from 'rxjs/Observable';
import { Param } from 'app/shared/models/param.model';
import { ConstructionUserProfileService } from './construction-user-profile.service';
import { PermissionService } from './permission.service';
import { Permission } from '../models/permission/permission';

@Injectable()
export class SessionsService {

  private type = ClientType.auth;

  triedRoute: RouterStateSnapshot;

  constructionId: number;
  userLogged: User;
  userPhoto: string;
  ipAddress: string;

  constructor(
    private service: HttpClientService,
    private notificationSidenavService: NotificationSidenavService,
    private constructionUserProfileService: ConstructionUserProfileService,
  ) { }

  login(email: string, password: string) {
    return this.service.post('/sessions', JSON.stringify({ email: email, password: password }), this.type)
      .map((obj) => {
        if (obj.user && obj.user.token) {
          localStorage.setItem('auth_token', obj.user.token);
          this.service.setAuthToken(obj.user.token);

          this.setCurrentUser(obj.user);
          this.notificationSidenavService.subscribeWs();
          this.getIPAddress();
        }
      });
  }

  setCompany(management: Managements) {
    return this.service.post('/sessions/company', management.toJSON(), this.type)
      .map(obj => {
        if (obj.user) {
          if (obj.companyId && obj.companyName) {
            obj.user['companyId'] = obj.companyId;
            obj.user['companyName'] = obj.companyName;
          }

          obj.user['workerId'] = null;
          if (management.workerId && management.workerId > 0) {
            obj.user['workerId'] = management.workerId;
          }

          obj.user['companySesiBelongs'] = obj.companySesiBelongs;
          obj.user['tenantSchema'] = obj.tenantSchema;
          this.setCurrentUser(obj.user);
        }

        if (obj.tenantId && obj.tenantSchema) {
          localStorage.setItem('tenant_id', obj.tenantId);
          localStorage.setItem('tenant_schema', obj.tenantSchema);
        }
        this.updateTenant();
        return obj;
      })
      /*  .flatMap(obj => this.constructionUserProfileService.findAllPermissionOfCurrentUser(this.getCurrentCompany().id,
             this.getCurrent().id).map(permissions => {
                 let current = this.getCurrent();
                 current.permissions=permissions;

                 localStorage.setItem('auth_current', JSON.stringify(current));
             })*/
      ;
  }

  logout() {
    this.notificationSidenavService.endSession();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('tenant_schema');
    localStorage.removeItem('auth_current');
    sessionStorage.removeItem('worker_filter');
    sessionStorage.removeItem('dashboard_filter');
    sessionStorage.removeItem('construction_filter');
    sessionStorage.removeItem('supplier_filter');
    sessionStorage.removeItem('checklist_filter');
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('auth_token') && localStorage.getItem('tenant_id')) {
      this.updateTenant();
      return true;
    }
    return false;
  }

  updateTenant(): void {
    this.service.setAuthToken(localStorage.getItem('auth_token'));
    this.service.setTenantId(localStorage.getItem('tenant_id'));
    this.service.setTenantSchema(localStorage.getItem('tenant_schema'));
  }

  getCurrent(): User {
    const current = localStorage.getItem('auth_current');

    if (current) {
      this.userLogged = new User().initializeWithJSON(JSON.parse(current));
      return this.userLogged;
    } else {
      return undefined;
    }
  }

  getCurrentCompany() {
    const current = localStorage.getItem('auth_current');
    if (current) {
      const aux = JSON.parse(current);
      return { companyId: aux.companyId, companyName: aux.companyName, companySesiBelongs: aux.companySesiBelongs, tenantSchema: aux.tenantSchema };
    } else {
      return undefined;
    }
  }

  setUserPermissions(permissions: Permission[]) {
    const current = localStorage.getItem('auth_current');
    const aux = JSON.parse(current);
    aux.permissions = permissions;
    this.setCurrentUser(aux);

  }

  setCurrentUser(user: User) {
    localStorage.setItem('auth_current', JSON.stringify(user));
    this.userLogged = user;
  }
  setCurrentConstruction(constructionId: number): void {
    this.constructionId = constructionId;
  }
  getCurrentConstruction(): number {

    return this.constructionId;
    /*   const current = localStorage.getItem('auth_current');
       if(current) {
           const aux = JSON.parse(current);
           return {companyId: aux.companyId, companyName: aux.companyName};
       } else {
           return undefined;
       }*/
  }

  getParam(paramId: number): Observable<Param> {
    return this.service.get('/params/' + paramId, this.type).map((jsonResponse) => {
      return new Param().initializeWithJSON(jsonResponse.param);
    });
  }

  getIPAddress() {
    fetch("https://api64.ipify.org/?format=json")
      .then(response => response.json())
      .then((response => {
        this.ipAddress = response.ip;
      }));
  }
}
