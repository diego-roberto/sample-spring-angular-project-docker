import { Cone } from 'app/shared/models/cone.model';
import { Marker } from 'app/shared/models/marker.model';
import { Icon } from 'app/shared/models/icon.model';

export interface FloorLocation {
    sectorId: number; floorId: number;
}

export interface MarkerLocation extends FloorLocation {
    markerId: number;
}

export interface ConeUpdated {
    markerLocation: MarkerLocation;
    cone: Cone;
}

export interface MarkerPosUpdated {
    markerLocation: MarkerLocation;
    position: [number, number];
}

export interface MarkerAdded {
    floorLocation: FloorLocation;
    marker: Marker;
}

export interface MarkerRemoved {
    markerLocation: MarkerLocation;
}

export function markerAddedInstanceOf(obj): boolean {
    return 'floorLocation' in obj && 'marker' in obj;
}

export function markerRemovedInstanceOf(obj): boolean {
    return 'markerLocation' in obj;
}

export interface MarkerPosUpdateRequest {
    markerId: number;
    position: [number, number];
}

export interface MarkerAddRequest {
    floorLocation: FloorLocation;
    position: [number, number];
    icon: Icon;
}

export interface ConeUpdateRequest extends ConeUpdated {
    justActivating: boolean;
}
