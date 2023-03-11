import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ConeFilter } from './cone-filter';
import { Cone } from 'app/shared/models/cone.model';

@Injectable()
export class ConeFilterTextSearch implements ConeFilter<string> {

    private textObservable = new BehaviorSubject<string>(null);

    match(cone: Cone): boolean {
        if (this.text && this.text !== '') {
            return (cone.title && cone.title.toLowerCase().indexOf(this.text.toLowerCase()) > -1) ||
                (cone.identification && cone.identification.indexOf(this.text) > -1);
        }
        return true;
    }

    get valueChange(): Observable<string> {
        return this.textObservable.asObservable();
    }

    set text(text: string) {
        this.textObservable.next(text);
    }

    get text(): string {
        return this.textObservable.getValue();
    }
}
