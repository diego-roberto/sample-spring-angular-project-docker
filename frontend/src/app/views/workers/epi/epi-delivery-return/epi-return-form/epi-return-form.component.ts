import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CaEpi } from 'app/shared/models/ca-epi.model';
import { EpiWorkers } from 'app/shared/models/epi-workers.model';
import { WorkerService } from 'app/shared/services/worker.service';
import { Worker } from 'app/shared/models/worker.model';
import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';

@Component({
    selector: 'epi-return-form',
    templateUrl: 'epi-return-form.component.html',
    styleUrls: ['./epi-return-form.component.scss']
})

export class EpiReturnFormComponent implements OnChanges {

    @Input() workerSubject: Subject<any>;
    @Input() individualEquipmentWorkerSubject: Subject<any>;

    @Input() set filteredEpis(epis: CaEpi[]) {
        if (epis && epis.length > 0) {
            this.filteredCaEpis = this.caEpis = epis;
        }
    }

    @Output() episChange = new EventEmitter();

    @Input() set addedEpis(epis: CaEpi[]) {
        if (epis) {
            this.filteredAddedCaEpis = epis;
            this.addedCaEpis = epis;
        }
    }

    @Input() set individualEquipment(individualEquipmentList: IndividualEquipment[]) {
        this.filteredIndividualEquipmentList = this.individualEquipmentList = individualEquipmentList;
    }

    @Input() set addedIndividualEquipment(addedIndividualEquipmentList: IndividualEquipment[]) {
        this.filteredAddedIndividualEquipmentList = addedIndividualEquipmentList;
    }

    @Output() addedIndividualEquipmentListChange = new EventEmitter<IndividualEquipment[]>();

    caEpis: Array<CaEpi> = [];
    caEpisSub: Array<CaEpi> = [];
    addedCaEpis: Array<CaEpi> = [];
    filteredCaEpis: Array<CaEpi> = [];
    filteredAddedCaEpis: Array<CaEpi> = [];
    selectedCaEpiToAdd: Array<CaEpi> = [];
    selectedCaEpiToRemove: Array<CaEpi> = [];
    selectedRow: Number;
    epiWorkers: Array<EpiWorkers> = [];
    filteredOptions: Observable<Worker[]>;

    individualEquipmentList: Array<IndividualEquipment> = [];
    addedIndividualEquipmentList: Array<IndividualEquipment> = [];
    filteredIndividualEquipmentList: Array<IndividualEquipment> = [];
    filteredAddedIndividualEquipmentList: Array<IndividualEquipment> = [];
    selectedIndividualEquipmentListToAdd: Array<IndividualEquipment> = [];
    selectedIndividualEquipmentListToRemove: Array<IndividualEquipment> = [];

    constructor(
        public workerService: WorkerService
    ) { }

    ngOnChanges() {
        this.workerSubject.subscribe(epiWorkers => {
            this.filteredCaEpis = this.caEpis = epiWorkers;

            this.sortCaEpiArray(this.filteredCaEpis);
        });

        this.individualEquipmentWorkerSubject.subscribe(individualEquipmentList => {
            this.filteredIndividualEquipmentList = this.individualEquipmentList = individualEquipmentList;
            this.sortIndividualEquipmentArray(this.filteredIndividualEquipmentList);
        });
    }

    displayFn(worker: Worker): any {
        return worker ? worker.name : worker;
    }

    setClickedRow(index) {
        this.selectedRow = index;
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
        if (this.selectedIndividualEquipmentListToAdd.includes(individualEquipment)) {
            this.selectedIndividualEquipmentListToAdd = this.selectedIndividualEquipmentListToAdd.filter(i => i !== individualEquipment);
        } else {
            this.selectedIndividualEquipmentListToAdd.push(individualEquipment);
        }
    }

    setSelectedIndividualEquipmentToRemove(individualEquipment: IndividualEquipment) {
        if (this.selectedIndividualEquipmentListToRemove.includes(individualEquipment)) {
            this.selectedIndividualEquipmentListToRemove = this.selectedIndividualEquipmentListToRemove.filter(i => i !== individualEquipment);
        } else {
            this.selectedIndividualEquipmentListToRemove.push(individualEquipment);
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
        this.addedCaEpis = this.filteredAddedCaEpis = this.addedCaEpis.concat(toAdd).sort(c => c.id);
        this.sortCaEpiArray(this.filteredAddedCaEpis);
        this.caEpis = this.filteredCaEpis = this.caEpis.filter(({ id }) => !toAdd.some(c => c.id === id));
        this.selectedCaEpiToAdd = [];
        this.episChange.emit(this.filteredAddedCaEpis);
    }

    removeCaEpiSelected() {
        const toRemove = this.selectedCaEpiToRemove;
        this.caEpis = this.filteredCaEpis = this.caEpis.concat(toRemove).sort(c => c.id);
        this.sortCaEpiArray(this.filteredCaEpis);
        this.addedCaEpis = this.filteredAddedCaEpis = this.addedCaEpis.filter(({ id }) => !toRemove.some(c => c.id === id));
        this.selectedCaEpiToRemove = [];
        this.episChange.emit(this.filteredAddedCaEpis);
    }

    addIndividualEquipmentSelected() {
        const toAdd = this.selectedIndividualEquipmentListToAdd;
        this.addedIndividualEquipmentList = this.filteredAddedIndividualEquipmentList = this.addedIndividualEquipmentList.concat(toAdd);
        this.individualEquipmentList = this.filteredIndividualEquipmentList = this.individualEquipmentList.filter(a => ! toAdd.some(b => a.id === b.id));
        this.sortIndividualEquipmentArray(this.filteredAddedIndividualEquipmentList);
        this.selectedIndividualEquipmentListToAdd = [];
        this.addedIndividualEquipmentListChange.emit(this.filteredAddedIndividualEquipmentList);
    }

    removeIndividualEquipmentSelected() {
        const toRemove = this.selectedIndividualEquipmentListToRemove;
        this.individualEquipmentList = this.filteredIndividualEquipmentList = this.individualEquipmentList.concat(toRemove);
        this.addedIndividualEquipmentList = this.filteredAddedIndividualEquipmentList = this.addedIndividualEquipmentList.filter(a => ! toRemove.some(b => a.id === b.id));
        this.sortIndividualEquipmentArray(this.filteredIndividualEquipmentList);
        this.selectedIndividualEquipmentListToRemove = [];
        this.addedIndividualEquipmentListChange.emit(this.filteredAddedIndividualEquipmentList);
    }

    isAddDisabled(): boolean {
        return this.selectedCaEpiToAdd.length <= 0 && this.selectedIndividualEquipmentListToAdd.length <= 0;
    }

    isRemoveDisabled(): boolean {
        return this.selectedCaEpiToRemove.length <= 0 && this.selectedIndividualEquipmentListToRemove.length <= 0;
    }

    searchCaEpis(value) {
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

    searchAddedCaEpis(value) {
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
