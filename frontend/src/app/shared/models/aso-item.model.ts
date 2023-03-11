import * as Moment from 'moment';

export class AsoItem {
    endAt: any;
    beginAt: any;

    constructor() { }

    initializeWithJSON(json): AsoItem {
        if (!json) { return null; };
        this.beginAt = json.beginAt ? Moment(json.beginAt) : null;
        this.endAt = json.endAt ? Moment(json.endAt) : null;
        return this;
    }

    toJSON(): any {
        return {
            beginAt: this.beginAt ? this.beginAt.getTime() : null,
            endAt: this.endAt ? this.endAt.getTime() : null,

        };
    }

    toJSONFormat(object: AsoItem): any {
        return {
            beginAt: object.beginAt ? Moment(object.beginAt) : null,
            endAt: object.endAt ? Moment(object.endAt) : null,
        };
    }

    clone(): AsoItem {
        return Object.assign(new AsoItem(), this);
    }
}
