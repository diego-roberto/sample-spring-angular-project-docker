import { Clonable } from 'app/shared/util/generic/form/clonable';
import { CanMerge } from 'app/shared/util/generic/form/can-merge';
import { ItemResolver } from 'app/shared/util/generic/form/item-resolver';

export abstract class FormBase<T extends Clonable<T>, M extends CanMerge<T>> {

    persistedModel: T;

    model: M;

    constructor(protected itemResolver: ItemResolver<T>) {
        this.itemResolver.getSubject().subscribe(worker => {
            this.persistedModel = worker.clone();

            if (this.model == null) {
                this.model = this.create();
                this.model.initializeWithModel(this.persistedModel);
            }
        });
    }

    /**
     * Check if the CRUD is creating a new value.
     */
    abstract isCreating();

    /**
     * Check if the CRUD is editing a new value.
     */
    abstract isEditing();

    /**
     * Create a instance of the CanMerge used on the toggle.
     */
    protected abstract create(): M;
}
