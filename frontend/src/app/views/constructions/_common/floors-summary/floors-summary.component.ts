import { Component, Input, EventEmitter, Output, ChangeDetectorRef, OnInit, OnDestroy, SimpleChanges } from '@angular/core';

import { SumSummaryCount, SummaryCount } from 'app/shared/util/generic/summary/summary-count';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { Sector } from 'app/shared/models/sector.model';
import { Floor } from 'app/shared/models/floor.model';
import { Risk } from 'app/shared/models/risk.model';

@Component({
    selector: 'floors-summary',
    templateUrl: 'floors-summary.component.html',
    styleUrls: ['floors-summary.component.scss']
})

export class FloorsSummaryComponent extends SumSummaryCount implements OnInit, OnDestroy {

    private static readonly sectorHeight = 64;

    private static readonly range = 9;

    scrollRange: number;

    set sectorOpened(sector: Sector) {
        if (sector !== this.sectorOpened) {
            this.sectorOpenedChange.next(sector);
        }
    }
    get sectorOpened() {
        return this.sectorOpenedChange.getValue();
    }

    @Input() set selectedFloor(floor: Floor) {
        if (this.selectedFloor !== floor) {
            this.selectedFloorChangeBehavior.next(floor);
        }
    }
    get selectedFloor() {
        return this.selectedFloorChangeBehavior.getValue();
    }

    @Input() showResume = false;
    @Input() showing = true;
    @Input() sectors: Sector[];
    @Input() coneChanged: Observable<void>;
    @Input() scrollContainerId: string;

    @Output() readonly showingChange = new EventEmitter<boolean>();
    @Output() readonly requestConstructionRedirect = new EventEmitter<void>();

    @Output() get selectedFloorChange() {
        return this.selectedFloorChangeBehavior.asObservable();
    }

    private readonly selectedFloorChangeBehavior = new BehaviorSubject<Floor>(null);
    private readonly sectorOpenedChange = new BehaviorSubject<Sector>(null);
    private readonly ngUnsubscribe = new Subject();

    constructor(private cd: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        if (this.coneChanged) {
            this.coneChanged.takeUntil(this.ngUnsubscribe).subscribe(() => this.cd.markForCheck());
        }

        this.sectorOpenedChange.subscribe(() => this.scrollRange = FloorsSummaryComponent.range);

        this.selectedFloorChange.takeUntil(this.ngUnsubscribe).subscribe((floor) => {
            if (floor) {
                this.sectorOpened = this.sectors.find(sector => sector.id === floor.sectorId);
            }
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
    }


    extractRisks(floor: Floor): Risk[] {
        const risks = [];
        if (floor.markers) {
            floor.markers.forEach(marker => {
                if (marker.cone) {
                    marker.cone.risks.forEach(risk => {
                        risks.push(risk);
                    });
                }
            });
        }
        return risks;
    }

    scroll() {
        this.scrollRange += FloorsSummaryComponent.range;
        this.cd.markForCheck();
    }

    scrollDistance(sector: Sector) {
        if (!this.scrollContainer || !this.scrollContainer.scrollHeight) {
            return 2;
        }

        const index = this.sectors.indexOf(sector);

        if (index > -1) {
            // Contagem de setores abaixo do setor aberto
            const count = this.sectors.length - 1 - index;
            // Calcula quantas partes de 10 (regra da biblioteca) a altura dos setores abaixo do "setor aberto" representa na altura total
            const part = 50 / (this.scrollContainer.scrollHeight / FloorsSummaryComponent.sectorHeight);
            // Retorna o valor + 2 (valor default da biblioteca para visualização)
            return (part * count) + 2;
        }
        return 0;
    }

    get scrollContainer(): HTMLElement {
        if (this.scrollContainerId) {
            return document.getElementById(this.scrollContainerId);
        }
        return null;
    }

    get summarys(): SummaryCount[] {
        return this.sectors ? this.sectors.map(sector => sector.summary) : null;
    }
}
