import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { EpiWorkers } from 'app/shared/models/epi-workers.model';
import { CaEpi } from 'app/shared/models/ca-epi.model';
import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';
import { WorkerService } from 'app/shared/services/worker.service';
import { CaEpiService } from 'app/shared/services/ca-epi.service';
import { IndividualEquipmentService } from 'app/shared/services/individual-equipment.service';

@Component({
    selector: 'epi-delivery-form',
    templateUrl: 'epi-delivery-form.component.html',
    styleUrls: ['./epi-delivery-form.component.scss']
})

export class EpiDeliveryFormComponent implements OnInit {
    epiWorker: EpiWorkers;

    @Output() episChange = new EventEmitter();

    @Input() set addedEpis(epis: CaEpi[]) {
        if (epis && epis.length > 0) {
            this.filteredAddedCaEpis = epis;
            this.addedCaEpis = epis;
        }
    }

    @Output() addedIndividualEquipmentListChange = new EventEmitter<IndividualEquipment[]>();

    @Input() set addedIndividualEquipment(addedIndividualEquipmentList: IndividualEquipment[]) {
        this.filteredAddedIndividualEquipmentList = this.addedIndividualEquipmentList = addedIndividualEquipmentList;
    }

    selectedCaEpiToAdd: Array<CaEpi> = [];
    selectedCaEpiToRemove: Array<CaEpi> = [];
    selectedIndividualEquipmentToAdd: Array<IndividualEquipment> = [];
    selectedIndividualEquipmentToRemove: Array<IndividualEquipment> = [];
    selectedRow: Number;

    caEpis: Array<CaEpi> = [];
    addedCaEpis: Array<CaEpi> = [];
    filteredCaEpis: Array<CaEpi> = [];
    filteredAddedCaEpis: Array<CaEpi> = [];

    individualEquipmentList: Array<IndividualEquipment> = [];
    addedIndividualEquipmentList: Array<IndividualEquipment> = [];
    filteredIndividualEquipmentList: Array<IndividualEquipment> = [];
    filteredAddedIndividualEquipmentList: Array<IndividualEquipment> = [];

    constructor(
        public workerService: WorkerService,
        public caEpiService: CaEpiService,
        private individualEquipmentService: IndividualEquipmentService
    ) { }

    ngOnInit() {
        this.caEpiService.getValidCaEpiList().subscribe(caEpis => {
            this.caEpis = this.filteredCaEpis = caEpis.filter(caEpi => caEpi.quantity > 0);
            if (this.filteredAddedCaEpis && this.filteredAddedCaEpis.length > 0) {
                for (const epi of this.filteredAddedCaEpis) {
                    this.filteredCaEpis.splice(this.filteredCaEpis.indexOf(this.filteredCaEpis.find(x => x.id === epi.id)), 1);
                }
            }

            this.sortCaEpiArray(this.filteredCaEpis);
        });

        this.individualEquipmentService.getAll().subscribe(individualEquipmentList => {
            this.individualEquipmentList = this.filteredIndividualEquipmentList = individualEquipmentList.filter(individualEquipment => individualEquipment.quantity > 0);
            if (this.filteredIndividualEquipmentList && this.filteredIndividualEquipmentList.length > 0) {
                for (const individualEquipment of this.filteredAddedIndividualEquipmentList) {
                    this.filteredIndividualEquipmentList.splice(this.filteredIndividualEquipmentList.indexOf(this.filteredIndividualEquipmentList.find(x => x.id === individualEquipment.id)), 1);
                }
            }

            this.sortIndividualEquipmentArray(this.filteredIndividualEquipmentList);
        });
    }

    setClickedRow(index) {
        this.selectedRow = index;
    }

    isAddDisabled(): boolean {
        return this.selectedCaEpiToAdd.length <= 0 && this.selectedIndividualEquipmentToAdd.length <= 0;
    }

    isRemoveDisabled(): boolean {
        return this.selectedCaEpiToRemove.length <= 0 && this.selectedIndividualEquipmentToRemove.length <= 0;
    }

    setSelectedCaEpiToAdd(caEpi: CaEpi) {
        if (this.selectedCaEpiToAdd.includes(caEpi)) {
            this.selectedCaEpiToAdd = this.selectedCaEpiToAdd.filter(i => i !== caEpi);
        } else {
            this.selectedCaEpiToAdd.push(caEpi);
        }
    }

    setSelectedCaEpiToRemove(caEpi: CaEpi) {
        if (this.selectedCaEpiToRemove.includes(caEpi)) {
            this.selectedCaEpiToRemove = this.selectedCaEpiToRemove.filter(i => i !== caEpi);
        } else {
            this.selectedCaEpiToRemove.push(caEpi);
        }
    }

    setSelectedIndividualEquipmentToAdd(individualEquipment: IndividualEquipment) {
        if (this.selectedIndividualEquipmentToAdd.includes(individualEquipment)) {
            this.selectedIndividualEquipmentToAdd = this.selectedIndividualEquipmentToAdd.filter(i => i !== individualEquipment);
        } else {
            this.selectedIndividualEquipmentToAdd.push(individualEquipment);
        }
    }

    setSelectedIndividualEquipmentToRemove(individualEquipment: IndividualEquipment) {
        if (this.selectedIndividualEquipmentToRemove.includes(individualEquipment)) {
            this.selectedIndividualEquipmentToRemove = this.selectedIndividualEquipmentToRemove.filter(i => i !== individualEquipment);
        } else {
            this.selectedIndividualEquipmentToRemove.push(individualEquipment);
        }
    }

    addSelected() {
        this.addCaEpiSelected();
        this.addIndividualEquipmentSelected();
    }

    removeSelected() {
        this.removeCaEpiSelected();
        this.removeIndividualEquipmentSelected();
    }

    addCaEpiSelected() {
        const toAdd = this.selectedCaEpiToAdd;
        this.addedCaEpis = this.filteredAddedCaEpis = this.addedCaEpis.concat(toAdd);
        this.sortCaEpiArray(this.filteredAddedCaEpis);
        this.caEpis = this.filteredCaEpis = this.caEpis.filter(({ id }) => !toAdd.some(c => c.id === id));
        this.selectedCaEpiToAdd = [];
        this.episChange.emit(this.filteredAddedCaEpis);
    }

    removeCaEpiSelected() {
        const toRemove = this.selectedCaEpiToRemove;
        this.caEpis = this.filteredCaEpis = this.caEpis.concat(toRemove);
        this.sortCaEpiArray(this.filteredCaEpis);
        this.addedCaEpis = this.filteredAddedCaEpis = this.addedCaEpis.filter(({ id }) => !toRemove.some(c => c.id === id));
        this.selectedCaEpiToRemove = [];
        this.episChange.emit(this.filteredAddedCaEpis);
    }

    addIndividualEquipmentSelected() {
        const toAdd = this.selectedIndividualEquipmentToAdd;
        this.addedIndividualEquipmentList = this.filteredAddedIndividualEquipmentList = this.addedIndividualEquipmentList.concat(toAdd);
        this.individualEquipmentList = this.filteredIndividualEquipmentList = this.individualEquipmentList.filter(a => ! toAdd.some(b => a.id === b.id));
        this.sortIndividualEquipmentArray(this.filteredAddedIndividualEquipmentList);
        this.selectedIndividualEquipmentToAdd = [];
        this.addedIndividualEquipmentListChange.emit(this.filteredAddedIndividualEquipmentList);
    }

    removeIndividualEquipmentSelected() {
        const toRemove = this.selectedIndividualEquipmentToRemove;
        this.individualEquipmentList = this.filteredIndividualEquipmentList = this.individualEquipmentList.concat(toRemove);
        this.addedIndividualEquipmentList = this.filteredAddedIndividualEquipmentList = this.addedIndividualEquipmentList.filter(a => ! toRemove.some(b => a.id === b.id));
        this.sortIndividualEquipmentArray(this.filteredIndividualEquipmentList);
        this.selectedIndividualEquipmentToRemove = [];
        this.addedIndividualEquipmentListChange.emit(this.filteredAddedIndividualEquipmentList);
    }

    searchEquipments(value) {
        if (value) {
            this.filteredCaEpis = this.caEpis.filter(caEpi => {
                return (
                    !(value.length > 0 && ('ca' + caEpi.ca.ca).toLowerCase().indexOf(value.toLowerCase()) === -1)
                    || !(value.length > 0 && caEpi.epiId.description.toLowerCase().indexOf(value.toLowerCase()) === -1)
                );
            });
            this.filteredIndividualEquipmentList = this.individualEquipmentList.filter(individualEquipment => {
                return !(value.length > 0 && individualEquipment.description.toLowerCase().indexOf(value.toLowerCase()) === -1);
            });
        } else {
            this.filteredCaEpis = this.caEpis;
            this.filteredIndividualEquipmentList = this.individualEquipmentList;
        }
    }

    searchAddedEquipments(value) {
        if (value) {
            this.filteredAddedCaEpis = this.addedCaEpis.filter(addedCaEpi => {
                return (
                    !(value.length > 0 && ('ca' + addedCaEpi.ca.ca).toLowerCase().indexOf(value.toLowerCase()) === -1)
                    || !(value.length > 0 && addedCaEpi.epiId.description.toLowerCase().indexOf(value.toLowerCase()) === -1)
                );
            });
            this.filteredAddedIndividualEquipmentList = this.addedIndividualEquipmentList.filter(individualEquipment => {
                return !(value.length > 0 && individualEquipment.description.toLowerCase().indexOf(value.toLowerCase()) === -1);
            });
        } else {
            this.filteredAddedCaEpis = this.addedCaEpis;
            this.filteredAddedIndividualEquipmentList = this.addedIndividualEquipmentList;
        }
    }

    sortCaEpiArray(array: Array<CaEpi>) {
        array.sort((c1, c2) => {
            if (c1.ca.ca > c2.ca.ca) {
                return 1;
            }
            if (c1.ca.ca < c2.ca.ca) {
                return -1;
            }
            return 0;
        });
    }

    sortIndividualEquipmentArray(array: Array<IndividualEquipment>) {
        array.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }
}
