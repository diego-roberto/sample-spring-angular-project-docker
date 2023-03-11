import { Worker } from './worker.model';
import { Qualities } from './qualities.model';
import * as moment from 'moment';

export class Qualification {

    id: number;
    dueDate: Date;
    attachment: any;
    realizationDate: Date;
    nextDate: Date;
    able: boolean;
    overdue: boolean;
    recycling: boolean;
    shelved: boolean;
    attachmentUrl: string;
    attachmentFilename: string;
    minRealization: any;
    qualities: Qualities;

    workerName: string;

    workerId: number;

    public initializeWithJSON(json: any) {
        this.id = json.id;
        this.able = json.able;
        this.attachment = json.attachment;
        this.realizationDate = json.realizationDate;
        this.nextDate = json.nextDate;
        this.recycling = json.recycling;
        this.qualities = json.qualitiesId ? new Qualities().initializeWithJSON(json.qualitiesId) : null;
        this.workerId = json.worker ? json.worker.id : null;
        this.workerName = json.worker ? json.worker.name : null;
        this.attachmentFilename = json.attachmentFilename;
        this.attachmentUrl = json.attachmentUrl;
        this.shelved = json.shelved;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            dueDate: this.dueDate,
            realizationDate: this.realizationDate,
            nextDate: this.nextDate,
            able: this.able,
            overdue: this.overdue,
            recycling: this.recycling,
            qualitiesId: this.qualities,
            attachmentFilename: this.attachmentFilename,
            attachmentUrl: this.attachmentUrl,
            shelved: this.shelved,
        };
    }
}
