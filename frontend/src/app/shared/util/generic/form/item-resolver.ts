import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export declare interface ItemResolver<T> {

    getSubject(): BehaviorSubject<T>;

    setValue(value: T);

    getValue(): T;
}
