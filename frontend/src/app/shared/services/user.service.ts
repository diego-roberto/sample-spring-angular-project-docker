import { Injectable } from '@angular/core';
import { HttpClientService, ClientType } from './http-client.service';
import { Observable } from 'rxjs/Observable';

import { User } from 'app/shared/models/user.model';
import { UserAdmin } from 'app/shared/models/user-admin.model';

@Injectable()
export class UserService {

    private endpoint = '/users';
    private type = ClientType.auth;

    constructor(
        private service: HttpClientService
    ) { }

    getUsers(): Observable<Array<User>> {
        return this.service.get(this.endpoint, this.type)
            .map((response) => {
                return response.users.map((user) => {
                    return new User().initializeWithJSON(user);
                });
            });
    }

    getUserById(id: number): Observable<User> {
        return this.service.get(this.endpoint + '/' + 'id', this.type)
            .map((response) => {
                return new User().initializeWithJSON(response.user);
            }
            );
    }

    getUsersByCompanyId(companyId: number): Observable<Array<User>> {
        return this.service.get(this.endpoint + '/byCompany/' + companyId)
            .map((response) => {
                return response.users.map((user) => {
                    return new User().initializeWithJSON(user);
                });
            });
    }

    getUsersAdminByCompanyId(companyId: number): Observable<Array<UserAdmin>> {
        return this.service.get(this.endpoint + '/findUsersAdminByCompanyId/' + companyId, this.type)
            .map((response) => {
                const listUserAdmin = response.listUsersAdmin.map((user) => {
                    return new UserAdmin().initializeWithJSON(user);
                });

                return listUserAdmin;
            });
    }

    updateUserDetails(user: User, file: File, changePasswordRequest: any) {
        const params = new FormData();

        if (file) {
            params.append('attachments', file, file.name);
        }
        if (changePasswordRequest) {
            params.append('changePassword', new Blob([JSON.stringify(changePasswordRequest)], { type: 'application/json' }));
        }

        return this.service.putWithNoHeaders(this.endpoint + '/' + user.id + '/detail', params, this.type)
            .map((response) => {
                return response;
            });
    }
}
