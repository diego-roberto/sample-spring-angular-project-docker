import * as Moment from 'moment';

export class QualificationsItem {
    endAt: any;
    beginAt: any;
    qualitiesIDs: any[];

    constructor() { }

    initializeWithJSON(json): QualificationsItem {
        if (!json) { return null; };
        this.beginAt = json.beginAt ? Moment(json.beginAt) : null;
        this.endAt = json.endAt ? Moment(json.endAt) : null;
        this.qualitiesIDs = json.qualitiesIDs ? json.qualitiesIDs : null;
        return this;
    }

    toJSON(): any {
        return {
            beginAt: this.beginAt ? this.beginAt.getTime() : null,
            endAt: this.endAt ? this.endAt.getTime() : null,
            qualitiesIDs: this.qualitiesIDs ? this.qualitiesIDs : null
        };
    }

    toJSONFormat(object: QualificationsItem): any {
        return {
            beginAt: object.beginAt ? Moment(object.beginAt) : null,
            endAt: object.endAt ? Moment(object.endAt) : null,
            qualitiesIDs : object.qualitiesIDs ? object.qualitiesIDs : null
        };
    }

    clone(): QualificationsItem {
        return Object.assign(new QualificationsItem(), this);
    }
}
