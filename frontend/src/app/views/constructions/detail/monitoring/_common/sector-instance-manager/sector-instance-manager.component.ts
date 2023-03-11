import { Input, OnChanges, OnDestroy, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { SectorsEvents } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events';
import { MarkerLocation, FloorLocation, ConeUpdated, MarkerPosUpdated, MarkerRemoved, MarkerAdded } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-types';
import { SectorsEventsEmitter, SectorsEventsEmitterImpl } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-emitter';

import { Cone } from 'app/shared/models/cone.model';
import { Sector } from 'app/shared/models/sector.model';
import { Marker } from 'app/shared/models/marker.model';
import { Floor } from 'app/shared/models/floor.model';

export abstract class SectorInstanceManagerComponent implements OnChanges, OnDestroy {

    somethingChanged = new EventEmitter<void>();

    @Input()
    sectors: Sector[];

    @Input()
    private sectorsEvents: SectorsEvents;

    private sectorsEventsEmitter: SectorsEventsEmitter = new SectorsEventsEmitterImpl();

    private ngUnsubscribeAbstract = new Subject();

    ngOnChanges(changes: SimpleChanges) {
        if (this.checkIfContainsAndValidateEvent(changes)) {
            this.monitoreMarkerPosUpdated(this.sectorsEvents.markerPosUpdated.takeUntil(this.ngUnsubscribeAbstract));
            this.monitoreConeUpdated(this.sectorsEvents.coneUpdated.takeUntil(this.ngUnsubscribeAbstract));
            this.monitoreMarkerAdded(this.sectorsEvents.markerAdded.takeUntil(this.ngUnsubscribeAbstract));
            this.monitoreMarkerRemoved(this.sectorsEvents.markerRemoved.takeUntil(this.ngUnsubscribeAbstract));
        }

        Observable.merge(
            this.events.markerPosUpdated,
            this.sectorsEvents.coneUpdated,
            this.sectorsEvents.markerAdded,
            this.sectorsEvents.markerRemoved
        )
            .takeUntil(this.ngUnsubscribeAbstract)
            .subscribe(() => this.somethingChanged.emit());
    }

    ngOnDestroy() {
        this.ngUnsubscribeAbstract.next();
        this.ngUnsubscribeAbstract.unsubscribe();
    }

    protected abstract onSyncError(error: Error);

    get events(): SectorsEvents {
        return this.sectorsEventsEmitter;
    };

    private monitoreMarkerPosUpdated(observable: Observable<MarkerPosUpdated>) {
        observable.subscribe(change => {
            this.getMarker(change.markerLocation).subscribe(
                marker => {
                    marker.position = change.position;

                    this.sectorsEventsEmitter.markerPosUpdated.emit(change);
                },
                error => {
                    this.onSyncError(error);
                }
            );
        });
    }

    private monitoreConeUpdated(observable: Observable<ConeUpdated>) {
        observable.subscribe(change => {
            this.getMarker(change.markerLocation).subscribe(
                marker => {
                    if (this.validateConeMarker(marker)) {
                        marker.cone.initializeWithJSON(change.cone);
                        this.sectorsEventsEmitter.coneUpdated.emit({ markerLocation: change.markerLocation, cone: marker.cone });
                    } else {
                        this.onSyncError(new Error('The marker ' + change.markerLocation + ' is not a cone'));
                    }
                },
                error => {
                    this.onSyncError(error);
                }
            );
        });
    }

    private monitoreMarkerAdded(observable: Observable<MarkerAdded>) {
        observable.subscribe(change => {
            this.getFloor(change.floorLocation).subscribe(
                floor => {
                    floor.markers = !floor.markers ? [] : floor.markers;
                    if (floor.markers.findIndex(marker => marker.id === change.marker.id) === -1) {
                        const marker = change.marker.clone();
                        floor.markers.push(marker);

                        this.sectorsEventsEmitter.markerAdded.emit({ floorLocation: change.floorLocation, marker: marker });
                    } else {
                        this.onSyncError(new Error('The marker ' + change.floorLocation + ' was already added'));
                    }

                },
                error => {
                    this.onSyncError(error);
                }
            );
        });
    }

    private monitoreMarkerRemoved(observable: Observable<MarkerRemoved>) {
        observable.subscribe(change => {
            this.getFloor(change.markerLocation).subscribe(
                floor => {
                    floor.markers = !floor.markers ? [] : floor.markers;

                    const index = floor.markers.findIndex(marker => marker.id === change.markerLocation.markerId);

                    if (index > -1) {
                        floor.markers.splice(index, 1);
                        this.sectorsEventsEmitter.markerRemoved.emit(change);
                    } else {
                        this.onSyncError(new Error('The marker ' + change.markerLocation + ' was not found'));
                    }
                },
                error => {
                    this.onSyncError(error);
                }
            );
        });
    }

    private checkIfContainsAndValidateEvent(changes: SimpleChanges) {
        if (changes['sectorsEvents']) {
            if (changes['sectorsEvents'].isFirstChange) {
                return true;
            } else {
                throw new Error('The events were injected more than once');
            }
        }
        return false;
    }


    private getMarker(markerLocation: MarkerLocation): Observable<Marker> {
        return new Observable(observer => {
            const marker = this.locateMarker(markerLocation);
            if (marker) {
                observer.next(marker);
                observer.complete();
            } else {
                observer.error(new Error('The marker ' + markerLocation + ' was not found'));
            }
        });
    }

    private getFloor(floorLocation: FloorLocation): Observable<Floor> {
        return new Observable(observer => {
            const floor = this.locateFloor(floorLocation);
            if (floor) {
                observer.next(floor);
                observer.complete();
            } else {
                observer.error(new Error('The floor ' + floorLocation + ' was not found'));
            }
        });
    }

    private locateFloor(location: FloorLocation): Floor {
        const foundSector = this.sectors.find(sector => sector.id === location.sectorId);

        if (!foundSector || !foundSector.floors) {
            return null;
        }

        const foundFloor = foundSector.floors.find(floor => floor.id === location.floorId);

        if (!foundFloor) {
            return null;
        }

        return foundFloor;
    }

    private locateMarker(location: MarkerLocation): Marker {
        const foundFloor = this.locateFloor(location);

        if (!foundFloor.markers) {
            return null;
        }

        const foundMarker = foundFloor.markers.find(marker => marker.id === location.markerId);

        if (!foundMarker) {
            return null;
        }

        return foundMarker;
    }

    private validateConeMarker(marker: Marker): boolean {
        if (!marker.icon || marker.icon.id !== 3 || !marker.cone) {
            return false;
        }

        return true;
    }
}
