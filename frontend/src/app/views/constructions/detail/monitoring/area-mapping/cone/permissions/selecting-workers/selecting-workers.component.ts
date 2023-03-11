import { Component, OnChanges, OnInit, OnDestroy, Input, Output, SimpleChanges, EventEmitter, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Worker } from 'app/shared/models/worker.model';

@Component({
    selector: 'selecting-workers',
    templateUrl: 'selecting-workers.component.html',
    styleUrls: ['selecting-workers.component.scss']
})

export class SelectingWorkersComponent implements OnChanges, OnInit, OnDestroy {

    public get search() {
        return this.searchChange.getValue();
    }
    public set search(search: string) {
        this.searchChange.next(search);
    }

    public get filteredWorkers(): Worker[] {
        return this.filteredWorkersChange.getValue();
    }
    public set filteredWorkers(filtered: Worker[]) {
        if (this.filteredWorkers !== filtered) {
            this.filteredWorkersChange.next(filtered);
        }
    }

    @Input() emptyMessage: string;
    @Input() viewMode = false;

    @Input()
    get workers(): Worker[] {
        return this.workersChange.getValue();
    }
    set workers(workers: Worker[]) {
        if (this.workers !== workers) {
            this.workersChange.next(workers);
        }
    }

    private get selectedWorkers(): Worker[] {
        return this.selectedWorkersChange.getValue();
    }
    private set selectedWorkers(selected: Worker[]) {
        if (this.selectedWorkers !== selected) {
            this.selectedWorkersChange.next(selected);
        }
    }

    private readonly workersChange = new BehaviorSubject<Worker[]>([]);
    private readonly selectedWorkersChange = new BehaviorSubject<Worker[]>([]);
    private readonly filteredWorkersChange = new BehaviorSubject<Worker[]>([]);

    private readonly searchChange = new BehaviorSubject<string>('');
    private readonly internalWorkersChange = new EventEmitter<boolean>();

    private readonly ngUnsubscribe = new Subject<void>();

    scrollWorkers: Worker[] = [];

    @ViewChild('workersListing') private workersListing: ElementRef;

    @Input() checkAbleWorker: (worker: Worker) => boolean = (worker) => { return true; };

    ngOnInit() {
        Observable.merge(
            this.workersChange.asObservable(),
            this.internalWorkersChange.asObservable(),
            this.searchChange.asObservable()
        )
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                this.filteredWorkers = this.workers ? this.workers.filter(worker => {
                    return (!
                        (this.search && this.search.length > 0 && worker.name.toLowerCase().indexOf(this.search.toLowerCase()) === -1)
                    );
                }) : [];
            });
    }

    ngOnChanges(changes: SimpleChanges) { }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    requestSelected(): Worker[] {
        const selected = Object.assign([], this.selectedWorkers);

        this.selectedWorkers.forEach((worker) => {
            const indexToRemove = this.workers.indexOf(worker);

            if (indexToRemove >= 0) {
                this.workers.splice(indexToRemove, 1);
            } else {
                throw new Error('Internal error: The selected worker is not on the original list');
            }
        });

        while (this.selectedWorkers.pop()) { };

        this.internalWorkersChange.emit();

        return selected;
    }

    public get all(): boolean {
        if (this.selectedWorkers.length !== this.filteredWorkers.length) {
            return false;
        }

        for (let i = 0; i < this.selectedWorkers.length; i++) {
            if (this.filteredWorkers.indexOf(this.selectedWorkers[i]) === -1) {
                return false;
            }
        }

        return true;
    }

    public set all(all: boolean) {
        this.selectedWorkers = all ? [].concat(this.filteredWorkers) : [];
    }

    public select(worker: Worker, select: boolean) {
        const i = this.selectedWorkers.indexOf(worker);
        if (select) {
            if (i === -1) {
                this.selectedWorkers.push(worker);
            } else {
                throw new Error('The worker is already added');
            }
        } else {
            if (i > -1) {
                this.selectedWorkers.splice(i, 1);
            } else {
                throw new Error('The worker is not added');
            }
        }
    }

    public selected(worker: Worker) {
        return this.selectedWorkers.indexOf(worker) > -1;
    }

    get parentScroll() {
        if (this.workersListing) {
            return this.workersListing.nativeElement;
        }
        return null;
    }
}
