import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SectorInstanceManagerComponent } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/sector-instance-manager.component';

import { Floor } from 'app/shared/models/floor.model';
import { Icon } from 'app/shared/models/icon.model';

@Component({
    selector: 'area-monitoring',
    templateUrl: 'area-monitoring.component.html',
    styleUrls: ['area-monitoring.component.scss']
})

export class AreaMonitoringComponent extends SectorInstanceManagerComponent implements OnInit, AfterViewInit, OnDestroy {

    get floor(): Floor {
        return this.floorChange.getValue();
    };
    set floor(floor: Floor) {
        if (this.floor !== floor) {
            this.floorChange.next(floor);
        }
    };

    showingFloor = true;

    readonly selectedIconsChange = new BehaviorSubject<Icon[]>(null);
    readonly floorChange = new BehaviorSubject<Floor>(null);

    @Input() icons: Icon[];

    @Output() readonly requestConstructionRedirect = new EventEmitter<void>();

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

    iconChanged(icons: Icon[]) {
        this.selectedIconsChange.next(icons);
    }

    get gtSm(): boolean {
        return this.media.isActive('gt-sm');
    }

    get ltMd(): boolean {
        return this.media.isActive('lt-md');
    }

    protected onSyncError(error: Error) { }
}
