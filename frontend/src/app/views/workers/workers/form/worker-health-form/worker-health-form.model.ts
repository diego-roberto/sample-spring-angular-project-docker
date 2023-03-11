import { CanMergeWorker } from '../worker-generic/can-merge-worker';
import { Worker } from 'app/shared/models/worker.model';
import { Aso } from 'app/shared/models/aso.model';


export class WorkerHealth implements CanMergeWorker {

    bloodType: string;

    diseases: string;

    allergies: string;

    asos: Array<Aso> = [];

    integration: boolean;

    initializeWithModel(model: Worker) {
        this.bloodType = model.bloodType;
        this.allergies = model.allergies;
        this.diseases = model.diseases;
        this.asos = model.aso ? model.aso : [];
        this.integration = model.integration;
    }

    merge(model: Worker) {
        model.bloodType = this.bloodType;
        model.allergies = this.allergies;
        model.diseases = this.diseases;
        model.integration = this.integration;
        model.aso = this.asos;
    }
}
