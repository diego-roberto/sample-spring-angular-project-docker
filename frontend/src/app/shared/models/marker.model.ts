import { Cone } from './cone.model';
import { Icon } from './icon.model';
import { Floor } from './floor.model';
import { Clonable } from 'app/shared/util/generic/form/clonable';
import { Risk } from './risk.model';

export class Marker implements Clonable<Marker> {

    id: number;
    icon: Icon;
    floorId: number;
    latitude: number;
    longitude: number;
    active: boolean;
    cone: Cone;

    set position(position: [number, number]) {
        this.latitude = position ? position[0] : null;
        this.longitude = position ? position[1] : null;
    }

    get position(): [number, number] {
        return [this.latitude, this.longitude];
    }

    initializeWithJSON(json, floor?: Floor) {
        this.id = json.id = json.id != null ? json.id : null;
        this.icon = json.icon;
        this.position = [Number(json.latitude), Number(json.longitude)];
        this.active = json.active;

        this.floorId = json.floorId;
        this.cone = json.cone ? new Cone().initializeWithJSON(json.cone) : null;

        return this;
    }

    toJSON() {
        return {
            id: this.id,
            icon: this.icon,
            latitude: this.latitude,
            longitude: this.longitude,
            active: this.active,
            floorId: this.floorId,
            cone: this.cone
        };
    }

    clone(): Marker {
        const marker = Object.assign(new Marker(), this);
        marker.cone = this.cone ? this.cone.clone() : null;
        return marker;
    }
}
