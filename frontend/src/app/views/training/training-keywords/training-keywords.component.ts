import { forEach } from '@angular/router/src/utils/collection';
import { TrainingKeywordService } from 'app/shared/services/training-keyword.service';
import { Component, Input, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { ENTER } from '@angular/cdk';
import { TrainingKeyword } from 'app/shared/models/training-keyword.model';
import { TrainingService } from 'app/shared/services/training.service';
import { TrainingSchedulerService } from 'app/shared/services/training-scheduler.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { MdSnackBar } from '@angular/material';

@Component({
    selector: 'training-keywords',
    templateUrl: './training-keywords.component.html',
    styleUrls: ['./training-keywords.component.scss'],
    providers: [TrainingSchedulerService]
})
export class TrainingKeywordsComponent implements OnInit {

    @Input() selectedExhibitions: number;
    @Input() constructionId: number;
    @Input() selectedInput: any;
    @Input() disabled: boolean;
    @Input() query: string;
    @Output() selectedKeywords = new EventEmitter<any>();
    @ViewChild('trainingkeywords') kwElement: ElementRef;

    trainingKeywords: any;
    trainingKeywordInput: string;
    placeHolder: string;
    stateCtrl: FormControl;

    situation: string;
    currentCompany: any;
    separatorKeysCodes: number[] = [ENTER];
    bufferedQuery: any;

    inputKeywords: string;
    filteredKeywords: any;
    totalfilteredKeywords: any;

    keywords: Array<TrainingKeyword> = new Array<TrainingKeyword>();

    public selected: Array<TrainingKeyword> = new Array<TrainingKeyword>();

    constructor(
        public snackBar: MdSnackBar,
        public trainingService: TrainingService,
        public trainingSchedulerService: TrainingSchedulerService,
        public sessionsService: SessionsService,
        public trainingKeywordService: TrainingKeywordService,
    ) {
        this.stateCtrl = new FormControl();
        this.filteredKeywords = this.stateCtrl.valueChanges
            .debounceTime(400)
            .startWith('')
            .map(name => this.filterKeywords(name));
    }

    ngOnInit() {

        this.selected = [];

        if (typeof this.selectedInput !== 'undefined') {
            this.selected = this.selectedInput;
        }

        this.currentCompany = this.sessionsService.getCurrentCompany();
        this.situation = '';
        this.trainingKeywordService.getKeywords().subscribe(keywords => {

            this.keywords = keywords;
            this.placeHolder = 'Selecione as palavras-chave';
            if (this.selected.length > 0) {
                let vg = ' ';
                this.placeHolder = '';
                this.selected.forEach((item: any) => {
                    this.placeHolder = this.placeHolder + vg + item.keyword;
                    vg = ', ';
                });

            }
            this.addNotFoundItem();

        });

    }

    zeroResults() {
        return this.filterKeywords(this.query).length === 0;
    }

    filterKeywords(val: string) {
        this.bufferedQuery = val;
        let result = [];
        this.keywords.forEach(keyword => {
            if (keyword.keyword !== undefined) {
                if (keyword.keyword.toUpperCase().indexOf(val.toUpperCase().trim()) === 0 && keyword.id >= 0) {
                    result.push(keyword);
                }
            }
        });
        if (result.length === 0) {
            result = this.keywords.filter(s => s.id === -1);
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
        this.selectedKeywords.emit(this.selected);
    }

    insert(item) {
        if (this.selected.length === 5) {
            this.handleError('Não é possível escolher mais de 5 palavras-chave!');
        } else {
            this.selected.push(item);
            this.clean();
            //this.kwElement.nativeElement.blur();
        }
        this.kwElement.nativeElement.blur();
    }

    addNotFoundItem() {
        const item = new TrainingKeyword();
        item.keyword = 'Palavra-chave não enconrada! Clique aqui para inserir!';
        item.id = -1;
        this.keywords.push(item);
    }

    insertNew(keyword) {
        const item = new TrainingKeyword();
        item.keyword = keyword;
        item.id = 0;
        this.keywords.push(item);
        this.clean();
        //this.kwElement.nativeElement.blur();
        return item;
    }

    remove(item) {
        this.selected.splice(this.selected.indexOf(item), 1);
        this.clean();
        this.kwElement.nativeElement.blur();
    }

    isSelected(name: string): boolean {
        let found = false;
        this.selected.forEach(keyword => {
            if (name === keyword.keyword) {
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
        if (this.selected.length === 0) {
            this.placeHolder = 'Selecione a palavra chave';
        } else {
            this.placeHolder = '';
        }
    }

    @HostListener('focus', ['$event'])
    focusEventHandler() {
        this.situation = 'focus';
        this.stateCtrl.setValue('');
        this.placeHolder = 'Selecione a palavra chave';
    }

    @HostListener('focusout', ['$event'])
    focusOutEventHandler() {
        this.situation = 'focusout';
        this.placeHolder = '';
        let vg = ' ';
        if (this.selected.length === 0) {
            this.placeHolder = 'Selecione a palavra chave';
        } else {
            this.selected.forEach((item) => {
                this.placeHolder = this.placeHolder + vg + item.keyword;
                vg = ', ';
            });
        }
    }

    private handleError(msg) {
        this.snackBar.open(msg, null, { duration: 3000 });
    }

}
