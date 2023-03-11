import * as moment from 'moment';

export class Recycling {
    attachment: any;
    dueDate: Date;
    validityStart: Date;
    periodicity: number;
    isApt: boolean;

    constructor() {
        this.isApt         = true;
        this.attachment    = null;
        this.dueDate       = null;
        this.validityStart = null;
        this.periodicity   = 0;
    }
}
