import { CanMerge } from 'app/shared/util/generic/form/can-merge';

export declare interface EventSave<T> {

    modelToSave: CanMerge<T>;

    onSaved(modelSaved: T): void;

    onError?(error: any): void;
}
