import { Component, Output, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import * as _ from 'lodash/array';
import * as Moment from 'moment';
import { MdDialog } from '@angular/material';

import { AsoService } from 'app/shared/services/aso.service';
import { QualificationsService } from 'app/shared/services/qualifications.service';
import { EpiWorkersService } from 'app/shared/services/epi-workers.service';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { EpiWorkers } from 'app/shared/models/epi-workers.model';
import { Aso } from 'app/shared/models/aso.model';
import { Qualification } from 'app/shared/models/qualification.model';
import { WorkerAsoDialogComponent } from './worker-aso-dialog/worker-aso-dialog.component';
import { WorkerQualificationDialogComponent } from './worker-qualification-dialog/worker-qualification-dialog.component';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
    selector: 'worker-next-expirations',
    templateUrl: './worker-next-expirations.component.html',
    styleUrls: ['./worker-next-expirations.component.scss']
})
export class WorkerNextExpirationsComponent implements OnInit {

    @ViewChild('epiScroll') epiScroll: ElementRef;
    @ViewChild('asoScroll') asoScroll: ElementRef;
    @ViewChild('qualificationScroll') qualificationScroll: ElementRef;
    @Output() toShowPrintLoader: EventEmitter<boolean> = new EventEmitter();

    expirationsDateFormat = 'DD/MM/YYYY';

    epiWorkersDateGroup = [];
    asoDateGroup = [];
    qualificationDateGroup = [];

    // tipos para diferenciar container de scroll
    readonly epiContainer = 1;
    readonly asoContainer = 2;
    readonly qualificationContainer = 3;

    scrollEpiDateGroup = [];
    scrollAsoDateGroup = [];
    scrollQualificationDateGroup = [];

    selected = 1;

    epiLoading = true;
    asoLoading = true;
    qualificationLoading = true;

    dialogConfig = {
        data: {
            update: false
        }
    };

    constructor(
        private epiWorkersService: EpiWorkersService,
        private asoService: AsoService,
        private qualificationsService: QualificationsService,
        private appMessage: AppMessageService,
        public dialog: MdDialog
    ) { }

    ngOnInit() {
        // Expiring EPI
        this.epiWorkersService.getExpiringEpiWorkers().subscribe(epiWorkers => {
            const epiWorkersMap = new Map<String, String[]>();
            // Removendo mesmo epi para um worker
            const expiringEpiWorkers = _.uniqWith(epiWorkers, (epi1: EpiWorkers, epi2: EpiWorkers) => {
                return epi1.workerId === epi2.workerId && epi1.caEpiId.ca.ca === epi2.caEpiId.ca.ca;
            });

            for (const epi of expiringEpiWorkers) {
                const date = Moment(epi.caEpiId.ca.due_date).format(this.expirationsDateFormat);
                const epis = epiWorkersMap.get(date);
                if (epis) {
                    epis.push(this.formatEpi(epi));
                } else {
                    epiWorkersMap.set(date, [this.formatEpi(epi)]);
                }
            }

            let dateIndex = 0;
            epiWorkersMap.forEach((epiWorker, date) => {
                epiWorker.forEach((epi) => {
                    this.epiWorkersDateGroup.push({ date: null, epi: epi });
                });
                // So adiciona date no primeiro item da iteração acima
                this.epiWorkersDateGroup[dateIndex].date = date;
                dateIndex = this.epiWorkersDateGroup.length;
            });
            this.epiLoading = false;
        });

        // Expiring Aso
        this.asoService.getExpiringAso()
            .subscribe(
                (asos: Aso[]) => {
                    const asoMap = new Map<String, String[]>();

                    for (const aso of asos) {
                        const date = Moment(aso.nextDate).format(this.expirationsDateFormat);
                        const asosDate = asoMap.get(date);
                        if (asosDate) {
                            asosDate.push(this.formatAso(aso));
                        } else {
                            asoMap.set(date, [this.formatAso(aso)]);
                        }
                    }
                    let dateIndex = 0;
                    asoMap.forEach((dateAsos, date) => {
                        dateAsos.forEach((aso) => {
                            this.asoDateGroup.push({ date: null, aso: aso });
                        });
                        // So adiciona date no primeiro item da iteração acima
                        this.asoDateGroup[dateIndex].date = date;
                        dateIndex = this.asoDateGroup.length;
                    });
                    this.asoLoading = false;
                }
            );

        // Expiring Qualifications
        this.qualificationsService.getExpiringQualifications()
            .subscribe(
                (qualifications: Qualification[]) => {
                    const qualificationMap = new Map<String, String[]>();

                    for (const qualification of qualifications) {
                        const date = Moment(qualification.nextDate).format(this.expirationsDateFormat);
                        const qualificationsDate = qualificationMap.get(date);
                        if (qualificationsDate) {
                            qualificationsDate.push(this.formatQualification(qualification));
                        } else {
                            qualificationMap.set(date, [this.formatQualification(qualification)]);
                        }
                    }

                    let dateIndex = 0;
                    qualificationMap.forEach((dateQualifications, date) => {
                        dateQualifications.forEach((qualification) => {
                            this.qualificationDateGroup.push({ date: null, qualification: qualification });
                        });
                        // So adiciona date no primeiro item da iteração acima
                        this.qualificationDateGroup[dateIndex].date = date;
                        dateIndex = this.qualificationDateGroup.length;
                    });
                    this.qualificationLoading = false;
                }
            );
    }

    openPrintQualificationsReportDialog() {
        const dialogRef = this.dialog.open(WorkerQualificationDialogComponent, this.dialogConfig);
    }

     openWorkerAsoDialog() {
        const dialogRef = this.dialog.open(WorkerAsoDialogComponent, this.dialogConfig);
    }


    toPrintAsoReport() {
        const dtInit = new Date();
        dtInit.setDate(dtInit.getDate() - 20);

        const dtFim = new Date();
        dtFim.setDate(dtFim.getDate() + 10);

        const request = {
            initialPeriod: dtInit,
            finalPeriod: dtFim
        };

        this.toShowPrintLoader.emit(true);
        this.asoService.toPrintAsoReport(request).subscribe((response) => {
            openNewTab(URL.createObjectURL(response));

            this.toShowPrintLoader.emit(false);
        },
        (error) => {
            this.toShowPrintLoader.emit(false);
            this.appMessage.errorHandle(error, 'Não foi possível carregar as informações do relatório');
        });
    }

    formatEpi(epi: EpiWorkers): string {
        return epi.workerName + ' - CA' + epi.caEpiId.ca.ca;
    }

    formatAso(aso: Aso): string {
        return aso.workerName + ' - ' + 'EXAME OCUPACIONAL';
    }

    formatQualification(qualification: Qualification): string {
        return qualification.workerName + ' - ' + qualification.qualities.name;
    }

    public epiWorkersEntries() {
        return this.epiWorkersDateGroup.entries();
    }

    public getScroll(container: Number) {
        switch (container) {
            case this.epiContainer:
                return this.epiScroll.nativeElement;
            case this.asoContainer:
                return this.asoScroll.nativeElement;
            case this.qualificationContainer:
                return this.qualificationScroll.nativeElement;
        }
    }
}
