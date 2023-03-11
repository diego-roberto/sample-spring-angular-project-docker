import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { Worker } from 'app/shared/models/worker.model';

export interface CanMergeWorker extends CanMerge<Worker> {

    merge(model: Worker);
}
