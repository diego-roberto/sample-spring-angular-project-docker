import { Worker } from './worker.model';
import { Cone } from './cone.model';

export class ConesWorkers {
    id: number;
    cone: Cone;
    worker: Worker;
    permission: boolean;

    initializeWithJSON(json: any) {
        this.id = json.id;
        this.cone = json.cone ? new Cone().initializeWithJSON(json.cone) : null;
        this.worker = json.worker ? new Worker().initializeWithJSON(json.worker) : null;
        this.permission = json.permission;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            cone: this.cone ? this.cone.toJSON() : null,
            worker: this.worker ? this.worker.toJSON() : null,
            permission: this.permission
        };
    }
}
