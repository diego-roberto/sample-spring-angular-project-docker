import { Risk } from './risk.model';
import { Marker } from './marker.model';
import { ConesWorkers } from './cones-workers.model';
import { ConesAlert } from './cones-alert.model';
import { Clonable } from 'app/shared/util/generic/form/clonable';

export class Cone implements Clonable<Cone> {
    id: number;
    marker: Marker;
    title: string;
    identification: string;
    battery: number;
    statusConnection: boolean;
    dtLastSync: Date;
    active: boolean;
    risks: Risk[];
    workers: ConesWorkers[];
    alerts: ConesAlert[];
    createdAt: Date;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.marker = json.marker ? new Marker().initializeWithJSON(json.marker) : null;
        this.title = json.title;
        this.identification = json.identification;
        this.battery = json.battery;
        this.statusConnection = json.statusConnection;
        this.dtLastSync = json.dtLastSync;
        this.active = json.active;
        this.risks = json.risks ? json.risks.map(risk => new Risk().initializeWithJSON(risk)) : null;
        this.workers = json.workers ? json.workers.map(coneWorker => new ConesWorkers().initializeWithJSON(coneWorker)) : null;
        this.createdAt = json.createdAt;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            marker: this.marker,
            title: this.title,
            identification: this.identification,
            battery: this.battery,
            statusConnection: this.statusConnection,
            dtLastSync: this.dtLastSync,
            active: this.active,
            risks: this.risks ? this.risks.map(risk => risk.toJSON()) : null,
            workers: this.workers ? this.workers.map(worker => worker.toJSON()) : null
        };
    }

    clone(): Cone {
        const cone = Object.assign(new Cone(), this);
        if (cone.marker) {
            const simple = new Marker();
            simple.id = cone.marker.id;
            simple.position = null;
            cone.marker = simple;
        }
        return cone;
    }
}
