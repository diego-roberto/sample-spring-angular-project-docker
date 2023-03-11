import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MdDialogRef, MdSnackBar, MdSlideToggleChange} from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


import { SensorCompanyService } from 'app/shared/services/sensorcompany.service';
import { WorkerService } from 'app/shared/services/worker.service';
import { RiskTypesService } from 'app/shared/services/risk-types.service';
import { RiskFactorsService } from 'app/shared/services/risk-factors.service';
import { RiskFactorsEpiService } from 'app/shared/services/risk-factors-epi.service';
import { RiskFactorsQualitiesService } from 'app/shared/services/risk-factors-qualities.service';
import { EpiWorkersService } from 'app/shared/services/epi-workers.service';

import { Cone } from 'app/shared/models/cone.model';
import { Sensor } from 'app/shared/models/sensor.model';
import { Risk } from 'app/shared/models/risk.model';
import { Worker } from 'app/shared/models/worker.model';
import { RiskTypes } from 'app/shared/models/risk-types.model';
import { RiskFactors } from 'app/shared/models/risk-factors.model';
import { ConesWorkers } from 'app/shared/models/cones-workers.model';
import { Qualities } from 'app/shared/models/qualities.model';
import { Epi } from 'app/shared/models/epi.model';
import { EpiWorkers } from 'app/shared/models/epi-workers.model';

@Component({
    selector: 'mapping-dialog-guard',
    styleUrls: ['mapping-dialog-guard.component.scss'],
    templateUrl: 'mapping-dialog-guard.component.html'
})
export class MappingDialogGuardComponent implements OnInit, OnDestroy {

    selectedWorkers: Worker[] = [];

    viewMode = false;
    editMode = false;

    confirming = false;

    riskTypes: RiskTypes[] = [];
    riskFactors: RiskFactors[] = [];

    identifications: Sensor[] =[];

    epis: Epi[];
    qualities: Qualities[];

    loadingWorkers = false;
    loadingFilters = false;
    loadingCone = false;
    loadingRisks = false;

    coneInteligente = false;
    statusGuard = false;
    isGatway = false;

    titulo = "";
    identification= "";

    public get current(): number {
        return this.currentChange.getValue();
    }

    public set current(current: number) {
        this.currentChange.next(current);
    }

    get workers(): Worker[] {
        return this.workersChange.getValue();
    }

    set workers(workers: Worker[]) {
        this.workersChange.next(workers);
    }

    private identificationValid = false;
    private risksValid = false;
    private workersValid = false;

    private cone = new Cone();
    private readonly currentChange = new BehaviorSubject<number>(1);
    private readonly confirmedChange = new EventEmitter<boolean>();
    private readonly workersChange = new BehaviorSubject<Worker[]>(null);

    constructor(
        private dialogRef: MdDialogRef<MappingDialogGuardComponent>,
        private workersService: WorkerService,
        private sensorCompanyService: SensorCompanyService,
        private riskTypesService: RiskTypesService,
        private riskFactorsService: RiskFactorsService,
        private riskFactorsEpiService: RiskFactorsEpiService,
        private riskFactorsQualitiesService: RiskFactorsQualitiesService,
        private epiWorkersService: EpiWorkersService,
        private snackBar: MdSnackBar) {


        this.loadingRisks = true;
        this.findRiskFatorsAndType().subscribe(
            (result: [RiskTypes[], RiskFactors[]]) => {
                this.riskTypes = result[0];
                this.riskFactors = result[1];
                this.loadingRisks = false;
            },
            error => {
                this.snackBar.open('Não foi possível carregar os fatores de risco', null, { duration: 3000 });
                this.dialogRef.close();
            }
        );

        this.currentChange.subscribe(current => {
            if (current === 3) {
                this.loadingFilters = true;
                this.findEpisAndQualitiesByRiskFactors(
                    this.cone.risks.map(risk => risk.riskFactor)
                ).subscribe(
                    (result: [Epi[], Qualities[]]) => {
                        const epis = result[0];
                        const qualities = result[1];

                        this.epis = epis;
                        this.qualities = qualities;

                        if ((!this.cone.workers || this.cone.workers.length === 0) && !this.viewMode && !this.editMode) {
                            this.cone.workers = this.toConeWorkers(this.filterWorkersByQualitiesAndEpis(this.workers, this.qualities, this.epis));
                        }

                        this.loadingFilters = false;
                    },
                    error => {
                        this.snackBar.open('Não foi possível carregar os EPIs e qualificações necessárias para os riscos selecionados', null, { duration: 3000 });
                        this.loadingFilters = false;
                    }
                    );
            }
        });
    }

    ngOnInit(): void {
        this.loadingWorkers = true;
        this.getWorkersWithEpis().subscribe(workers => {
            this.workers = workers;

            this.loadingWorkers = false;
        },
            error => {
                this.snackBar.open('Não foi possível carregar os trabalhadores', null, { duration: 3000 });
                this.dialogRef.close();
            });
        this.sensorCompanyService.getSensorCompanyList().subscribe(sensors => {
            this.identifications = sensors;

        }
            , error => {
                this.snackBar.open('Não foi possível carregar os sensores', null, { duration: 3000 });
                this.dialogRef.close();
            }
        );
    }

    ngOnDestroy() {
        this.currentChange.complete();
    }

    back() {
        if (this.current > 1 && !this.confirming) {
            this.current--;
        }
    }
    alteraConeInteligente(event: MdSlideToggleChange) {
        this.coneInteligente = event.checked;
    }

    alteraStatusGuard(event: MdSlideToggleChange) {
        this.cone.active = event.checked;
    }

    alteraIsGateway(event: MdSlideToggleChange) {
        this.isGatway = event.checked;
    }

    alteraIdentification(ident, index) {
        if (ident && this.identifications.length > 0) {
            const idd = this.identifications[index];
            
        }
    }

    checkAbleWorker(worker: Worker) {
        if (this.qualities && this.epis) {
            return this.isWorkerAble(worker, this.qualities, this.epis);
        }
        return true;
    }

    hasSomeUnableWorker() {
        if (this.qualities && this.epis) {
            return this.selectedWorkers.findIndex(worker => !this.isWorkerAble(worker, this.qualities, this.epis)) > -1;
        }
        return false;
    }

    finish() {
        if(!this.coneInteligente){
            this.dialogRef.close();
        } else{
            this.dialogRef.close(this.cone);
        }
        
    }

    confirm() {
        this.confirmedChange.emit(true);
    }

    cancel() {
        this.confirmedChange.emit(false);
    }

    activeViewMode() {
        this.viewMode = true;
        this.current = 2;
    }

    close() {
        this.dialogRef.close();
    }

    setCone(coneRequest: Cone, view: boolean = true) {
        this.coneInteligente = true;
        this.cone = coneRequest;
    }

    private replaceCorrectReference(coneWorkers: ConesWorkers[]): Observable<void> {
        return new Observable<void>(observer => {
            this.workersChange.first(workers => workers != null).subscribe(() => {
                coneWorkers.forEach(coneWorker => {
                    const correctReference = this.workers.find(worker => worker.id === coneWorker.worker.id);

                    if (!correctReference) {
                        throw new Error('The worker with id ' + coneWorker.worker.id + ' was not found');
                    }

                    coneWorker.worker = correctReference;
                });

                observer.next();
                observer.complete();
            });
        });
    }

    private extractIds(riskFactors: RiskFactors[]): number[] {
        const ids = [];
        if (riskFactors) {
            riskFactors.forEach(riskFactor => {
                if (riskFactor && riskFactor.id != null) {
                    ids.push(riskFactor.id);
                }
            });
        }
        return ids;
    }

    private toConeWorkers(workers: Worker[]) {
        return workers ? workers.map(worker => this.initConeWorker(worker)) : [];
    }

    private initConeWorker(worker: Worker): ConesWorkers {
        const coneWorker = new ConesWorkers();
        coneWorker.cone = null;
        coneWorker.worker = worker;
        coneWorker.permission = true;
        return coneWorker;
    }

    private findEpisAndQualitiesByRiskFactors(riskFactors: RiskFactors[], delay: number = 500): Observable<[Epi[], Qualities[]]> {
        return new Observable(observer => {
            const ids = this.extractIds(riskFactors);

            if (ids.length > 0) {
                Observable.forkJoin(
                    this.riskFactorsEpiService.getRiskEpiList(ids).catch(() => Observable.of([])),
                    this.riskFactorsQualitiesService.getRiskQualitiesList(ids).catch(() => Observable.of([])),
                    Observable.of(0).delay(delay)
                ).subscribe(
                    (result: [Epi[], Qualities[]]) => {
                        this.epis = result[0];
                        this.qualities = result[1];

                        observer.next(result);
                        observer.complete();
                    },
                    error => {
                        observer.error();
                    }
                    );
            } else {
                observer.next([[], []]);
                observer.complete();
            }
        });
    }

    private getWorkersWithEpis(): Observable<Worker[]> {
        return new Observable<Worker[]>(observer => {

            Observable.forkJoin(
                this.workersService.getWorkerList(),
                this.epiWorkersService.getEpisFromAllWorkers()
            ).subscribe(
                (response: [Worker[], EpiWorkers[]]) => {
                    const workers = response[0];
                    workers.forEach(worker => {
                        worker.epis = response[1].filter(epiWorker => epiWorker.workerId === worker.id);
                    });
                    observer.next(response[0]);
                    observer.complete();
                },
                error => {
                    observer.error();
                }
                );
        });
    }

    private findRiskFatorsAndType(): Observable<[RiskTypes[], RiskFactors[]]> {
        return Observable.forkJoin(
            this.riskTypesService.getRiskTypesList(),
            this.riskFactorsService.getRiskFactorsList()
        );
    }

    private filterWorkersByQualitiesAndEpis(workers: Worker[], qualities: Qualities[], epis: Epi[]): Worker[] {
        return workers.filter(worker => {
            return this.isWorkerAble(worker, qualities, epis);
        });
    }

    private isWorkerAble(worker: Worker, qualities: Qualities[], epis: Epi[]) {
        const workerQualities = worker.qualifications ? worker.qualifications.map(qualification => qualification.qualities) : [];
        const workerEpis = worker.epis ? worker.epis.map(epi => epi ? new Epi().initializeWithJSON({ id: epi.epiId }) : null) : [];
        return this.hasAllQualities(workerQualities, qualities) && this.hasAllEpis(workerEpis, epis);
    }

    private hasAllQualities(workerQualities: Qualities[], qualities: Qualities[]): boolean {
        const correctQualities: number = qualities.filter(quality => {
            return workerQualities.find(workerQuality => workerQuality && workerQuality.id === quality.id) !== undefined;
        }).length;

        return correctQualities === qualities.length;
    }

    private hasAllEpis(workerEpis: Epi[], epis: Epi[]): boolean {
        const correctEpis: number = epis.filter(epi => {
            return workerEpis.find(workerEpi => workerEpi && workerEpi.id === epi.id) !== undefined;
        }).length;

        return correctEpis === epis.length;
    }

    private requestUserConfirmation(): Observable<boolean> {
        return new Observable(observer => {
            this.confirming = true;

            this.confirmedChange.first().subscribe((confirmed) => {
                this.confirming = false;
                observer.next(confirmed);
                observer.complete();
            });
        });
    }
}