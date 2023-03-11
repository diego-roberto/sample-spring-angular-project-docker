import { Injectable } from '@angular/core';
import { EnumPermission } from '../models/permission/enum-permission';
import { SessionsService } from './sessions.service';
import { EnumRulePermission } from '../models/permission/enum-rule-permission';
import { Permission } from '../models/permission/permission';
import { RulePermission } from '../models/permission/rule-permission';
import { ParamsRulePermission } from '../models/permission/params-rule-permission';
import { HttpClientService, ClientType } from './http-client.service';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { Module } from '../models/module.model';


@Injectable()
export class PermissionService {

  private type = ClientType.auth;

  constructor(private sessionsService: SessionsService, private service: HttpClientService
  ) { }

  hasPermission(expectedPermission: EnumPermission, params: ParamsRulePermission = null): boolean {
    if (expectedPermission) {
      const permission = this.findPermission(expectedPermission);
      if (permission) {
        if (permission.rule) {
          return this.checkRule(permission, params);
        } else {
          return true;
        }
      }
    }

    return false;
  }

  checkRule(permission: Permission, params: ParamsRulePermission): boolean {
    const rule = permission.rule;

    if (rule.type === EnumRulePermission.RESTRICT_BY_CONTRUCTION) {
      let paramConstructionId = this.sessionsService.getCurrentConstruction();
      if (params && params.constructions && params.constructions.length > 0) {
        paramConstructionId = params.constructions[0];
      }

      const result = rule.params.constructions.filter(
        contructionId => contructionId === paramConstructionId);
      if (result.length > 0) {
        return true;
      }

      return false;
    }

    return false;
  }

  findPermission(expectedPermission: EnumPermission): Permission {
    const permissions = this.sessionsService.getCurrent().permissions;
    if (permissions && permissions.length > 0) {
      const result = permissions.filter(
        permission => permission.type === expectedPermission);

      if (result.length > 0) {

        return result[0];
      }
    }
    return null;
  }

  hasSomePermission(expectedPermissions: EnumPermission[], params: ParamsRulePermission = null): boolean {

    if (expectedPermissions) {
      for (let i = 0; i < expectedPermissions.length; ++i) {
        const expectedPermission = expectedPermissions[i];
        if (this.hasPermission(expectedPermission, params)) {
          return true;
        }

      }
    }
    return false;
  }

  fillTemplate = function (templateString, templateVars) {
    const tpl = templateString.replace(/\${(?!this\.)/g, '${this.');
    return new Function('return `' + tpl + '`;').call(templateVars);
  };




  getUserProfilesByModule(moduleId: number): Observable<UserProfile[]> {
    return this.service.get(`/user_profile/module/${moduleId}`, this.type).map((response) => {
        return response.userProfiles.map((userProfile) => {
            return new UserProfile().initializeWithJSON(userProfile);
        });
    });
  }

  getUserProfileAvailablesByModule(moduleId: number): Observable<UserProfile[]> {
    return this.service.get(`/user_profile/module/${moduleId}/user_profile_availables`, this.type).map((response) => {
        return response.userProfiles.map((userProfile) => {
            return new UserProfile().initializeWithJSON(userProfile);
        });
    });
  }

  getAllPermissionsByModuleAndUserProfile(moduleId: number, userProfileId: number): Observable<Permission[]> {
    return this.service.get(`/user_profile/${userProfileId}/module/${moduleId}/permissions`, this.type).map((response) => {
      return response.permissions;
  });
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.service.get(`/permission/`, this.type).map((response) => {
      return response.permissions;
  });
  }

  getAllModules(): Observable<Module[]> {
    return this.service.get(`/module/`, this.type).map((response) => {
      return response.modules;
  });
  }

  saveModule(module: Module): Observable<Module> {
    return this.service.post('/module', module, this.type)
        .map((jsonResponse) => {
            return jsonResponse.module;
        });
  }

  addProfileToModule(moduleId: number, userProfileId: number[]): Observable<Module> {
    return this.service.post(`/module/${moduleId}/user_profile/${userProfileId}`, {}, this.type)
        .map((jsonResponse) => {
            return jsonResponse.userProfileModule;
        });
  }

  getModuleAvailablesByUserProfile(userProfileId: number): Observable<UserProfile[]> {
    return this.service.get(`/user_profile/${userProfileId}/module/module_availables`, this.type).map((response) => {
        return response.modules;
    });
  }

}
