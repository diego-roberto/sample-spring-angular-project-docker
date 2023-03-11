import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, Subject } from 'rxjs';
import { Permission } from '../models/permission/permission';

@Injectable()
export class ConstructionUserProfileService {

  private readonly endpoint = '/users/profile/';
 
  public changeConstructionUserPermissionsObservable: Observable<string>;
  private changeConstructionUserPermissionsSubject: Subject<string>;

  constructor(private service: HttpClientService) {
    this.changeConstructionUserPermissionsSubject = new Subject<string>();
    this.changeConstructionUserPermissionsObservable = this.changeConstructionUserPermissionsSubject.asObservable();
  }

  findAllPermissionOfUserInConstruction(constructionId: number): Observable<Array<string>>  {



    return this.service.get(this.endpoint + '/permission/construction/' + constructionId).map((jsonResponse) => {
      return jsonResponse.permissions.map((permission: string) => {
        return permission;
    });
  
    });
  }


    
    findAllPermissionOfCurrentUser(companyId:number): Observable<Array<Permission>>  {

    

      return this.service.get( `/users/profile/permission/company/${companyId}/user/` ).map((jsonResponse) => {
        return jsonResponse.permissions.map((permission: Permission) => {
          return permission;
      });

    });
    
    }

    findAllProfileModulesGroupByConstructionOfUser(companyId:number,userId:number): Observable<any>  {

      return this.service.get( `/users/profile/permission/company/${companyId}/user/${userId}/profiles` ).map((jsonResponse) => {
          return jsonResponse;

      });
    
    }


    canAddUserProfile(userProfileId:number,constructionId:number): Observable<any>  {

      return this.service.get( `/users/profile/permission/canAddUserProfile/${userProfileId}/construction/${constructionId}` ).map((jsonResponse) => {
          return jsonResponse;

      });
    
    }

    
    findAllProfileModulesGroupByConstruction(companyId:number): Observable<any>  {

      return this.service.get( `/users/profile/permission/company/${companyId}/profiles` );
    
    }

 

}
