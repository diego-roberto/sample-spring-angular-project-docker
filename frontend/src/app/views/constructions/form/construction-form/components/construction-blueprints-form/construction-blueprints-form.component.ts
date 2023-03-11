import { Component, EventEmitter, Output, OnInit } from '@angular/core';

import { EventSave } from 'app/shared/util/generic/form/event-save';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { InfoDialogHandler } from 'app/shared/util/generic/info-dialog/info-dialog.handler';
import { Construction } from 'app/shared/models/construction.model';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { Sector } from 'app/shared/models/sector.model';
import { Floor } from 'app/shared/models/floor.model';
import { FloorBlueprint } from 'app/views/constructions/form/construction-form/construction-form.component';
import { ConstructionFormBase } from 'app/views/constructions/form/construction-form/components/construction-generic/construction-form-base';
import { ConstructionBlueprints } from 'app/views/constructions/form/construction-form/components/construction-blueprints-form/construction-blueprints-form.model';

@Component({
    selector: 'safety-construction-blueprints-form',
    templateUrl: './construction-blueprints-form.component.html',
    styleUrls: ['./construction-blueprints-form.component.scss']
})
export class ConstructionBlueprintsFormComponent extends ConstructionFormBase<ConstructionBlueprints> implements OnInit {

    @Output() saved: EventEmitter<EventSave<Construction>> = new EventEmitter();
    savingFloor = false;
    empty = true;

    constructor(
        public confirmDialogHandler: ConfirmDialogHandler,
        public infoDialogHandler: InfoDialogHandler,
        public constructionItemResolver: ConstructionItemResolver
    ) {
        super(constructionItemResolver);
    }

    protected create(): ConstructionBlueprints {
        return new ConstructionBlueprints();
    }

    ngOnInit() {
        this.empty = this.model.sectors.length > 0 ? false : true;
    }

    addSector(sectorName) {
        if (sectorName !== '') {
            const newSector = new Sector();
            newSector.constructionId = this.persistedModel.id;
            newSector.name = sectorName;
            newSector.active = true;
            this.model.sectors = [...this.model.sectors, newSector];
        }
    }

    editSector({ name, index }) {
        this.model.sectors[index].name = name;
    }

    removeSector(index) {
        this.confirmDialogHandler.call('excluir', 'Deseja realmente excluir?').subscribe((confirm) => {
            if (confirm) {
                if (this.model.sectors[index].id) {
                    this.model.sectors[index].active = false;
                } else {
                    this.model.sectors.splice(index, 1);
                }
            }
        });
    }

    removeFloor(sectorIndex, floorIndex) {
        if (this.model.sectors[sectorIndex].floors[floorIndex].id) {
            this.model.sectors[sectorIndex].floors[floorIndex].active = false;
            this.model.sectors[sectorIndex].floors[floorIndex].imageFile = null;
        } else {
            this.model.sectors[sectorIndex].floors.splice(floorIndex, 1);
        }
    }

    blueprintAdded(indexSector, imageFile: File) {
        const fileReader = new FileReader();
        fileReader.onload = ((theFile) => {
            return (e) => {
                const newFloor = Object.assign(new Floor(), {
                    image: fileReader.result,
                    imageFile: imageFile,
                    active: true
                });
                this.model.sectors[indexSector].floors.push(newFloor);
            };
        })(imageFile);
        fileReader.readAsDataURL(imageFile);
    }

    blueprintEdited(floor: Floor, imageFile: File) {
        floor.imageFile = imageFile;
    }

    save() {
        this.savingFloor = !this.savingFloor;
        this.saved.emit({
            modelToSave: this.model,
            onSaved: () => {
                this.savingFloor = !this.savingFloor;
            },
            onError: () => {
                this.savingFloor = !this.savingFloor;
            }
        });
    }

    getCanRemove(floor: Floor): () => boolean {
        return () => {
            if (!floor.markers || floor.markers.length === 0) {
                return true;
            } else {
                this.infoDialogHandler.call(
                    'atenção', 'você não pode realizar esta operação, há marcadores cadastrado(s) neste pavimento. para continuar, remova os itens do mapeamento.'
                );
                return false;
            }
        };
    }

    canChangeImage(sectorIndex: number, floorIndex: number): boolean {
        return !(!this.model.sectors[sectorIndex].floors[floorIndex].markers || this.model.sectors[sectorIndex].floors[floorIndex].markers.length === 0);
    }

    floorsActivated(sectorIndex: number): boolean {
        let floorActive = false;
        this.model.sectors[sectorIndex].floors.forEach(
            floor => {
                if (floor.active) {
                    floorActive = true;
                }
            }
        );

        return floorActive;
    }

    hasError(floor: Floor): boolean {
        return floor instanceof FloorBlueprint && floor.error != null;
    }

    sectorHasError(sector: Sector): boolean {
        return sector.floors.find(floor => !this.hasError(floor)) === undefined;
    }
}
