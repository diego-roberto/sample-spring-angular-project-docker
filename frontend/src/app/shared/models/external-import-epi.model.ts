import { Epi } from './epi.model';

export class ExternalImportEpi {
    id: number;
    ca: number;
    due_date: Date;
    situation: boolean;
    approvedTo: string;
    dtLastUpdate: Date;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.ca = json.ca;
        this.due_date = json.due_date;
        this.situation = json.situation;
        this.approvedTo = json.approvedTo;
        this.dtLastUpdate = json.dtLastUpdate;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            ca: this.ca,
            due_date: this.due_date,
            situation: this.situation,
            approvedTo: this.approvedTo,
            dtLastUpdate: this.dtLastUpdate
        };
    }
}
