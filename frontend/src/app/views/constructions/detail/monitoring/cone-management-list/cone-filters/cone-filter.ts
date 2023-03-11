import { Observable } from 'rxjs/Observable';

import { Cone } from 'app/shared/models/cone.model';

export interface ConeFilter<T> {

    readonly valueChange: Observable<T>;

    match(cone: Cone): boolean;
}
