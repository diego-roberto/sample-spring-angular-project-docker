import * as moment from 'moment';
import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { Worker } from './worker.model';

export class Security implements CanMerge<Worker> {
    cipeiro: boolean;
    brigade: boolean;
    laborsInCipa: string;

    mandateBegin: any;
    mandateEnd: any;

    constructor() { }

    public initializeWithJSON(json: any) {

        this.cipeiro = json.cipeiro;
        this.brigade = json.brigade;
        this.laborsInCipa = json.laborCipa;

        this.mandateBegin = json.mandateBegin;
        this.mandateEnd = json.mandateEnd;

        return this;
    }

    initializeWithModel(model: Worker) {
        this.cipeiro = model.security.cipeiro;
        this.brigade = model.security.brigade;
        this.laborsInCipa = model.security.laborsInCipa;
        this.mandateBegin = model.security.mandateBegin;
        this.mandateEnd = model.security.mandateEnd;
    }

    merge(model: Worker) {
        model.security = this;
    }

    public toJSON() {

        return {
            cipeiro: this.cipeiro,
            brigade: this.brigade,
            laborsInCipa: this.laborsInCipa,
        };
    }
}
