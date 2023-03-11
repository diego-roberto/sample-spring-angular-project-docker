import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Cone } from 'app/shared/models/cone.model';
import { ConeFilter } from './cone-filter';

@Injectable()
export class ConeFilterOption implements ConeFilter<any> {

    private optionObservable = new BehaviorSubject<ConeFilterOptions>(null);

    readonly options = ConeFilterOptions;

    match(cone: Cone): boolean {
        if (!this.option) {
            return true;
        }

        switch (this.option) {
            case this.options.ONLINE:
                return cone.statusConnection;

            case this.options.OFFLINE:
                return !cone.statusConnection;

            case this.options.ACTIVE:
                return cone.active;

            case this.options.INACTIVE:
                return !cone.active;
        };

        return true;
    }

    get valueChange(): Observable<any> {
        return this.optionObservable.asObservable();
    }

    set option(option: ConeFilterOptions) {
        this.optionObservable.next(option);
    }

    get option(): ConeFilterOptions {
        return this.optionObservable.getValue();
    }
}

export enum ConeFilterOptions {
    ONLINE = 'Online',
    OFFLINE = 'Offline',
    ACTIVE = 'Ativo',
    INACTIVE = 'Inativo'
}
