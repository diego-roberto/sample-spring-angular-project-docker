import { Occurrence } from './occurrence.model';

export class NotificationOccurrence {

    id: number;

    occurrence: Occurrence;

    initializeWithJSON(json: any): NotificationOccurrence {
        this.id = json.id;
        this.occurrence = json.occurrence ? new Occurrence().initializeWithJSON(json.occurrence) : null;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            task: this.occurrence ? this.occurrence.toJSON() : null,
        };
    }
}
