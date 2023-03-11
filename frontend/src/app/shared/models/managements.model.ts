import { User } from 'app/shared/models/user.model';
import { Company } from './company.model';
import { UserProfile } from './user-profile.model';
import { ManagementsProfiles } from './managements-profiles.model';

export class Managements {
    id: number;
    user: User;
    company: Company;
    workerId: number;
    active: number;
    profiles: Array<ManagementsProfiles>;

    public constructor() {
        this.workerId = 0;
        this.user = new User();
        this.company = new Company();
        this.profiles = [];
    }

    public initializeWithJSON(json: any): Managements {
        this.id = json.id;
        this.user = json.user ? new User().initializeWithJSON(json.user) : new User();
        this.company = json.company ? new Company().initializeWithJSON(json.company) : new Company();
        this.profiles = json.profiles;
        this.workerId = json.workerId;
        this.active = json.active;
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            user: this.user,
            company: this.company,
            profiles: this.profiles,
            workerId: this.workerId,
            active: this.active
        };
    }
}
