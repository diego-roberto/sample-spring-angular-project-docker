import { Component, OnInit, ViewChild } from '@angular/core';
import { MdPaginator, PageEvent } from '@angular/material';
import { ConstructionsService } from 'app/shared/services/constructions.service';
import { EmotionService } from 'app/shared/services/emotion.service';

interface MONTH {
    value: number;
    viewValue: string;
}

@Component({
    selector: 'emotions-chart',
    templateUrl: 'emotions-chart.component.html',
    styleUrls: ['./emotions-chart.component.scss'],
})

export class EmotionsChartComponent implements OnInit {
    @ViewChild(MdPaginator) paginator: MdPaginator;

    today = new Date();
    dateMonth: number;
    dateYear: number;
    totalDays: number;
    indexes: any = [];
    searchText = '';
    emotions: any[] = [];

    pageEvent: PageEvent;
    length: number;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    activePageEmotions: any[] = [];

    months: MONTH[] = [
        {value: 1, viewValue: 'Janeiro'},
        {value: 2, viewValue: 'Fevereiro'},
        {value: 3, viewValue: 'Março'},
        {value: 4, viewValue: 'Abril'},
        {value: 5, viewValue: 'Maio'},
        {value: 6, viewValue: 'Junho'},
        {value: 7, viewValue: 'Julho'},
        {value: 8, viewValue: 'Agosto'},
        {value: 9, viewValue: 'Setembro'},
        {value: 10, viewValue: 'Outrubro'},
        {value: 11, viewValue: 'Novembro'},
        {value: 12, viewValue: 'Dezembro'},
    ];

    constructor(
        public constructionService: ConstructionsService,
        public emotionService: EmotionService,
    ) {}

    ngOnInit(): void {
        this.paginator._intl.itemsPerPageLabel = "Itens por página"

        this.dateMonth = this.today.getMonth()+1;
        this.dateYear = this.today.getFullYear();

        this.drawChart();
    }

    drawChart(){
        this.emotions = [];
        this.emotionService.getWorkerEmotionsByConstructionIdAndMonthYear(
            this.constructionService.construction.id,
            this.dateMonth,
            this.dateYear
        ).subscribe(emotions => {
            emotions.workerEmotions.forEach(emotion => {
                this.emotions.push({name: emotion.workerName, statuses: emotion.feelings});
            });
            this.length = this.emotions.length;
            this.activePageEmotions = this.emotions.slice(0,this.pageSize);
        });

        this.totalDays = this.daysInMonth(this.dateMonth, this.dateYear);
        this.indexes = new Array(this.totalDays);

        for (let i = 0; i < this.totalDays; i++) {
            this.indexes[i] = i;
        }
    }

    searchWorkersEmotions(){
        this.drawChart();
    }

    getFilteredEmotions() {
        return this.searchText.length > 0 ? this.emotions.filter((filteredEmotions) => {
            return filteredEmotions.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1;
        }) : this.activePageEmotions;
    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    setPageSizeOptions(setPageSizeOptionsInput: string) {
        this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

    onPageChanged(e) {
        let firstCut = e.pageIndex * e.pageSize;
        let secondCut = firstCut + e.pageSize;
        this.activePageEmotions = this.emotions.slice(firstCut, secondCut);
    }
}
