import { forEach } from '@angular/router/src/utils/collection';
import { WorkerService } from 'app/shared/services/worker.service';
import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Worker } from 'app/shared/models/worker.model';
import { ENTER } from '@angular/cdk';
import { TrainingMinister } from 'app/shared/models/training-minister.model';
import { TrainingService } from 'app/shared/services/training.service';
import { TrainingSchedulerService } from 'app/shared/services/training-scheduler.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { MdSnackBar } from '@angular/material';
@Component({
    selector: 'ministers',
    templateUrl: './ministers.component.html',
    styleUrls: ['./ministers.component.scss']
})
export class MinistersComponent implements OnInit {
    @Input() selectedExhibitions: number;
    @Input() constructionId: number;
    @Input() selectedInput: any;
    @Input() disabled: boolean;
    @Output() ministrantesSelecionados = new EventEmitter<any>();
    ministrantes: any;
    ministranteinput: string;
    placeHolder: string;
    @Input() query: string;
    @ViewChild('keywords') kwElement: ElementRef;
    stateCtrl: FormControl;

    public selected: Array<TrainingMinister> = new Array<TrainingMinister>();
    situation: string;
    currentCompany: any;
    separatorKeysCodes: number[] = [ENTER];
    bufferedQuery: any;

    inputMinister: string;
    filteredMinisters: any;
    totalFilteredMinisters: any;
    ministers: Array<TrainingMinister> = new Array<TrainingMinister>();
    workers: Array<Worker> = [];

    constructor(
        public snackBar: MdSnackBar,
        public trainingService: TrainingService,
        public trainingSchedulerService: TrainingSchedulerService,
        public sessionsService: SessionsService,
        public workerService: WorkerService,
    ) {
        this.stateCtrl = new FormControl();
        this.filteredMinisters = this.stateCtrl.valueChanges
            .debounceTime(400)
            .startWith('')
            .map(name => this.filterMinister(name));
    }

    ngOnInit() {
        this.selected = [];

        if (typeof this.selectedInput !== 'undefined') {
            this.selected = this.selectedInput;
        }

        this.currentCompany = this.sessionsService.getCurrentCompany();

        this.situation = '';
        this.trainingService.getMinisters().subscribe(ministers => {
            this.ministers = ministers;
            this.ministers.sort(function(a, b){
                let nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
                if (nameA < nameB) //sort string ascending
                 return -1;
                if (nameA > nameB)
                 return 1;
                return 0; 
            })

            this.placeHolder = 'Selecione o ministrante';
            if (this.selected.length > 0) {
                let vg = ' ';
                this.placeHolder = '';
                this.selected.forEach((item) => {
                    this.placeHolder = this.placeHolder + vg + item.name;
                    vg = ', ';
                });

            }
           
            this.addNotFoundItem();
        });
    }


    zeroResults() {
        return this.filterMinister(this.query).length === 0;
    }

    filterMinister(val: string) {
        this.bufferedQuery = val;
        let result = this.ministers.filter(s => s.name.toLowerCase().indexOf(val.toLowerCase().trim()) === 0
            && s.id >= 0
        );
        if (result.length === 0) {
            result = this.ministers.filter(s => s.id === -1);
        }
        return result;
    }

    process(item, isSelected) {
        if (item.id === -1) {
            const newItem = this.insertNew(this.bufferedQuery);
            this.insert(newItem);
            this.focusOutEventHandler();
        } else {
            if (isSelected) {
                this.remove(item);
            } else {
                this.insert(item);
            }
        }
        this.ministrantesSelecionados.emit(this.selected);
    }

    insert(item) {
        if (this.selected.length === 5) {
            this.handleError('Não é possível escolher mais de 5 ministrantes');
        } else {
            this.selected.push(item);
            this.clean();
            this.kwElement.nativeElement.blur();
        }
        this.kwElement.nativeElement.blur();
    }

   
    addNotFoundItem() {
        const item = new TrainingMinister();
        item.name = 'Não encontrado! Clique aqui para inserir!';
        item.id = -1;
        item.workerId = -1;
        this.ministers.push(item);
    }

    insertNew(name) {
        const item = new TrainingMinister();
        item.name = name;
        item.id = 0;
        item.workerId = 0;
        this.ministers.push(item);
        this.clean();
        this.kwElement.nativeElement.blur();
        return item;
    }

    remove(item) {
        this.selected.splice(this.selected.indexOf(item), 1);
        this.clean();
        this.kwElement.nativeElement.blur();
    }

    isSelected(name: string): boolean {
        let found = false;
        this.selected.forEach(minister => {
            if (name === minister.name) {
                found = true;
            }
        });
        return found;
    }


    clean() {
        this.query = '';
    }

    @HostListener('blur', ['$event'])
    blurEventHandler() {
        this.query = '';
        this.situation = 'blur';
        this.placeHolder = '';
    }


    @HostListener('focus', ['$event'])
    focusEventHandler() {
        this.situation = 'focus';
        this.stateCtrl.setValue('');
        this.placeHolder = 'Selecione o ministrante';
    }

    @HostListener('focusout', ['$event'])
    focusOutEventHandler() {
        this.situation = 'focusout';
        this.placeHolder = '';
        let vg = ' ';
        if (this.selected.length > 0) {
            this.selected.forEach((item) => {
                this.placeHolder = this.placeHolder + vg + item.name;
                vg = ', ';
            });
        } else {
            this.placeHolder = 'Selecione o ministrante';
        }

    }

    private handleError(msg) {
        this.snackBar.open(msg, null, { duration: 3000 });
    }

}
