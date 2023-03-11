import { Clonable } from 'app/shared/util/generic/form/clonable';
import { Checklist } from './checklist.model';
import { ChecklistQuestion } from './checklist-question.model';

export class ChecklistConstructionInfo implements Clonable<ChecklistConstructionInfo> {

    name: string;
    cei: string;
    address: string;
    contact: string;
    phone: string;
    email: string;
    numWorks: number;

    initializeWithJSON(json) {
        this.name = json.name ? json.name : '';
        this.cei = json.cei ? json.cei : '';
        this.address = json.address ? json.address : '';
        this.contact = json.contact ? json.contact : '';
        this.phone = json.phone ? json.phone : '';
        this.email = json.email ? json.email : '';
        this.numWorks = json.numWorks ? json.numWorks : '';

        return this;
    }

    toJSON() {
        return {
            name: this.name,
            cei: this.cei,
            address: this.address,
            contact: this.contact,
            phone: this.phone,
            email: this.email,
            numWorks: this.numWorks
        };
    }

    clone(): ChecklistConstructionInfo {
        const checklistConstructionInfo = Object.assign(new ChecklistConstructionInfo(), this);

        return checklistConstructionInfo;
    }
}
