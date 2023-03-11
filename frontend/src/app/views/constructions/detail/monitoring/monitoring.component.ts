import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar, MdDialog, MdSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { SectorsEventsEmitter, SectorsEventsEmitterImpl } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-emitter';
import { MarkerRemoved, MarkerAddRequest, MarkerPosUpdated, ConeUpdateRequest } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-types';

import { MappingDialogComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/mapping-dialog/mapping-dialog.component';
import { MappingDialogGuardComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/mapping-dialog-guard/mapping-dialog-guard.component';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { SectorCount } from 'app/shared/util/json/sector-count';

import { ConeWsService } from 'app/shared/services/cone-ws.service';
import { SectorsService } from 'app/shared/services/sector.service';
import { MarkerService } from 'app/shared/services/marker.service';
import { IconService } from 'app/shared/services/icon.service';
import { ConeService } from 'app/shared/services/cone.service';

import { Icon } from 'app/shared/models/icon.model';
import { Sector } from 'app/shared/models/sector.model';
import { Marker } from 'app/shared/models/marker.model';
import { Cone } from 'app/shared/models/cone.model';


@Component({
    selector: 'app-monitoring',
    templateUrl: 'monitoring.component.html',
    styleUrls: ['./monitoring.component.scss']
})

export class MonitoringComponent {

    loading = true;

    selectedIndex = 0;

    icons: Icon[];

    selectedIcons: Icon[];

    sectorsForMonitoring: Sector[] = [];

    sectorsForMapping: Sector[] = [];

    sectorsForManagement: Sector[] = [];

    sectorsEvents: SectorsEventsEmitter = new SectorsEventsEmitterImpl();

    sectorsCount: SectorCount[];

    private constructionId: number;

    constructor(
        private confirmDialogHandler: ConfirmDialogHandler,
        private coneWebsocket: ConeWsService,
        private sectorsService: SectorsService,
        private markerService: MarkerService,
        private iconService: IconService,
        private coneService: ConeService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MdSnackBar,
        private dialog: MdDialog) {

        iconService.getIcons().subscribe(icons => {
            this.icons = icons;
        });

        route.parent.params.subscribe(
            params => {
                if (params.id) {
                    sectorsService.getSectorsByConstruction(params.id).subscribe(
                        sectors => {
                            this.constructionId = params.id;

                            this.sectorsForMonitoring = sectors.map(sector => sector.clone());
                            this.sectorsForMapping = sectors.map(sector => sector.clone());
                            this.sectorsForManagement = sectors.map(sector => sector.clone());

                            this.updateCount();

                            this.loading = false;
                        },
                        error => {
                            this.snackBar.open('Não foi possível carregar as informações da obra', null, { duration: 2000 });
                        }
                    );
                }
            }
        );

        this.coneWebsocket.cones.subscribe(cones => {
            this.emitSocketEvents(cones);
        });
    }

    private fillSectorsSummary(sectors: Sector[], sectorsCount: SectorCount[]) {
        sectors.forEach(sector => {
            const sectorCount = sectorsCount.find(count => count.sectorId === sector.id);
            sector.summary = sectorCount;

            if (sectorCount) {
                sector.floors.forEach(floor => {
                    const floorCount = sectorCount.floorsCount.find(count => count.floorId === floor.id);
                    floor.summary = floorCount;
                });
            }
        });
    }

    requestRemoveMarker(markerRemoved: MarkerRemoved) {
        const opened: MdSnackBarRef<SimpleSnackBar> = this.snackBar.open('Removendo marcador, aguarde...');

        this.markerService.removeMarker(markerRemoved.markerLocation.markerId).subscribe(
            () => {
                this.sectorsEvents.markerRemoved.emit(markerRemoved);
                this.updateCount();

                opened.dismiss();
                this.snackBar.open('Marcador removido com sucesso!', null, { duration: 2000 });
            },
            error => {
                this.snackBar.open('Erro ao remover marcador!', null, { duration: 2000 });
            }
        );
    }

    requestNewMarker(request: MarkerAddRequest) {
        const marker = new Marker();
        marker.floorId = request.floorLocation.floorId;
        marker.position = request.position;
        marker.icon = request.icon;

        this.requestAdditionalUserInformation(marker).subscribe(editedMarker => {

            const name = marker.icon.title;
            const opened: MdSnackBarRef<SimpleSnackBar> = this.snackBar.open('Adicionando ' + name + '...');

            this.markerService.createMarker(editedMarker).subscribe(
                savedMarker => {
                    this.sectorsEvents.markerAdded.emit({ floorLocation: request.floorLocation, marker: savedMarker });
                    this.updateCount();

                    opened.dismiss();
                    this.snackBar.open('Marcador adicionado com sucesso!', null, { duration: 2000 });
                },
                error => {
                    opened.dismiss();
                    console.log(error);
                    this.snackBar.open('Erro ao adicionar marcador!', null, { duration: 2000 });
                }
            );
        });

    }

    requestPositionUpdate(request: MarkerPosUpdated) {
        this.markerService.updateMarkerPosition(request.markerLocation.markerId, request.position).subscribe(
            () => {
                this.sectorsEvents.markerPosUpdated.emit(request);
            },
            error => {
                this.snackBar.open('Erro ao mover marcador!', null, { duration: 2000 });
            }
        );
    }

    requestEditCone(request: ConeUpdateRequest) {
        if (request.justActivating) {
            if (request.cone.active) {
                this.coneService.activate(request.cone.id).subscribe(
                    updated => {
                        if (updated) {
                            request.cone = request.cone.clone();
                            this.sectorsEvents.coneUpdated.emit(request);
                        } else {
                            this.snackBar.open('Não foi possível atualizar', null, { duration: 2000 });
                        }
                    },
                    error => {
                        this.snackBar.open('Erro ao ativar', null, { duration: 2000 });
                    }
                );
            } else {
                this.coneService.inactivate(request.cone.id).subscribe(
                    updated => {
                        if (updated) {
                            request.cone = request.cone.clone();
                            this.sectorsEvents.coneUpdated.emit(request);
                        } else {
                            this.snackBar.open('Não foi possível atualizar', null, { duration: 2000 });
                        }
                    },
                    error => {
                        this.snackBar.open('Erro ao inativar', null, { duration: 2000 });
                    }
                );
            }
        } else {
            const opened: MdSnackBarRef<SimpleSnackBar> = this.snackBar.open('Atualizando ...');
            this.coneService.updateCone(request.cone).subscribe(
                updatedCone => {
                    request.cone = updatedCone;
                    this.sectorsEvents.coneUpdated.emit(request);

                    this.updateCount();

                    opened.dismiss();
                    this.snackBar.open('Atualizado com sucesso!', null, { duration: 2000 });
                },
                error => {
                    this.snackBar.open('Erro ao atualizar', null, { duration: 2000 });
                }
            );
        }
    }

    redirect() {
        this.redirectToConstruction(this.constructionId);
    }

    private updateCount() {
        this.sectorsService.countDependencies(this.constructionId).subscribe(count => {
            this.sectorsCount = count;

            this.fillSectorsSummary(this.sectorsForMonitoring, count);
            this.fillSectorsSummary(this.sectorsForManagement, count);
            this.fillSectorsSummary(this.sectorsForMapping, count);
        });
    }

    private emitSocketEvents(cones: Cone[]) {
        cones.forEach(cone => {
            this.sectorsForManagement.forEach(sector => {
                if (sector.floors) {
                    sector.floors.forEach(floor => {
                        if (floor.markers) {
                            floor.markers.forEach(marker => {
                                if (marker.cone && marker.cone.id === cone.id) {
                                    this.sectorsEvents.coneUpdated.emit({
                                        markerLocation: { sectorId: sector.id, floorId: floor.id, markerId: marker.id },
                                        cone: cone
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    private requestAdditionalUserInformation(marker: Marker): Observable<Marker> {
        return new Observable(observer => {
            if (marker.icon.id !== 3 && marker.icon.id !== 5) {
                observer.next(marker);
                observer.complete();
            } else if (marker.icon.id === 3){
                const dialogRef = this.dialog.open(MappingDialogComponent);
                dialogRef.afterClosed().subscribe(cone => {
                    if (cone) {
                        marker.cone = cone;
                        observer.next(marker);
                        observer.complete();
                    } else {
                        observer.complete();
                    }
                });
            }
            else{
                //marcador guarda-corpo
                const dialogRef = this.dialog.open(MappingDialogGuardComponent);
                dialogRef.afterClosed().subscribe(cone => {
                    if (cone) {
                        marker.icon.title = "Guarda Corpo Inteligente"
                        marker.cone = cone;
                        observer.next(marker);
                        observer.complete();
                    } else {
                        observer.next(marker);
                        observer.complete();
                    }
                });
            }
        });
    }

    private redirectToConstruction(constructionId: number) {
        this.router.navigate(['/constructions/edit/' + constructionId], { relativeTo: this.route, fragment: 'blueprints' });
    }

    private sectorCountById(id: number): SectorCount {
        return this.sectorsCount ? this.sectorsCount.find(count => count.sectorId === id) : null;
    }

    hasSomeFloor(sectors: Sector[]) {
        return sectors && sectors.find(sector => sector.floors && sector.floors.length > 0) != null;
    }

    changeTab() {
        this.selectedIndex = 1;
    }

    selectedIndexChange(val: number) {
        this.selectedIndex = val;
    }
}
