import { Worker } from 'app/shared/models/worker.model';
import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { Construction } from 'app/shared/models/construction.model';

export class ConstructionWorkersFormModel implements CanMerge<Construction> {

    workers: Worker[];
    id: number;

    initializeWithModel(model: Construction) {
        this.workers = model.workers;
        this.id = model.id;
    }

    merge(model: Construction) {
        model.workers = this.workers;
    }

}
