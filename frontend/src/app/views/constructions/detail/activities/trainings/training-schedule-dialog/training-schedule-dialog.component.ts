import { TrainingScheduler } from 'app/shared/models/training-scheduler.model';

import { MdSnackBar, MdDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import * as Moment from 'moment';
import * as _ from 'lodash/collection';
import { UtilValidators } from 'app/shared/util/validators.util';
import { Training } from 'app/shared/models/training.model';
import { TrainingService } from 'app/shared/services/training.service';
import { MaskUtil } from 'app/shared/util/mask.util';
import { TrainingMinister } from 'app/shared/models/training-minister.model';
import { Worker } from 'app/shared/models/worker.model';
import { WorkerService } from 'app/shared/services/worker.service';
import { ConstructionWorkersFormModel } from 'app/views/constructions/_common/construction-workers-form/construction-workers-form.model';
import { ConstructionsService } from 'app/shared/services/constructions.service';
import { TrainingSchedulerService } from 'app/shared/services/training-scheduler.service';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmbedVideoService } from 'ngx-embed-video';

const includesString = (toCheck, value) => toCheck.toLowerCase().includes(value.toLowerCase());

const filterByString = value =>
    ({ name, cbos, cpf }) => [name, cbos.title, cpf].reduce(((prev, toCheck) => prev || includesString(toCheck, value)), false);


@Component({
    selector: 'training-schedule-dialog',
    templateUrl: 'training-schedule-dialog.component.html',
    styleUrls: ['./training-schedule-dialog.component.scss']
})

export class TrainingScheduleDialogComponent implements OnInit {
    @Output() onUpdate = new EventEmitter();
    @Input() query: string;
    title: string;
    totalSteps: Number;
    step: Number;
    page: any;
    showPreview: boolean;
    selectedTrainingId: number;
    filtered: boolean;
    trainings: Array<Training> = new Array<Training>();
    categoriesFilter: string;
    filters: boolean[] = [false, false, false];
    trainingScheduleForm: FormGroup;
    selectedTraining: Training;
    ministers: Array<TrainingMinister> = new Array<TrainingMinister>();
    previewingTraining: Training;
    number = MaskUtil.variableLengthMask(MaskUtil.NUMBER, 4);
    urlSafe: SafeResourceUrl;
    workersFull: Array<Worker> = [];
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
    showSearch = false;
    iframe_html: any;
    periodicities: Array<any> = [

        { id: 1, name: 'Mensal' },
        { id: 2, name: 'Bimestral' },
        { id: 3, name: 'Trimestral' },
        { id: 4, name: 'Semestral' },
        { id: 5, name: 'Anual' },
    ];

    exhibitions: Array<any> = [];

    constructionId: number;
    trainingStartDate: '';
    trainingEndDate: '';
    vezes: string;
    repeat: boolean;
    selectedPeriodicity: 0;
    selectedExhibitions: 0;
    local: string;
    horario: any;
    ministrantes: Array<TrainingMinister>;

    inputMinister: string;
    filteredMinisters: any;

    constructor(
        public service: WorkerService,
        public trainingService: TrainingService,
        public trainingSchedulerService: TrainingSchedulerService,
        private constructionsService: ConstructionsService,
        public dialogRef: MdDialogRef<TrainingScheduleDialogComponent>,
        public snackBar: MdSnackBar,
        private fb: FormBuilder,
        public sanitizer: DomSanitizer,
        public embedService: EmbedVideoService,

    ) {
        this.constructionId = this.getConstructionId();
        this.service.getActiveWorkersByConstruction(this.constructionId).subscribe(workers => {
            this.workers = this.filteredWorkers = workers;
            this.workersFull = workers;
            if (this.workers) {
                this.workers.sort((n1, n2) => {
                    if (n1.name > n2.name) {
                        return 1;
                    }

                    if (n1.name < n2.name) {
                        return -1;
                    }

                    return 0;
                });
            }
        });
    }

    getConstructionId(): number {
        const construction = this.constructionsService.construction;
        if (construction && construction != null && construction.id && construction.id != null) {
            return construction.id;
        }
    }

    ngOnInit() {
        this.showPreview = false;
        this.page = 1;
        this.query = '';
        this.filtered = false;
        this.updateCategoriesFilter();
        this.trainingService.getTrainingList(0, '0', this.query).subscribe((training) => {
            this.trainings = training;
        });

        this.trainingService.getMinisters().subscribe((ministers) => {
            this.ministers = ministers;
            this.filteredMinisters = ministers;
        });

        this.totalSteps = 2;
        this.title = 'Agendar Capacitação';

        this.step = 1;
        this.trainingScheduleForm = this.fb.group({
            startDate: new FormControl('', [Validators.required, UtilValidators.date, this.validateBeginDate]),
            endDate: new FormControl('', [Validators.required, UtilValidators.date, this.validateEndDate]),
            periodicidade: new FormControl(''),
            exhibition: new FormControl('', [Validators.required]),
            horario: new FormControl('', [Validators.required]),
            vezes: new FormControl(''),
            ministrante: new FormControl(''),
            workers: new FormControl(''),
            workersOfConstruction: new FormControl(''),
        });
        this.selectedPeriodicity = 0;
        this.repeat = false;
        this.vezes = '';
        this.trainingStartDate = null;
        this.trainingEndDate = null;
        this.local = null;
        this.horario = null;
        this.ministrantes = [];

        this.inputMinister = '';

    }

    changeFilteredMinisters() {

        this.filteredMinisters = this.ministers.filter(minister => {
            return !(minister.name.toLowerCase().indexOf(this.inputMinister.toLowerCase()) === -1);
        });
    }

    next() {
        this.filtered = true;
        this.page = this.page + 1;
        this.trainingService.getTrainingList(this.page - 1, this.categoriesFilter, this.query).subscribe((training) => {
            this.trainings = training;
        });
    }

    back() {
        this.filtered = true;
        this.page = this.page - 1;
        if (this.page < 1) {
            this.page = 1;
        }
        this.trainingService.getTrainingList(this.page - 1, this.categoriesFilter, this.query).subscribe((training) => {
            this.trainings = training;
        });
    }

    updateCategoriesFilter() {
        this.categoriesFilter = '';
        let separator = '';
        this.filtered = true;
        this.filters.forEach((item, index) => {
            if (item) {
                this.categoriesFilter = this.categoriesFilter + separator + index;
                separator = '-';
            }
        });
        if (this.categoriesFilter.length === 0) {
            this.categoriesFilter = '0';
        }

    }

    toggleActiveFilter(id: any) {
        this.filters[id] = !this.filters[id];
        this.page = 1;
        this.filtered = true;
        this.updateCategoriesFilter();
        this.trainingService.getTrainingList(this.page - 1, this.categoriesFilter, this.query).subscribe((training) => {
            this.trainings = training;
        });
    }

    toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    updateQuery(q: string) {
        this.query = q;
    }

    doSearch() {
        this.page = 1;
        this.filtered = true;
        this.trainingService.getTrainingList(this.page - 1, this.categoriesFilter, this.query).subscribe((training) => {
            this.trainings = training;
        });
    }

    onChange(repeat) {
        this.repeat = !repeat;
    }

    hasMinistrantes(ministrantresSelecionados) {
        this.ministrantes = ministrantresSelecionados;
        this.removeMinistersFromWorkers(ministrantresSelecionados);
    }

    hasChanged(id) {
        this.selectedTrainingId = id;
        this.trainingService.getById(id).subscribe((selected) => {
            this.selectedTraining = selected;
            this.exhibitions = this.selectedTraining.exhibitions;
        });
        this.step = 2;
    }
    hasPreviewSelected(training) {
        this.previewingTraining = training;

        if (training.videoUrl) {
            this.showPreview = true;
            this.iframe_html = this.embedService.embed(training.videoUrl, { query: { showinfo: 0, rel: 0, outro: 'Thumbnail' }, attr: { width: 600, height: 320 } });
        }
    }


    backToList() {
        this.showPreview = false;
    }

    hasErrorForm(attr: string, type: string): boolean {
        if (this.trainingScheduleForm.controls[attr].touched || this.trainingScheduleForm.controls[attr].dirty) {
            return this.trainingScheduleForm.controls[attr].hasError(type);
        } else {
            return false;
        }
    }

    validateBeginDate(control: AbstractControl) {

        if (!control || !control.parent || !control.parent.controls['startDate'] || !control.parent.controls['startDate'].value) {
            return null;
        }

        const dateBegin = Moment(control.parent.controls['startDate'].value);
        const dateEnd = Moment(control.parent.controls['endDate'].value);
        if (dateEnd.isBefore(dateBegin)) {
            return { isbefore: true };
        }

        return null;
    }

    validateEndDate(control: AbstractControl) {
        if ((!control || !control.parent) || (!control.parent.controls['startDate'] || !control.parent.controls['startDate'].value)
            || (!control.parent.controls['endDate'] || !control.parent.controls['endDate'].value)) {
            return null;
        }

        const dateBegin = Moment(control.parent.controls['startDate'].value);
        const dateEnd = Moment(control.parent.controls['endDate'].value);
        if (dateEnd.isBefore(dateBegin)) {
            return { isbefore: true };
        }
        return null;
    }

    close() {
        this.dialogRef.close();
    }

    get trainingTimeMask() {
        return MaskUtil.trainingTimeMask;
    }
    scheduleIt() {
        const trainingScheduler = new TrainingScheduler();

        trainingScheduler.selectedTrainingId = this.selectedTrainingId;
        trainingScheduler.constructionId = this.constructionId;
        trainingScheduler.trainingStartDate = this.trainingStartDate;
        trainingScheduler.trainingEndDate = this.trainingEndDate;
        trainingScheduler.vezes = +this.vezes.replace(/\D/g, '');
        trainingScheduler.repeat = this.repeat;
        trainingScheduler.selectedPeriodicity = this.selectedPeriodicity;
        trainingScheduler.selectedExhibitions = this.selectedExhibitions;
        trainingScheduler.local = this.local;
        trainingScheduler.horario = this.horario;
        trainingScheduler.ministrantes = this.ministrantes;
        trainingScheduler.workers = this.filteredWorkersOfConstruction.map(worker => worker.id);
        const result = new TrainingScheduler();
        result.initializeWithJSON(this.trainingSchedulerService.scheduleTrainings(trainingScheduler).subscribe());
        this.onUpdate.emit(null);
        this.dialogRef.close();

    }

    // workers //////////////////////////////////////////////////////////////////////

    protected create(): ConstructionWorkersFormModel {
        return new ConstructionWorkersFormModel();
    }

    searchWorkers(value) {
        this.filteredWorkers = this.workers.filter(filterByString(value));
    }

    searchWorkersOfConstruction(value) {
        this.filteredWorkersOfConstruction = this.workersOfConstruction.filter(filterByString(value));
    }

    // isShowButtonSave(): boolean {
    //     return ((this.workers.length > 0 || this.workersOfConstruction.length > 0) && this.showButtonSave);
    // }


    hasPendingFields() {
        if (this.repeat) {
            if (this.selectedPeriodicity === 0) { return true; }
            if (this.vezes === '0' || this.vezes === '') { return true; }
        }
        if (this.trainingEndDate == null) { return true; }
        if (this.trainingStartDate == null) { return true; }
        if (this.selectedExhibitions == null || this.selectedExhibitions === 0) { return true; }

        if (this.selectedExhibitions === 1) {
            if (this.local == null || this.local.length < 1) { return true; }
            if (this.horario == null || this.horario.length < 5) { return true; }
            if (this.ministrantes.length === 0 || this.ministrantes.length > 5) { return true; }
        }

        if (this.hasErrorForm('startDate', 'invalid')) { return true; }
        if (this.hasErrorForm('startDate', 'isbefore')) { return true; }
        if (this.hasErrorForm('startDate', 'isnecessary')) { return true; }
        if (this.hasErrorForm('endDate', 'invalid')) { return true; }
        if (this.hasErrorForm('endDate', 'isbefore')) { return true; }
        if (this.hasErrorForm('endDate', 'isnecessary')) { return true; }
        return false;

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
        this.clearWorkersFilters();
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
        this.clearWorkersFilters();
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

    minInitialDate(): Date {
        return new Date();
    }

    removeMinistersFromWorkers(selectedMinisters: Array<TrainingMinister>) {
        const selectedMinistersWorkers = selectedMinisters.filter(minister => minister.workerId > 0);

        this.clearWorkersFilters();

        this.workers = _.orderBy(this.workersFull, ['name']);

        selectedMinistersWorkers.forEach(minister => {
            const index = this.workers.findIndex(worker => worker.id == minister.workerId); // string == number
            if (index > -1) {
                this.workers.splice(index, 1);
            }
        });

        selectedMinistersWorkers.forEach(minister => {
            const index = this.workersOfConstruction.findIndex(worker => worker.id == minister.workerId); // string == number
            if (index > -1) {
                this.workersOfConstruction.splice(index, 1);
            }
        });

        this.workersOfConstruction.forEach(selectedWorker => {
            const index = this.workers.findIndex(worker => worker.id === selectedWorker.id);
            if (index > -1) {
                this.workers.splice(index, 1);
            }
        });

        this.filteredWorkers = _.orderBy(this.workers, ['name']);
        this.filteredWorkersOfConstruction = _.orderBy(this.workersOfConstruction, ['name']);
        this.selectedToAdd = [];
        this.selectedToRemove = [];
        this.checkedAddAll = false;
        this.checkedRemoveAll = false;
        this.changed = true;
    }

    clearWorkersFilters() {
        this.trainingScheduleForm.controls['workers'].setValue('');
        this.trainingScheduleForm.controls['workersOfConstruction'].setValue('');
    }

}
