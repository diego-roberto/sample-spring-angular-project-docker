import { Component, OnInit, Input, Output, OnChanges, IterableDiffers, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { BlueprintComponent } from 'app/views/constructions/detail/monitoring/blueprint/blueprint.component';
import { MarkerReference } from 'app/views/constructions/detail/monitoring/blueprint/leaflet.handler';
import { MarkerPosUpdateRequest } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-types';
import { Marker } from 'app/shared/models/marker.model';
import { Cone } from 'app/shared/models/cone.model';

@Component({
    selector: 'blueprint-mapping',
    templateUrl: './blueprint-mapping.component.html',
    styleUrls: ['./blueprint-mapping.component.scss']
})
export class BlueprintMappingComponent extends BlueprintComponent implements OnInit, OnChanges, OnDestroy {

    @Output() requestRemoveMarker: EventEmitter<number> = new EventEmitter();

    @Output() requestNewMarker: EventEmitter<[number, number]> = new EventEmitter();

    @Output() requestPositionUpdate: EventEmitter<MarkerPosUpdateRequest> = new EventEmitter();

    private ngUnsubscribe = new Subject();

    constructor(protected iterableDiffers: IterableDiffers) {
        super(iterableDiffers);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
    }

    protected divId(): string {
        return 'sheetMapping';
    }

    protected customizeMarker(marker: Marker, markerReference: MarkerReference) {
        markerReference.addLinkPopup('Remover', () => {
            this.requestRemoveMarker.emit(marker.id);
        }, { closeButton: false });

        if (marker.icon.id === 3) {
            markerReference.addTooltip(this.generateTooltipHtml(marker.cone));
        }

        markerReference.enableDragging();
        markerReference.onDrag.takeUntil(this.ngUnsubscribe).subscribe(pos => {
            if (this.inImageBounds(pos.newPos)) {
                this.requestPositionUpdate.emit({ markerId: marker.id, position: pos.newPos });
            } else {
                markerReference.move(pos.oldPos);
            }
        });
    }

    protected updateCone(cone: Cone, markerReference: MarkerReference) {
        markerReference.updateTooltip(this.generateTooltipHtml(cone));
    }

    protected onClickEvent(e): void {
        const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
        if (this.inImageBounds(pos)) {
            this.requestNewMarker.emit(pos);
        }
    }
}
