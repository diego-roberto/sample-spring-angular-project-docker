import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { AppMessageService } from "app/shared/util/app-message.service";
import { ChecklistService } from "app/shared/services/checklist.service";
import { DashboardService } from "app/shared/services/dashboard.service";

import { DashboardFilter } from "app/shared/models/dashboard-filter";
import { PotentialPenaltyChart } from "app/shared/models/potential-penalty-chart.model";
import { PotentialPenaltyDetailChart } from "app/shared/models/potential-penalty-detail-chart.model";
import { ChecklistChartFilter } from "app/shared/models/checklist-chart-filter";

@Component({
  selector: 'potential-penalty-details-chart',
  templateUrl: './potential-penalty-details-chart.component.html',
  styleUrls: ['./potential-penalty-details-chart.component.scss']
})
export class PotentialPenaltyDetailsChartComponent implements OnInit {
	chartTitle = '';
    dashboardFilter: DashboardFilter;

    chartOption;

    listValues: PotentialPenaltyDetailChart[];

    listLegend = [];
    listSeriesFull = [];
    listSeriesShow = [];

    limitItems = 3;
    posiItems = 0;

    listChecklistChartFilter: Array<ChecklistChartFilter> = new Array();
    listChecklistChartShow: Array<ChecklistChartFilter> = new Array();

    colors: string[] = ['#FC5E5E', '#00A77E', '#FFBB1A', '#13AFCB'
        // , '#61A0A8', '#D48265', '#91C7AE', '#749F83',  '#CA8622', '#BDA29A', '#6E7074', '#546570', '#C4CCD3', '#2F4554'
    ];

    constructor(
        private dashboardService: DashboardService,
        public dialogRef: MdDialogRef<PotentialPenaltyDetailsChartComponent>,
        private appMessage: AppMessageService,
        private checklistService: ChecklistService
    ) { }

    ngOnInit() {
        this.checklistService.getChecklistChart().subscribe(listChecklist => {
            listChecklist = listChecklist.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

            listChecklist.forEach( item => {
                if(item.sesiBelongs){
                    let fil = new ChecklistChartFilter();
                    fil.checklistFatherId = item.fatherId;
                    fil.description = item.name;
                    fil.selected = true;

                    this.listChecklistChartFilter.push(fil);
                }
            })

            this.findValues();
        },
        error => {
            this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Potencial de multa!');
        });        

    }

    findValues(){
        let filterRequest = { dashboardFilter: this.dashboardFilter };

        this.checklistService.getPotentialPenaltyDetailChart(filterRequest).subscribe(items => {
            this.listValues = items;
            this.populateLists();
            this.buildChart();
        },
        error => {
            this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Potencial de multa!');
        });
    }

    updateSeriesShow(item: ChecklistChartFilter){
        if(item.selected) {
            let serie = null;
            this.listSeriesFull.forEach(itemSerie => {
                if(itemSerie.fatherId == item.checklistFatherId){
                    serie = itemSerie
                }
            });
            this.listSeriesShow.push(serie);
        } else {
            this.listSeriesShow = this.listSeriesShow.filter(serie => item.checklistFatherId != serie.fatherId);
        }
        this.buildChart();
    }

    toggleActiveFilter(item: ChecklistChartFilter) {
        item.selected = !item.selected;
        this.updateSeriesShow(item);
    }

    nextItem(){
        this.posiItems++;
        this.updateListChecklistChartShow();
    }

    previousItem(){
        this.posiItems--;
        this.updateListChecklistChartShow();
    }

    updateListChecklistChartShow(){
        this.listChecklistChartShow = new Array();

        for (var index = 0; index < this.limitItems; index++) {
            const item = this.listChecklistChartFilter[index + this.posiItems];
            if(item){
                this.listChecklistChartShow.push(item);
            }
        }

    }

    populateLists(){
        let listFatherId = [];
        this.listSeriesFull = [];     

        this.listLegend = this.dashboardService.generateLegends(this.dashboardFilter);

        this.listValues.forEach(item => {
            const legend = item.legend.toUpperCase();

            if(this.listLegend.indexOf(legend) < 0){
                this.listLegend.push(legend);
            }

            const fatherId = item.checklistFatherId;
            if(listFatherId.indexOf(fatherId) < 0){
                listFatherId.push(fatherId);
            }
        });

        for (let index = 0; index < listFatherId.length; index++) {
            const fatherId = listFatherId[index];
            
            let values = [];
            this.listLegend.forEach(legend => {
                values.push(this.getValue(fatherId, legend));
            })

            let serie = this.populateSerie(fatherId, values, index);
            this.listSeriesFull.push(serie);
            this.listSeriesShow.push(serie);
        }

        this.listChecklistChartFilter = this.listChecklistChartFilter.filter(chk => listFatherId.indexOf(chk.checklistFatherId) >= 0);
        this.updateListChecklistChartShow();
    }

    populateSerie(fatherId, values, index){
        let name = '' + fatherId;
        this.listChecklistChartFilter.forEach(item => {
            if(item.checklistFatherId == fatherId){
                name = item.description;
            }
        });

        let color = this.colors[index];
        let serie = { type: 'line', fatherId: fatherId, color: color, name: name, data: values };
        return serie;
    }

    getValue(fatherId, legend) : number {
        let toRemove = null;
        let ret = 0;
        this.listValues.forEach(item => {
            if(item.legend.toUpperCase() == legend && item.checklistFatherId == fatherId){
                ret = item.qtde;
                toRemove = item;
            }
        });
        
        if(toRemove != null){
            this.listValues = this.listValues.filter(item => item != toRemove);
        }

        return ret;
    }

    buildChart() {
        this.chartOption = {
            grid:{ left: '3%', right: '4%', bottom: '3%', containLabel: true },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function(p: any) {
                    let tip: String;
                    tip =  p[0].name + '<br />';
                    p.forEach(s => {
                        tip += s.marker + s.seriesName + ': R$ ' + s.value.toLocaleString('pt-BR') + '<br />';  
                    });
                    return tip;
                }
            },
            toolbox: {
                show: false,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: { }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: this.listLegend
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    minInterval: 1,
                    axisLabel: { formatter: function (value, index) {
                            return  value.toLocaleString('pt-BR');
                        }
                    }
                }
            ],
            series: this.listSeriesShow

        };
    }

}
