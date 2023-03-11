import { Sector } from './sector.model';
import { Alert } from './alert.model';
import { Marker } from './marker.model';
import { Clonable } from 'app/shared/util/generic/form/clonable';
import { Summarizable } from 'app/shared/util/generic/summary/summarizable';
import { SummaryCount } from 'app/shared/util/generic/summary/summary-count';

export class Floor implements Clonable<Floor>, Summarizable {

    id: number;
    name: string;
    acronym: string;

    imageUrl: string;
    imageFileName: string;

    sectorId: number;

    markers: Array<Marker> = [];

    alerts: Array<Alert> = [];

    imageFile: File;

    summary: SummaryCount;

    active: boolean;

    constructor() { }

    initializeWithJSON(json, sector: Sector) {
        this.id = json.id;
        this.name = json.name;
        this.acronym = json.acronym;

        this.imageUrl = json.imageUrl;
        this.imageFileName = json.imageFileName;

        this.sectorId = json.sectorId;

        this.markers = json.markers.map(jsonMarker => new Marker().initializeWithJSON(jsonMarker, this));

        this.active = json.active;

        return this;
    }

    initWithJSONFloor(json: any): Floor {
        this.id = json.id;
        this.name = json.name;
        this.acronym = json.acronym;

        this.imageUrl = json.imageUrl;
        this.imageFileName = json.imageFileName;

        this.sectorId = json.sectorId;

        this.markers = json.markers ? json.markers.map(jsonMarker => new Marker().initializeWithJSON(jsonMarker, this)) : null;

        this.active = json.active;

        return this;
    }


    toJSON() {
        return {
            id: this.id,
            sectorId: this.sectorId,
            name: this.name,
            acronym: this.acronym,
            imageUrl: this.imageUrl,
            imageFileName: this.imageFileName,
            markers: this.markers ? this.markers : null,
            active: this.active
        };
    }

    conesNumber(): number {
        return this.markers.filter((coordinate) => {
            return coordinate.icon.id === 3 && coordinate.active === true;
        }).length;
    }

    workersNumber(): number {
        return 0;
    }

    alertsNumber(): number {
        return this.alerts.length;
    }

    clone(): Floor {
        const floor = Object.assign(new Floor(), this);
        floor.markers = this.markers ? this.markers.map(marker => {
            return marker.clone();
        }) : [];
        floor.alerts = [];
        floor.imageFile = null;
        return floor;
    }
}
