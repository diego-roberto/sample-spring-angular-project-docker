import { Component, Input, Output, OnInit, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash/collection';

import { Construction } from 'app/shared/models/construction.model';
import { Worker } from 'app/shared/models/worker.model';
import { WorkerService } from 'app/shared/services/worker.service';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { ConstructionFormBase } from 'app/views/constructions/form/construction-form/components/construction-generic/construction-form-base';
import { ConstructionWorkersFormModel } from 'app/views/constructions/form/construction-form/components/construction-workers-form/construction-workers-form.model';

const includesString = (toCheck, value) => toCheck.toLowerCase().includes(value.toLowerCase());

const filterByString = value =>
    ({ name, cbos, cpf }) => [name, cbos.title, cpf].reduce(((prev, toCheck) => prev || includesString(toCheck, value)), false);

@Component({
    selector: 'construction-workers-form',
    templateUrl: './construction-workers-form.component.html',
    styleUrls: ['./construction-workers-form.component.scss']
})
export class ConstructionWorkersFormComponent extends ConstructionFormBase<ConstructionWorkersFormModel> {

    @Output() saved: EventEmitter<any> = new EventEmitter();

    @ViewChild('workersScroll') workersScroll;

    workers: Array<Worker> = [];
    filteredWorkers: Array<Worker> = [];
    scrollWorkers: Array<Worker> = [];
    workersOfConstruction: Array<Worker> = [];
    filteredWorkersOfConstruction: Array<Worker> = [];
    scrollWorkersOfConstruction: Array<Worker> = [];
    selectedToAdd = [];
    selectedToRemove = [];
    allSearch = '';
    checkedAddAll = false;
    checkedRemoveAll = false;
    changed = false;

    constructor(
        public service: WorkerService,
        public constructionItemResolver: ConstructionItemResolver
    ) {
        super(constructionItemResolver);
        if (this.isEditing()) {
            this.service.getWorkerNotInConstruction(this.model.id).subscribe(workers => {
                this.workers = this.filteredWorkers = workers;
            });
            this.workersOfConstruction = this.filteredWorkersOfConstruction = _.orderBy(this.model.workers, ['name']);
        } else {
            this.service.getWorkerList().subscribe(workers => {
                this.workers = this.filteredWorkers = workers;
            });
        }
    }

    protected create(): ConstructionWorkersFormModel {
        return new ConstructionWorkersFormModel();
    }

    searchWorkers(value) {
        this.filteredWorkers = this.workers.filter(filterByString(value));
    }

    searchWorkersOfConstruction(value) {
        this.filteredWorkersOfConstruction = this.workersOfConstruction.filter(filterByString(value));
    }

    addSelected() {
        const toAdd = this.selectedToAdd;
        this.workersOfConstruction = this.workersOfConstruction.concat(toAdd);
        this.filteredWorkersOfConstruction = _.orderBy(this.workersOfConstruction, ['name']);
        this.workers = this.workers.filter(({ id }) => !toAdd.some(c => c.id === id));
        this.filteredWorkers = _.orderBy(this.workers, ['name']);
        this.selectedToAdd = [];
        this.checkedAddAll = false;
        this.checkedRemoveAll = false;
        this.changed = true;
    }

    setAllSelectedToAdd() {
        if (this.selectedToAdd.length === this.filteredWorkers.length) {
            this.selectedToAdd = [];
            this.checkedAddAll = !this.checkedAddAll;
        } else {
            this.selectedToAdd = this.filteredWorkers;
            this.checkedAddAll = !this.checkedAddAll;
        }
    }

    setSelectedToAdd(worker: Worker) {
        if (this.selectedToAdd.includes(worker)) {
            this.selectedToAdd = this.selectedToAdd.filter(i => i !== worker);
            this.checkedAddAll = false;
        } else {
            this.selectedToAdd.push(worker);
            if (this.selectedToAdd.length === this.workers.length) {
                this.checkedAddAll = true;
            }
        }
    }

    removeSelected() {
        const toRemove = this.selectedToRemove;
        this.workers = this.workers.concat(toRemove);
        this.filteredWorkers = _.orderBy(this.workers, ['name']);
        this.workersOfConstruction = this.workersOfConstruction.filter(({ id }) => !toRemove.some(c => c.id === id));
        this.filteredWorkersOfConstruction = _.orderBy(this.workersOfConstruction, ['name']);
        this.selectedToRemove = [];
        this.checkedAddAll = false;
        this.checkedRemoveAll = false;
        this.changed = true;
    }

    setAllSelectedToRemove() {
        if (this.selectedToRemove.length === this.filteredWorkersOfConstruction.length) {
            this.selectedToRemove = [];
            this.checkedRemoveAll = !this.checkedRemoveAll;
        } else {
            this.selectedToRemove = this.filteredWorkersOfConstruction;
            this.checkedRemoveAll = !this.checkedRemoveAll;
        }
    }

    setSelectedToRemove(worker: Worker) {
        if (this.selectedToRemove.includes(worker)) {
            this.selectedToRemove = this.selectedToRemove.filter(i => i !== worker);
            this.checkedRemoveAll = false;
        } else {
            this.selectedToRemove.push(worker);
            if (this.selectedToRemove.length === this.workersOfConstruction.length) {
                this.checkedRemoveAll = true;
            }
        }
    }

    save() {
        this.model.workers = this.workersOfConstruction;
        this.saved.emit({ modelToSave: this.model, onSaved: null });
    }

    formValidator() {
        if (this.isEditing() && this.changed) {
            return false;
        }
        return true;
    }
}
