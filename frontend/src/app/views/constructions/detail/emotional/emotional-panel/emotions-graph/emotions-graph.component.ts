import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSlider } from '@angular/material';
import { ConstructionsService } from 'app/shared/services/constructions.service';
import { EmotionService, FeelingsEnum } from 'app/shared/services/emotion.service';
import { BaseChartDirective } from 'ng2-charts';

interface MONTH {
    value: number;
    viewValue: string;
}

@Component({
    selector: 'emotions-graph',
    templateUrl: 'emotions-graph.component.html',
    styleUrls: ['./emotions-graph.component.scss']
})
export class EmotionsGraphComponent implements OnInit {

    @ViewChild(MdSlider) slider: MdSlider;
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    loaded = false;

    emotions: any[] = [];
    today = new Date();
    dateMonth: number;
    dateYear: number;
    totalDays: number;
    indexes: string[] = [];
    feelingsList: any[] = [];

    maxnumber: number;
    steps: number;
    scale: number;
    lineChartData: Array<any> = [];
    colors = [{}];
    lineChartLabels: Array<any>;
    lineChartOptions: any;
    lineChartLegend: boolean = false;
    lineChartType = 'line';
    graphType: number = 1;

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

    ngOnInit() {
        this.dateMonth = this.today.getMonth()+1;
        this.dateYear = this.today.getFullYear();
        this.initGraph();
    }

    async initGraph() {
        this.totalDays = this.daysInMonth(this.dateMonth, this.dateYear);
        this.indexes = new Array(this.totalDays);
        this.lineChartLabels = this.indexes;

        for (let i=0; i<this.totalDays; i++) { this.indexes[i] = String(i+1); }

        await this.getEmotions();

        this.drawGraph();
    }

    drawGraph(){
        this.lineChartData = [];
        this.lineChartOptions = {};

        this.maxnumber = this.constructionService.construction.workers.length;
        this.steps = 8; // (eixo Y) deixar editavel?
        this.scale = Math.ceil(this.maxnumber/this.steps);

        this.lineChartData = [
            { lineTension: 0.2, borderWidth: 1.5, data: this.emotions[0].angryCount, label: 'Irritado', fill: false, tooltip: false, backgroundColor: 'rgba(206, 0, 0, 0.4)', borderColor: '#f93535' },
            { lineTension: 0.2, borderWidth: 1.5, data: this.emotions[0].sadCount, label: 'Triste', fill: false, tooltip: false, backgroundColor: 'rgba(19, 175, 203, 0.4)', borderColor: 'rgb(19, 175, 203)' },
            { lineTension: 0.2, borderWidth: 1.5, data: this.emotions[0].gladCount, label: 'Contente', fill: false, tooltip: false, backgroundColor: 'rgba(0, 167, 126, 0.4)', borderColor: 'rgb(0, 167, 126)' },
            { lineTension: 0.2, borderWidth: 1.5, data: this.emotions[0].excitedCount, label: 'Empolgado', fill: false, tooltip: false, backgroundColor: 'rgba(243, 192, 50, 0.4)', borderColor: 'rgb(243, 192, 50)' },
            { lineTension: 0.2, borderWidth: 1.5, data: this.emotions[0].notAnsweredCount, label: 'Não Respondido', fill: false, tooltip: false, backgroundColor: 'rgba(153, 153, 153, 0.4)', borderColor: 'rgb(153, 153, 153)' }
        ]

        this.lineChartOptions = {
            tooltips: { enabled: true },
            fill: true,
            responsive: true,
            maintainAspectRatio: false,
            elements: { point: { radius:0.7, hoverRadius:7, hitRadius:5 } },
            scales: {
                xAxes: [{
                    // ticks:{ autoSkipPadding:270 }, (eixo Y) deixar editavel?
                    gridLines: { color: 'rgba(0, 0, 0, 0)' },
                    scaleLabel: { display: true, labelString: 'Dias' }
                }
                ],
                yAxes: [{
                    ticks: { beginAtZero: true, fixedStepSize: this.scale },
                    scaleLabel: { display: true, labelString: 'Trabalhadores', positionLabelString: 'bottom' }
                }]
            }
        }
    }

    getEmotions() {
        this.emotions = [];
        this.feelingsList = [];
        return new Promise((resolve) => {

            this.emotionService.getWorkerEmotionsByConstructionIdAndMonthYear(
                this.constructionService.construction.id,
                this.dateMonth,
                this.dateYear
            ).subscribe(emotions => {
                emotions.workerEmotions.forEach(we => {
                    this.feelingsList.push(we.feelings);
                });
                this.emotions = this.emotionCount(this.feelingsList);
                resolve(true);
            });
        });
    }

    emotionCount(feelingsList: any[]) {
        let angryCount: number[] = [];
        let sadCount: number[] = [];
        let gladCount: number[] = [];
        let excitedCount: number[] = [];
        let notAnsweredCount: number[] = [];

        let anCount: number = 0;
        let saCount: number = 0;
        let glCount: number = 0;
        let exCount: number = 0;
        let ntCount: number = 0;

        let totalCount: any[] = [];

        feelingsList.forEach(feelings => {
            feelings.forEach(function (feeling, i) {
                anCount = saCount = glCount = exCount = ntCount = 0;

                switch(feeling){
                  case FeelingsEnum.IRRITADO:
                    anCount++;
                    break;

                  case FeelingsEnum.TRISTE:
                    saCount++;
                    break;

                  case FeelingsEnum.CONTENTE:
                    glCount++;
                    break;

                  case FeelingsEnum.EMPOLGADO:
                    exCount++;
                    break;

                  case FeelingsEnum.NAO_RESPONDIDO:
                    ntCount++;
                    break;

                  default:
                    ntCount++;
                }

                angryCount[i] = (angryCount[i] + anCount) || anCount;
                sadCount[i] = (sadCount[i] + saCount) || saCount;
                gladCount[i] = (gladCount[i] + glCount) || glCount;
                excitedCount[i] = (excitedCount[i] + exCount) || exCount;
                notAnsweredCount[i] = (notAnsweredCount[i] + ntCount) || ntCount;

            });
        });

        totalCount.push({
            angryCount: angryCount,
            sadCount: sadCount,
            gladCount: gladCount,
            excitedCount: excitedCount,
            notAnsweredCount: notAnsweredCount
        });
        return totalCount;
    }

    changeGraph() {
        if (this.graphType == 1){
            this.graphType = 2;
            this.lineChartType = 'bar';
        } else {
            this.graphType = 1;
            this.lineChartType = 'line';
        }
    }

    changeLegend() {
        this.lineChartLegend = !this.lineChartLegend;
    }

    searchWorkersEmotions(){
        this.initGraph();
    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

}
