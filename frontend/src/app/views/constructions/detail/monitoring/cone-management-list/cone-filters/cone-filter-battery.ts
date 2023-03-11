import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Cone } from 'app/shared/models/cone.model';
import { ConeFilter } from './cone-filter';

@Injectable()
export class ConeFilterBattery implements ConeFilter<any> {

    private lowObservable = new BehaviorSubject<boolean>(true);
    private midObservable = new BehaviorSubject<boolean>(true);
    private fullObservable = new BehaviorSubject<boolean>(true);

    private finalObservable = Observable.merge(this.lowObservable, this.midObservable, this.fullObservable);

    match(cone: Cone): boolean {
        return (this.low && cone.battery < 10)
            || (this.mid && cone.battery < 30 && cone.battery >= 10)
            || (this.full && cone.battery >= 30);
    }

    get valueChange(): Observable<any> {
        return this.finalObservable;
    }

    set low(low: boolean) {
        this.lowObservable.next(low);
    }

    get low(): boolean {
        return this.lowObservable.getValue();
    }

    set mid(mid: boolean) {
        this.midObservable.next(mid);
    }

    get mid(): boolean {
        return this.midObservable.getValue();
    }

    set full(full: boolean) {
        this.fullObservable.next(full);
    }

    get full(): boolean {
        return this.fullObservable.getValue();
    }
}
