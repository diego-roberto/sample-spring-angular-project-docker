import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { ConstructionsService } from '../../../shared/services/constructions.service';
import { EpiService } from '../../../shared/services/epi.service';
import { InfoDialogHandler } from "app/shared/util/generic/info-dialog/info-dialog.handler";
import { EpiDeliveryChart } from "app/shared/models/epi-delivery-chart.model";
import { DashboardService } from "app/shared/services/dashboard.service";
import { MdDialog } from '@angular/material';
import { EpiDeliveryChartFilter } from "app/shared/models/epi-delivery-chart-filter.model";
import { AppMessageService } from "app/shared/util/app-message.service";

@Component({
    selector: 'epi-delivery-details-chart',
    templateUrl: './epi-delivery-details-chart.component.html',
    styleUrls: ['./epi-delivery-details-chart.component.scss']
})
export class EpiDeliveryDetailsChartComponent implements OnInit {

    chartOption: any;
    chartTitle = 'EPI';
    emptyChart = true;

    listLabels: Array<string> = new Array<string>();
    listLegends: any;

    _filter: DashboardFilter;

    listValues: EpiDeliveryChart[];

    listLegend = [];
    listSeriesFull = [];
    listSeriesShow = [];

    limitItems = 3;
    posiItems = 0;

    listEpiDeliveryChartFilter: Array<EpiDeliveryChartFilter> = new Array();
    listEpiDeliveryChartShow: Array<EpiDeliveryChartFilter> = new Array();

    colors: string[] = ['#FC5E5E', '#00A77E', '#FFBB1A', '#13AFCB'];

    @Input()
    set filter(dashboardFilter: DashboardFilter) {
        this._filter = dashboardFilter;
        this.updateChart(this._filter);
    }

    get filter(): DashboardFilter {
        return this._filter;
    }

    constructor(
        private appMessage: AppMessageService,
        private dashboardService: DashboardService,
        private constructionService: ConstructionsService,
        private epiService: EpiService,
        private infoDialogHandler: InfoDialogHandler,
        private dialog: MdDialog
    ) { }

    ngOnInit() {
        this.updateChart(this._filter);
    }

    updateChart(dashboardFilter: DashboardFilter) {
        let filterRequest = { dashboardFilter: dashboardFilter };

        this.epiService.getEpiDeliveryDetailChart(filterRequest).subscribe(items => {
                this.emptyChart = items.length == 0;
                this.populateLists(dashboardFilter, items);
                this.buildChart();
        },
        error => {
            this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico ' + this.chartTitle);
        });
    }

    getItem(items: EpiDeliveryChart[], legend, id): EpiDeliveryChart {
        let ret = null;
        items.forEach(item => {
            if (item.epiTypeId === id && item.legend == legend) {
                ret = item;
            }
        });
        return ret;
    }

    toggleActiveFilter(item: EpiDeliveryChartFilter) {
        item.selected = !item.selected;
        this.updateSeriesShow(item);
    }

    updateSeriesShow(item: EpiDeliveryChartFilter) {
        if (item.selected) {
            let serie = null;
            this.listSeriesFull.forEach(itemSerie => {
                if (itemSerie.epiTypeId == item.epiTypeId) {
                    serie = itemSerie
                }
            });
            this.listSeriesShow.push(serie);
        } else {
            this.listSeriesShow = this.listSeriesShow.filter(serie => item.epiTypeId != serie.epiTypeId);
        }
        this.buildChart();
    }

    nextItem() {
        this.posiItems++;
        this.updateListChecklistChartShow();
    }

    previousItem() {
        this.posiItems--;
        this.updateListChecklistChartShow();
    }

    updateListChecklistChartShow() {
        this.listEpiDeliveryChartShow = [];

        for (var index = 0; index < this.limitItems; index++) {
            const item = this.listEpiDeliveryChartFilter[index + this.posiItems];
            if (item) {
                this.listEpiDeliveryChartShow.push(item);
            }
        }
    }

    populateLists(dashboardFilter: DashboardFilter, items: EpiDeliveryChart[]) {

        this.listEpiDeliveryChartFilter = [];
        let seriesId = [];

        this.listSeriesFull = [];
        this.listSeriesShow = [];

        let index = 0;
        items.forEach(item => {
            if (seriesId.indexOf(item.epiTypeId) < 0) {
                let color = this.colors[index];
                seriesId.push(item.epiTypeId);
                index = index + 1;

                let serie = { color: color, name: item.epiType, type: 'line', epiTypeId: item.epiTypeId, data: [] };
                this.listSeriesFull.push(serie);
                this.listSeriesShow.push(serie);

                this.listLabels.push(item.epiType);

                let it = new EpiDeliveryChartFilter;
                it.description = item.epiType;
                it.epiTypeId = item.epiTypeId;
                it.selected = true;
                this.listEpiDeliveryChartFilter.push(it);
            }
        });

        this.listEpiDeliveryChartFilter = this.listEpiDeliveryChartFilter.sort(function (a, b) {
            return a.description.localeCompare(b.description);
        });

        this.listLegends = this.dashboardService.generateLegends(dashboardFilter);
        this.listLegends.forEach(legend => {

            this.listSeriesFull.forEach(serie => {
                let vl = this.getItem(items, legend, serie.epiTypeId);

                if (vl != null) {
                    serie.data.push(vl.epiValue);
                    items = items.filter(it => it != vl);
                } else {
                    serie.data.push(0);
                }

            });

        });

        this.updateListChecklistChartShow();

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
                        tip += s.marker + s.seriesName + ': ' + s.value.toLocaleString('pt-BR') + '<br />';  
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
                    data: this.listLegends
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

    showInfo() {
        this.infoDialogHandler.call(
            'atenção', 'EPI: mostra o total de EPI entregue no período, por tipo de EPI.'
        );
    }

}
