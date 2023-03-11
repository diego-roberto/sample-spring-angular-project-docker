import { Component, AfterContentChecked, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, NgZone, IterableDiffers, AfterViewInit, AfterViewChecked, SimpleChanges, IterableDiffer, IterableChanges } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Url } from 'url';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';

import { LeafletHandler, MarkerReference } from 'app/views/constructions/detail/monitoring/blueprint/leaflet.handler';
import { ConeFilterBattery } from 'app/views/constructions/detail/monitoring/cone-management-list/cone-filters/cone-filter-battery';
import { SectorsEvents } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events';
import { MarkerAdded, MarkerRemoved, markerAddedInstanceOf, markerRemovedInstanceOf } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-types';
import { Icon } from 'app/shared/models/icon.model';
import { Floor } from 'app/shared/models/floor.model';
import { Marker } from 'app/shared/models/marker.model';
import { Cone } from 'app/shared/models/cone.model';
import { ConeIdPipe } from 'app/shared/pipes/common.pipe';
import { environment } from 'environments/environment';

export abstract class BlueprintComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy, AfterContentChecked {

    @Input() iconsToNotShow: Observable<Icon[]>;
    private iconsToNotShowValue: Icon[] = [];
    private iconsToNotShowSubscription: Subscription;

    @Input() floorChange: BehaviorSubject<Floor>;
    private floorChangeSubscription: Subscription;
    get floor(): Floor { return this.floorChange.getValue(); };
    set floor(floor: Floor) { this.floorChange.next(floor); };
    private lastFloor: Floor;

    @Input() sectorsEvents: SectorsEvents;
    private addAndRemoveMarkersSubscription: Subscription;
    private coneUpdatedSubscription: Subscription;
    private conePositionSubscription: Subscription;

    private lastMarkersDiffer: IterableDiffer<Marker>;
    private lastIconsDiffer: IterableDiffer<Icon>;

    private leafletHandlerObservable: BehaviorSubject<LeafletHandler> = new BehaviorSubject(null);
    private get leafletHandler(): LeafletHandler { return this.leafletHandlerObservable.getValue(); };
    private set leafletHandler(leafletHandler: LeafletHandler) { this.leafletHandlerObservable.next(leafletHandler); };

    private onClickSubscription: Subscription;

    constructor(protected iterableDiffers: IterableDiffers) {
        this.lastMarkersDiffer = this.iterableDiffers.find([]).create(null);
        this.lastIconsDiffer = this.iterableDiffers.find([]).create(null);
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (this.floorChange && !this.floorChangeSubscription) {
            this.floorChangeSubscription = this.floorChange.subscribe(floor => {
                this.onLeafletRendered().subscribe(() => {
                    this.applyFloorChange(floor);
                });
            });
        }

        if (!this.iconsToNotShowSubscription && this.iconsToNotShow) {
            this.iconsToNotShowSubscription = this.iconsToNotShow.subscribe(icons => {
                this.onLeafletRendered().subscribe(() => {
                    this.iconsToNotShowValue = icons ? icons : [];
                    this.applyIconsFilterChange(icons);
                });
            });
        }

        if (!this.addAndRemoveMarkersSubscription && this.sectorsEvents) {
            this.addAndRemoveMarkersSubscription = Observable.merge(
                this.sectorsEvents.markerAdded,
                this.sectorsEvents.markerRemoved
            ).subscribe((change: MarkerAdded | MarkerRemoved) => {
                this.onLeafletRendered().subscribe(() => {
                    if (markerAddedInstanceOf(change)) {
                        if (this.floor && (<MarkerAdded>change).floorLocation.floorId === this.floor.id) {
                            this.addMarker((<MarkerAdded>change).marker);
                        }
                    } else {
                        if (this.floor && (<MarkerRemoved>change).markerLocation.floorId === this.floor.id) {
                            this.removeMarker((<MarkerRemoved>change).markerLocation.markerId);
                        }
                    }
                });
            });
        }

        if (!this.coneUpdatedSubscription && this.sectorsEvents) {
            this.coneUpdatedSubscription = this.sectorsEvents.coneUpdated.subscribe((updated) => {
                this.onLeafletRendered().subscribe(() => {
                    if (this.floor && updated.markerLocation.floorId === this.floor.id) {
                        const reference = this.leafletHandler.markerReference(updated.markerLocation.markerId);
                        if (updated.cone.active) {
                            reference.active();
                        } else { reference.inactive(); }
                        this.updateCone(updated.cone, reference);
                    }
                });
            });
        }

        if (!this.conePositionSubscription && this.sectorsEvents) {
            this.conePositionSubscription = this.sectorsEvents.markerPosUpdated.subscribe(change => {
                if (this.floor && this.floor.id === change.markerLocation.floorId) {
                    this.leafletHandler.markerReference(change.markerLocation.markerId).move(change.position);
                }
            });
        }
    }

    ngAfterContentChecked() {
        if (this.leafletHandler && this.leafletHandler.initialized()) {
            this.leafletHandler.requestResize();
        }
    }

    ngAfterViewChecked() {
        if (!this.leafletHandler) {
            const divElement = document.getElementById(this.divId());

            if (divElement) {
                this.leafletHandler = new LeafletHandler().initialize(divElement, 3);
                this.leafletHandler.onClick.subscribe((e) => {
                    this.onClickEvent(e);
                });
            }
        }
    }

    ngOnDestroy() {
        if (this.floorChangeSubscription) {
            this.floorChangeSubscription.unsubscribe();
        }

        if (this.iconsToNotShowSubscription) {
            this.iconsToNotShowSubscription.unsubscribe();
        }

        if (this.addAndRemoveMarkersSubscription) {
            this.addAndRemoveMarkersSubscription.unsubscribe();
        }
        if (this.coneUpdatedSubscription) {
            this.coneUpdatedSubscription.unsubscribe();
        }
        if (this.conePositionSubscription) {
            this.conePositionSubscription.unsubscribe();
        }

        if (this.onClickSubscription) {
            this.onClickSubscription.unsubscribe();
        }
    }

    private applyIconsFilterChange(icons: Icon[]) {
        const change = this.lastIconsDiffer.diff(icons);

        if (change) {
            change.forEachAddedItem(added => {
                this.floor.markers.forEach(marker => {
                    if (added.item.id === marker.icon.id && !this.leafletHandler.isHide(marker.id)) {
                        this.leafletHandler.hideMarker(marker.id);
                    }
                });
            });
            change.forEachRemovedItem(removed => {
                this.floor.markers.forEach(marker => {
                    if (removed.item.id === marker.icon.id && this.leafletHandler.isHide(marker.id)) {
                        this.leafletHandler.showMarker(marker.id);
                    }
                });
            });
        }
    }

    private applyFloorChange(floor: Floor) {
        if (floor && floor.imageUrl) {
            const imageUrl = new URL(environment.backendUrl + '/' + floor.imageUrl);

            if (!this.lastFloor || floor.id !== this.lastFloor.id) {
                this.lastFloor = floor;

                this.leafletHandler.reset();
                this.leafletHandler.putImage(imageUrl).subscribe(() => {
                    this.lastMarkersDiffer = this.iterableDiffers.find([]).create();
                    this.applyMarkersChange(this.lastMarkersDiffer.diff(floor.markers));
                });
            } else {
                this.applyMarkersChange(this.lastMarkersDiffer.diff(floor.markers));
            }
        } else {
            this.leafletHandler.reset();
        }
    }

    private applyMarkersChange(changes: IterableChanges<Marker>) {
        if (changes) {
            changes.forEachAddedItem(added => {
                this.addMarker(added.item);
            });

            changes.forEachRemovedItem(removed => {
                this.removeMarker(removed.item.id);
            });
        }
    }

    private addMarker(marker: Marker) {
        const active = marker.cone && marker.cone.active;

        const reference = this.leafletHandler.addMarker(marker.id, marker.icon, active, marker.position);
        this.customizeMarker(marker, reference);

        if (this.iconsToNotShowValue.findIndex(icon => icon.id === marker.icon.id) > -1) {
            this.leafletHandler.hideMarker(marker.id);
        }
    }

    private removeMarker(id: number) {
        this.leafletHandler.removeMarker(id);
    }

    private onLeafletRendered(): Observable<void> {
        return new Observable<void>(observer => {
            if (this.leafletHandler) {
                observer.next();
                observer.complete();
            } else {
                this.leafletHandlerObservable.subscribe(leafletHandler => {
                    if (leafletHandler && leafletHandler.initialized()) {
                        observer.next();
                        observer.complete();
                    }
                });
            }
        });
    }

    protected generateTooltipHtml(cone: Cone) {
        const identifier = new ConeIdPipe().transform(cone.identification);
        const title = cone.title;
        const batteryClass = this.classConeBattery(cone);
        return `<div style="text-align: center">` +
            `<span><b>` + title + ` </b></span><br/>` +
            (cone.statusConnection ? `<span class="cone-online">Online - </span>` : `<span class="cone-offline">Offline - </span>`) +
            `<span class="` + batteryClass + `"><b> (` + cone.battery + `%)</b></span>` +
            `</div>`;
    }

    private classConeBattery(cone: Cone): string {
        const batteryFilter = new ConeFilterBattery();
        batteryFilter.low = false;
        batteryFilter.mid = false;
        batteryFilter.full = false;

        batteryFilter.low = true;
        if (batteryFilter.match(cone)) {
            return 'cone-low-battery';
        }
        batteryFilter.low = false;

        batteryFilter.mid = true;
        if (batteryFilter.match(cone)) {
            return 'cone-medium-battery';
        }
        batteryFilter.mid = false;

        batteryFilter.full = true;
        if (batteryFilter.match(cone)) {
            return 'cone-full-battery';
        }
        return '';
    }

    protected inImageBounds(position: [number, number]): boolean {
        return this.leafletHandler.inImageBounds(position);
    }

    protected onClickEvent(e: any): void { }

    protected abstract divId(): string;

    protected abstract customizeMarker(marker: Marker, markerReference: MarkerReference);

    protected updateCone(cone: Cone, markerReference: MarkerReference) { }

    protected checkMarkerDifference(marker: Marker) { };
}
