import { environment } from 'environments/environment';

import { User } from './user.model';
import { Checklist } from 'app/shared/models/checklist.model';
import { Company } from './company.model';
import { ChecklistStatus } from './checklist-status.model';
import { ChecklistSession } from './checklist-session.model';

import * as Moment from 'moment';
import { Clonable } from '../util/generic/form/clonable';
import { UserProfile } from './user-profile.model';

export class ChecklistProfileCompany implements Clonable<ChecklistProfileCompany> {
    id: number;
    checklist: Checklist;
    profile: UserProfile;

    public constructor() { }

    public initializeWithJSON(json: any): ChecklistProfileCompany {
        this.id = json.id;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
        };
    }

    public toUpdateJSON() {
        return {
            id: this.id,
        };
    }

    clone(): ChecklistProfileCompany {
        const checklist = Object.assign(new ChecklistProfileCompany(), this);
        return checklist;
    }
}
