import { User } from './user.model';
import { environment } from 'environments/environment';

import * as Moment from 'moment';
import { Clonable } from '../util/generic/form/clonable';

export class Assessment implements Clonable<Assessment> {
    id: number;
    origem: string;
    referenciaOrigem: number;
    date: Date;

    public constructor() { }

    public initializeWithJSON(json: any): Assessment {
        this.id = json.id;
        this.origem = json.origem;
        this.referenciaOrigem = json.number;
        this.date = json.date;

        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            origem: this.origem,
            referenciaOrigem: this.referenciaOrigem,
            date: this.date
        };
    }

    public toUpdateJSON() {
        return {
            id: this.id,
            origem: this.origem,
            referenciaOrigem: this.referenciaOrigem,
            date: this.date
        };
    }

    clone(): Assessment {
        const assessment = Object.assign(new Assessment(), this);
        return assessment;
    }
}
