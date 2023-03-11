import { SectorsEvents } from './sectors-events';
import { MarkerPosUpdated, ConeUpdated, MarkerAdded, MarkerRemoved } from './sectors-events-types';
import { EventEmitter } from '@angular/core';

export interface SectorsEventsEmitter extends SectorsEvents {
    readonly markerPosUpdated: EventEmitter<MarkerPosUpdated>;
    readonly coneUpdated: EventEmitter<ConeUpdated>;
    readonly markerAdded: EventEmitter<MarkerAdded>;
    readonly markerRemoved: EventEmitter<MarkerRemoved>;
}

export class SectorsEventsEmitterImpl implements SectorsEventsEmitter {
    readonly markerPosUpdated = new EventEmitter<MarkerPosUpdated>();
    readonly coneUpdated = new EventEmitter<ConeUpdated>();
    readonly markerAdded = new EventEmitter<MarkerAdded>();
    readonly markerRemoved = new EventEmitter<MarkerRemoved>();
}
