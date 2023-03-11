import { Component, Input, OnInit, OnChanges, ViewChild, EventEmitter, Output, SimpleChanges, DoCheck } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';

import { SelectingWorkersComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/permissions/selecting-workers/selecting-workers.component';
import { Epi } from 'app/shared/models/epi.model';
import { Qualities } from 'app/shared/models/qualities.model';
import { Worker } from 'app/shared/models/worker.model';
import { SafetyCardComponent } from 'app/shared/components/safety-card';

@Component({
    selector: 'permissions-component',
    styleUrls: ['permissions.component.scss'],
    templateUrl: 'permissions.component.html'
})
export class PermissionsComponent implements OnInit, OnChanges {

    private avaibleValue: Worker[];
    private selectedValue: Worker[] = [];

    get avaible(): Worker[] {
        return this.avaibleValue;
    }
    set avaible(workers: Worker[]) {
        if (workers !== this.avaibleValue) {
            this.avaibleValue = workers;
            this.avaibleChange.emit(this.avaibleValue);
        }
    }

    @Input() viewMode = false;

    @Input() workers: Worker[] = [];
    @Input() qualities: Qualities[] = [];
    @Input() epis: Epi[] = [];

    @Input()
    public get selected(): Worker[] {
        return this.selectedValue;
    }
    public set selected(workers: Worker[]) {
        if (workers !== this.selectedValue) {
            this.selectedValue = workers;
            this.selectedChange.emit(this.selectedValue);
        }
    }

    @Output() readonly avaibleChange = new EventEmitter<Worker[]>();
    @Output() readonly selectedChange = new EventEmitter<Worker[]>();
    @Output() readonly workersValid = new EventEmitter<boolean>();

    @ViewChild('cardEpis') cardEpis: SafetyCardComponent;
    @ViewChild('cardQualities') cardQualities: SafetyCardComponent;

    @ViewChild('avaibleWorkers') avaibleView: SelectingWorkersComponent;
    @ViewChild('selectedWorkers') selectedView: SelectingWorkersComponent;

    @Input() checkAbleWorker: (worker: Worker) => boolean = (worker) => true;

    constructor(private media: ObservableMedia) { }

    ngOnChanges(changes: SimpleChanges) {
        if (this.workers && !this.avaible) {
            this.avaible = [].concat(this.workers);
        }

        if (changes.selected) {
            this.selected.forEach(worker => {
                const index = this.avaible.findIndex(avaible => worker.id === avaible.id);

                if (index > -1) {
                    this.avaible.splice(index, 1);
                }
            });
        }
    }

    ngOnInit(): void {
        this.workersValid.emit(true);

        this.cardEpis.close();
        this.cardQualities.close();
    }

    add() {
        this.selected = this.avaibleView.requestSelected().concat(this.selected);
    }

    remove() {
        this.avaible = this.selectedView.requestSelected().concat(this.avaible);
        this.selectedChange.emit(this.selected);
    }

    get avaibleEmptyMessage(): string {
        return this.selected && this.workers && this.selected.length === this.workers.length ? 'Todos os trabalhadores estão relacionados à obra' : 'Nenhum trabalhador encontrado';
    }

    get selectedEmptyMessage(): string {
        return this.avaible && this.workers && this.avaible.length === this.workers.length ? 'Nenhum trabalhador relacionado à obra' : 'Nenhum trabalhador encontrado';
    }

    get xs() {
        return this.media.isActive('xs');
    }
}
