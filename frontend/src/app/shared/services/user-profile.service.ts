import { UserProfile } from './../models/user-profile.model';
import { Observable } from 'rxjs/Rx';
import { ClientType } from './http-client.service';
import { HttpClientService } from 'app/shared/services/http-client.service';
import { Injectable } from '@angular/core';
import { Module } from '../models/module.model';
import { Permission } from '../models/permission/permission';

@Injectable()
export class UserProfileService {

    private type = ClientType.auth;
    private endpoint = '/user_profile';

    constructor(private service: HttpClientService) { }

    getUserProfiles(): Observable<UserProfile[]> {
        return this.service.get(this.endpoint, this.type).map((response) => {
            return response.userProfiles.map((userProfile) => {
                return new UserProfile().initializeWithJSON(userProfile);
            });
        });
    }

    getUserProfile(userProfileId): Observable<UserProfile> {
        return this.service.get(this.endpoint+`/${userProfileId}`, this.type).map((response) => {
            return response.userProfile;
        });
    }

    getModulesByUserProfile(userProfileId): Observable<Module[]> {
        return this.service.get(this.endpoint+`/${userProfileId}/modules`, this.type).map((response) => {
            return response.modules;
        });
    }

    getPermissionsByUserProfile(userProfileId): Observable<Permission[]> {
        return this.service.get(this.endpoint+`/${userProfileId}/permissions`, this.type).map((response) => {
            return response.permissions;
        });
    }

    addPermissionsToUserProfile(userProfileId:number,permissionIds:number[]): Observable<Permission[]> {
        return this.service.post(this.endpoint+`/${userProfileId}/permissions`,permissionIds, this.type).map((response) => {
            return response.permissions;
        });
    }

    addPermissionsToUserProfileModule(userProfileId:number,moduleId:number,permissionIds:number[]): Observable<Permission[]> {
        return this.service.post(this.endpoint+`/${userProfileId}/module/${moduleId}/permissions`,permissionIds, this.type).map((response) => {
            return response.permissions;
        });
    }
}