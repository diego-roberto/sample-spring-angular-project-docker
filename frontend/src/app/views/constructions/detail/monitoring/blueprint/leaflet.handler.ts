import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Url } from 'url';

import * as L from 'leaflet';
import { Icon } from 'app/shared/models/icon.model';

interface MarkerWrapper {
    id: number;
    marker: any;
    icon: Icon;
    position: [number, number];
    hide: boolean;
}

export class LeafletHandler {

    private map: any;
    private mapLayers: any;
    private mapImage: any;

    private addedMarkers: MarkerWrapper[] = [];

    private root: HTMLElement;

    private readonly onClickEvent: EventEmitter<any> = new EventEmitter();

    get onClick(): Observable<any> {
        return this.onClickEvent;
    }

    constructor() { }

    initialize(divElement: HTMLElement, maxZoom: number = 3): LeafletHandler {
        if (!divElement || !divElement.id) {
            throw new Error('The div for render leaflet must be provided with some id');
        }

        this.map = L.map(divElement.id, { crs: L.CRS.Simple, maxZoom: maxZoom });
        this.map.on('click', (e) => {
            this.onClickEvent.emit(e);
        });

        this.mapLayers = new L.LayerGroup([]);
        this.mapLayers.addTo(this.map);

        this.root = divElement;

        return this;
    }

    initialized(): boolean {
        return this.map !== null;
    }

    putImage(imageUrl: Url): Observable<void> {
        if (!imageUrl) {
            throw new Error('The image url must be provided to set it as blueprint');
        }

        return new Observable(observer => {
            const img = new Image();
            img.onerror = () => {
                observer.error();
            };
            img.onload = () => {
                const h = img.height;
                const w = img.width;

                const southWest = this.map.unproject([0, h], this.map.getMaxZoom() - 1);
                const northEast = this.map.unproject([w, 0], this.map.getMaxZoom() - 1);
                const bounds = new L.LatLngBounds([southWest, northEast]);
                this.map.setMaxBounds(bounds);
                this.map.fitBounds(bounds);

                this.mapImage = L.imageOverlay(imageUrl.href, bounds);
                this.mapImage.addTo(this.map);

                observer.next();
                observer.complete();
            };
            img.src = imageUrl.href;
        });
    }

    reset() {
        this.mapLayers.clearLayers();

        if (this.mapImage) {
            this.mapImage.remove();
        }

        while (this.addedMarkers.pop()) { };
    }

    addMarker(id: number, icon: Icon, active: boolean, position: [number, number], options?: { draggable?: boolean }): MarkerReference {
        if (id === null || id === undefined) {
            throw new Error('The marker id must be provided');
        }

        if (!icon) {
            throw new Error('The icon must be provided');
        }

        if (this.containsMarker(id)) {
            throw new Error('The id ' + id + ' was already added');
        }

        const leafletIcon = L.icon({
            iconUrl: 'assets/maps/markers/' + icon.name + (active ? '_active' : '') + '.png',
            iconSize: [53, 51],
        });

        const draggable = options && options.draggable ? options.draggable : false;

        const marker = L.marker(position, { icon: leafletIcon, draggable: draggable, pane: 'markerPane' });
        this.mapLayers.addLayer(marker);

        const markerWrapper = { id: id, marker: marker, icon: icon, hide: false, position: position };
        this.addedMarkers.push(markerWrapper);

        return this.createMarkerReference(markerWrapper, true);
    }

    inImageBounds(position: [number, number]): boolean {
        return (position[0] < this.mapImage.getBounds()._northEast.lat) && (position[0] > this.mapImage.getBounds()._southWest.lat) &&
            (position[1] < this.mapImage.getBounds()._northEast.lng) && (position[1] > this.mapImage.getBounds()._southWest.lng);
    }

    removeMarker(id: number) {
        const markerWrapper = this.getMarkerWrapperById(id);

        if (!markerWrapper) {
            throw new Error('The marker with id ' + id + ' was not added');
        }

        if (!markerWrapper.hide) {
            this.map.removeLayer(markerWrapper.marker);
        }

        this.addedMarkers.splice(this.addedMarkers.findIndex(wrapper => wrapper === markerWrapper), 1);

    }

    containsMarker(id: number): boolean {
        return this.addedMarkers.find(markerWrapper => markerWrapper.id === id) != null;
    }

    isHide(id: number): boolean {
        const markerWrapper = this.getMarkerWrapperById(id);
        return markerWrapper && markerWrapper.hide;
    }

    hideMarker(id: number): boolean {
        const markerWrapper = this.getMarkerWrapperById(id);

        if (!markerWrapper) {
            throw new Error('The marker with id ' + id + ' was not added');
        }

        if (markerWrapper.hide) {
            return false;
        }

        this.map.removeLayer(markerWrapper.marker);
        markerWrapper.hide = true;
        return true;
    }

    showMarker(id: number) {
        const markerWrapper = this.getMarkerWrapperById(id);

        if (!markerWrapper) {
            throw new Error('The marker with id ' + id + ' was not added');
        }

        if (!markerWrapper.hide) {
            return false;
        }

        this.mapLayers.addLayer(markerWrapper.marker);
        markerWrapper.hide = false;
        return true;
    }

    markerReference(id: number): MarkerReference {
        const markerWrapper = this.getMarkerWrapperById(id);

        if (!markerWrapper) {
            throw new Error('The marker with id ' + id + ' was not added');
        }

        return this.createMarkerReference(markerWrapper, false);
    }

    requestResize() {
        this.map.invalidateSize();
    }

    private getMarkerWrapperById(id: number): MarkerWrapper {
        return this.addedMarkers.find(markerWrapper => markerWrapper.id === id);
    }

    private createMarkerReference(marker: MarkerWrapper, initializeAttributes: boolean): MarkerReference {
        return new MarkerReferenceImpl(marker, this.root, initializeAttributes);
    }
}

export interface MarkerReference {

    readonly onDrag: Observable<{ oldPos: [number, number], newPos: [number, number] }>;

    addTooltip(content: string);

    updateTooltip(content: string);

    addLinkPopup(title: string, onclick: (id: number) => boolean | void, options?: any);

    addCustomLinkPopup(html: string, title: string, onclick: (id: number) => boolean | void, options?: any);

    updateLinkPopupContent(html: string, title: string);

    addCustomPopupOnHover(html: string, options?: any);

    updatePopupContent(html: string);

    move(newPosition: [number, number]);

    enableDragging();

    inactive();

    active();
}

class MarkerReferenceImpl implements MarkerReference {

    private readonly clickPopupEventName = 'linkPopupClick';

    private readonly popupPropertyName = 'popup';

    private wrapper: MarkerWrapper;

    private element: HTMLElement;

    private onDragMarker: EventEmitter<{ oldPos: [number, number], newPos: [number, number] }>;

    constructor(wrapper: MarkerWrapper, element: HTMLElement, initializeAttributes: boolean = true) {
        if (!wrapper) {
            throw new Error('The marker must be provided to create the marker reference');
        }

        this.wrapper = wrapper;
        this.element = element;
        if (initializeAttributes) {
            this.element[this.methodsAttributeName()] = {};
        }
    }

    move(newPosition: [number, number]) {
        const l = new L.LatLng(newPosition[0], newPosition[1]);
        this.wrapper.marker.setLatLng(l);
        this.wrapper.position = newPosition;
    }

    addTooltip(content: string) {
        this.wrapper.marker.bindTooltip(content);
    }

    addLinkPopup(title: string, onclick: (id: number) => boolean | void, options: any = {}) {
        this.addCustomLinkPopup('%s', title, onclick, options);
    }

    addCustomLinkPopup(html: string, title: string, onclick: (id: number) => boolean | void, options: any = {}) {

        if (html.indexOf('%s') < 0) {
            throw new Error('The html must have %s to put the link');
        }

        this.methods()[this.clickPopupEventName] = onclick;

        const popup = this.wrapper.marker.bindPopup(
            html.replace('%s', this.link(this.clickPopupEventName, this.popupPropertyName, title)),
            options);

        this.methods()[this.popupPropertyName] = popup;
    }

    updateLinkPopupContent(html: string, title: string) {
        if (!this.wrapper.marker._popup) {
            throw new Error('This marker has no popup');
        }

        this.wrapper.marker._popup.setContent(html.replace('%s', this.link(this.clickPopupEventName, this.popupPropertyName, title)));
    }

    addCustomPopupOnHover(html: string, options: any = {}) {
        const bound = this.wrapper.marker.bindPopup(html, options);
        bound.on('mouseover', function (e) {
            this.openPopup();
        });
        bound.on('mouseout', function (e) {
            this.closePopup();
        });
    }

    updatePopupContent(html: string) {
        if (!this.wrapper.marker._popup) {
            throw new Error('This marker has no popup');
        }

        this.wrapper.marker._popup.setContent(html);
    }

    updateTooltip(content: string) {
        if (!this.wrapper.marker._tooltip) {
            throw new Error('This marker has no tooltip');
        }

        this.wrapper.marker._tooltip.setContent(content);
    }

    private link(clickPopupEvent: string, popupProperty: string, title) {
        return `<a style="cursor: pointer" onclick="` + this.formatCall('linkPopupClick') + `;` + this.formatProperty('popup') + `.closePopup()">` + title + `</a>`;
    }

    enableDragging() {
        this.wrapper.marker.dragging.enable();
    }

    get onDrag(): Observable<{ oldPos: [number, number], newPos: [number, number] }> {
        if (!this.onDragMarker) {
            let currentPos: [number, number] = [0, 0];
            this.onDragMarker = new EventEmitter();
            this.wrapper.marker.on('move', (e) => {
                currentPos = [e.latlng.lat, e.latlng.lng];
            });
            this.wrapper.marker.on('moveend', (e) => {
                this.onDragMarker.emit({
                    oldPos: this.wrapper.position,
                    newPos: (this.wrapper.position = currentPos)
                });
            });
        }
        return this.onDragMarker;
    }

    inactive() {
        const leafletIcon = L.icon({
            iconUrl: 'assets/maps/markers/' + this.wrapper.icon.name + '.png',
            iconSize: [53, 51],
        });

        this.wrapper.marker.setIcon(leafletIcon);
    }
    active() {
        const leafletIcon = L.icon({
            iconUrl: 'assets/maps/markers/' + this.wrapper.icon.name + '_active.png',
            iconSize: [53, 51],
        });

        this.wrapper.marker.setIcon(leafletIcon);
    }

    private methods(): any {
        return this.element[this.methodsAttributeName()];
    }

    private methodsAttributeName(): string {
        return 'markerReference' + this.wrapper.id + 'CustomMethods';
    }

    private formatCall(methodName: string) {
        return `document.getElementById('` + this.element.id + `').` + this.methodsAttributeName() + `.` + methodName + `(` + this.wrapper.id + `);`;
    }

    private formatProperty(property: string) {
        return `document.getElementById('` + this.element.id + `').` + this.methodsAttributeName() + `.` + property;
    }
}
