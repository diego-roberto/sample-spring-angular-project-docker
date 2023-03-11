import { Worker } from './worker.model';
import { Cone } from './cone.model';

export class ConesAlert {
    id: number;
    cone: Cone;
    alert: string;
    dateAlert: Date;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.cone = json.cone ? new Cone().initializeWithJSON(json.cone) : null;
        this.alert = json.alert;
        this.dateAlert = json.date_alert;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            cone: this.cone ? this.cone.toJSON() : null,
            alert: this.alert,
            date_alert: this.dateAlert
        };
    }
}
