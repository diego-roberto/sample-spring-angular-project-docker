import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ObservableMedia } from '@angular/flex-layout';

import { SectorInstanceManagerComponent } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/sector-instance-manager.component';
import { MarkerRemoved, MarkerAddRequest, MarkerPosUpdated, MarkerPosUpdateRequest } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-types';

import { Floor } from 'app/shared/models/floor.model';
import { Icon } from 'app/shared/models/icon.model';



@Component({
    selector: 'area-mapping',
    templateUrl: 'area-mapping.component.html',
    styleUrls: ['area-mapping.component.scss']
})
export class AreaMappingComponent extends SectorInstanceManagerComponent implements OnInit, AfterViewInit, OnDestroy {

    get floor(): Floor {
        return this.floorChange.getValue();
    };
    set floor(floor: Floor) {
        if (this.floor !== floor) {
            this.floorChange.next(floor);
        }
    };

    showingFloor = true;

    readonly floorChange = new BehaviorSubject<Floor>(null);

    @Input() icons: Icon[];

    @Output() readonly requestConstructionRedirect: EventEmitter<void> = new EventEmitter();
    @Output() readonly requestRemoveMarker: EventEmitter<MarkerRemoved> = new EventEmitter();
    @Output() readonly requestNewMarker: EventEmitter<MarkerAddRequest> = new EventEmitter();
    @Output() readonly requestPositionUpdate: EventEmitter<MarkerPosUpdated> = new EventEmitter();

    private selectedIcon: Icon;

    constructor(private media: ObservableMedia) {
        super();
    }

    ngOnInit() { }

    ngAfterViewInit() {
        if (this.sectors && this.sectors.length > 0 && this.sectors[0].floors.length > 0) {
            this.floor = this.sectors[0].floors[0];
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    iconChanged(icon: Icon) {
        this.selectedIcon = icon;
    }

    get gtSm(): boolean {
        return this.media.isActive('gt-sm');
    }

    get ltMd(): boolean {
        return this.media.isActive('lt-md');
    }

    removeMarker(markerId: number) {
        this.requestRemoveMarker.emit({
            markerLocation: {
                sectorId: this.floor.sectorId,
                floorId: this.floor.id,
                markerId: markerId
            }
        });
    }

    newMarker(position: [number, number]) {
        if (this.selectedIcon) {
            this.requestNewMarker.emit({
                floorLocation: {
                    sectorId: this.floor.sectorId,
                    floorId: this.floor.id
                },
                icon: this.selectedIcon,
                position: position
            });
        }
    }

    positionUpdate(request: MarkerPosUpdateRequest) {
        this.requestPositionUpdate.emit({
            markerLocation: {
                sectorId: this.floor.sectorId,
                floorId: this.floor.id,
                markerId: request.markerId
            },
            position: request.position
        });
    }

    protected onSyncError(error: Error) { }
}
