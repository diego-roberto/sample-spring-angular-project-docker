import { Component, OnInit, OnChanges, IterableDiffers } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Url } from 'url';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BlueprintComponent } from 'app/views/constructions/detail/monitoring/blueprint/blueprint.component';
import { MarkerReference } from 'app/views/constructions/detail/monitoring/blueprint/leaflet.handler';
import { Marker } from 'app/shared/models/marker.model';
import { Cone } from 'app/shared/models/cone.model';

@Component({
    selector: 'blueprint-monitoring',
    templateUrl: './blueprint-monitoring.component.html',
    styleUrls: ['./blueprint-monitoring.component.scss']
})
export class BlueprintMonitoringComponent extends BlueprintComponent implements OnInit, OnChanges {

    constructor(protected iterableDiffers: IterableDiffers) {
        super(iterableDiffers);
    }

    ngOnInit() { }

    protected divId(): string {
        return 'sheetMonitoring';
    }

    protected customizeMarker(marker: Marker, markerReference: MarkerReference) {
        if (marker.icon.id === 3) {
            markerReference.addTooltip(this.generateTooltipHtml(marker.cone));
        }
    }

    protected updateCone(cone: Cone, markerReference: MarkerReference) {
        markerReference.updateTooltip(this.generateTooltipHtml(cone));
    }
}
