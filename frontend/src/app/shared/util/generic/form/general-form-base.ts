import { ActivatedRoute } from '@angular/router/router';
import { Observable } from 'rxjs/Observable';
import { Subscribable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ItemResolver } from 'app/shared/util/generic/form/item-resolver';
import { EventSave } from 'app/shared/util/generic/form/event-save';
import { Clonable } from 'app/shared/util/generic/form/clonable';
import { CanMerge } from 'app/shared/util/generic/form/can-merge';

export abstract class GeneralFormBase<T extends Clonable<T>> {

    constructor(private itemResolver: ItemResolver<T>) {
    }

    /*
     * =========================|
     * Flow mathods             |
     * =========================|
     */
    protected genericSave(
        event: EventSave<T>,
        saveMethod: (self: GeneralFormBase<T>, modelToSave: T) => Observable<T>,
        onSaved?: (persistedModel: T) => Observable<any> | void,
        complete: () => void = () => { }) {

        const cloneToPersist = this.getValue().clone();

        event.modelToSave.merge(cloneToPersist);

        this.handleModelBeforeSave(cloneToPersist);

        saveMethod(this, cloneToPersist).subscribe(

            persistedModel => {

                this.execOnSavedEvent(persistedModel, onSaved).subscribe(

                    anyValue => {
                        // Everything is being did in onComplete method
                    },

                    error => {
                        this.handleAfterSaveError(error);
                    },

                    () => {
                        this.handleModelAfterSave(cloneToPersist, persistedModel);

                        this.notifyChange(event.modelToSave, persistedModel);

                        if (event.onSaved) { event.onSaved(persistedModel); }

                        complete();
                    }
                );
            },
            error => {
                if(error._body.includes('the request was rejected because its size')){
                  this.notifyUser("ARQUIVO MUITO GRANDE, LIMITE MÁXIMO DE 50MB!")
                }else{
                  this.handleSaveError(error);
                }
            }
        );
    }

    protected notifyChange(mergeableModel: CanMerge<T>, persistedModel: T) {
        // O objeto que foi salvo precisa receber as informações do objeto que voltou do servidor.
        // Essa implementação não pode estar no FormBase para não recarregar os outros forms que não
        // foram persistidos.
        mergeableModel.initializeWithModel(persistedModel);

        this.fireModification(persistedModel);
    }

    protected requestCloneToSave(): T {
        return this.getValue().clone();
    }

    protected loadInitialInstance() {
        const initialObservableInstance = this.getInitialInstance();

        if (!initialObservableInstance) {
            throw new Error('The initial instance or the promise to get it was not provided.');
        }

        if (initialObservableInstance instanceof Observable) {
            initialObservableInstance.subscribe((initialInstance: T) => {
                this.fireModification(initialInstance);
            });
        } else {
            this.fireModification(initialObservableInstance);
        }
    }

    private fireModification(instance: T) {
        this.itemResolver.setValue(instance);
    }

    protected getValue(): T {
        return this.itemResolver.getValue();
    }

    /*
     * =========================|
     * Abstract methods         |
     * =========================|
     */
    protected abstract getInitialInstance(): Observable<T> | T;

    protected handleSaveError(error) {
      console.log({ error });

      this.notifyUser('Erro no servidor!');
    }

    protected handleAfterSaveError(error) { this.notifyUser('O registro foi salvo mas alguma operação seguinte falhou.'); }

    protected handleModelBeforeSave(modelToSave: T): void { }

    protected handleModelAfterSave(sentModel: T, receivedModel: T): void { }

    protected abstract notifyUser(message: string);

    /*
     * =========================|
     * Auxiliar methods         |
     * =========================|
     */
    private execOnSavedEvent(persistedModel: T, onSaved?: (persistedModel: T) => Observable<any> | void): Subscribable<any> {
        const subject = new Subject<any>();

        if (onSaved) {
            let observable;
            if (observable = onSaved(persistedModel)) {
                observable.subscribe(
                    anyValue => {
                        subject.next(anyValue);
                        subject.complete();
                    },
                    error => {
                        subject.error(error);
                        subject.complete();
                    }
                );
            } else {
                subject.complete();
            };

        } else {
            subject.complete();
        }

        return subject.asObservable();
    }
}
