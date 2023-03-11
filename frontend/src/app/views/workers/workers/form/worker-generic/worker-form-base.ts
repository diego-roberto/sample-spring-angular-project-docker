import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { FormBase } from 'app/shared/util/generic/form/form-base';
import { Worker } from 'app/shared/models/worker.model';

export abstract class WorkerFormBase<M extends CanMerge<Worker>> extends FormBase<Worker, M> {

    isCreating(): boolean {
        return this.persistedModel.id == null;
    }

    isEditing(): boolean {
        return !this.isCreating();
    }
}
