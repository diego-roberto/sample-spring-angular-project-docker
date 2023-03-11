import { Permission } from './permission/permission';

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: Permission[];
    active: boolean;
    companyId: number;
    userProfileId: number;
}

export class User implements IUser {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: Permission[];
    active: boolean;
    token: string;
    companyId: number;
    userProfileId: number;
    workerId: number;
    photoUrl: string ;
    photoFilename: string ;

    public constructor() { }

    public initializeWithJSON(json: any): User {
        this.id = Number.parseInt(json.id);
        this.name = json.name;
        this.email = json.email;
        this.role = json.role;
        this.active = json.active;
        this.token = json.token;
        this.companyId = json.companyId;
        this.userProfileId = json.userProfileId;
        this.workerId = json.workerId;
        this.permissions = json.permissions;
        this.photoUrl = json.photoUrl;
        this.photoFilename = json.photoFilename;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            active: this.active,
            permissions: this.permissions,
            token: this.token,
            photoUrl: this.photoUrl ,
            photoFilename: this.photoFilename ,
        };
    }
}
