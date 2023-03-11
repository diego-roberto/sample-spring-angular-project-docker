import { Observable } from 'rxjs/Observable';
import { MarkerPosUpdated, ConeUpdated, MarkerAdded, MarkerRemoved } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-types';

export interface SectorsEvents {
    readonly markerPosUpdated: Observable<MarkerPosUpdated>;
    readonly coneUpdated: Observable<ConeUpdated>;
    readonly markerAdded: Observable<MarkerAdded>;
    readonly markerRemoved: Observable<MarkerRemoved>;
}
