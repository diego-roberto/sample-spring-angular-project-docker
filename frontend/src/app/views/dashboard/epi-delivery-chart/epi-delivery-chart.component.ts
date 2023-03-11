import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { ConstructionsService } from '../../../shared/services/constructions.service';
import { EpiService } from '../../../shared/services/epi.service';
import { InfoDialogHandler } from "app/shared/util/generic/info-dialog/info-dialog.handler";
import { EpiDeliveryChart } from "app/shared/models/epi-delivery-chart.model";
import { DashboardService } from "app/shared/services/dashboard.service";
import { MdDialog } from '@angular/material';
import { AppMessageService } from "app/shared/util/app-message.service";
import { EpiDeliveryDetailsChartComponent } from '../epi-delivery-details-chart/epi-delivery-details-chart.component';

@Component({
  selector: 'epi-delivery-chart',
  templateUrl: './epi-delivery-chart.component.html',
  styleUrls: ['./epi-delivery-chart.component.scss']
})
export class EpiDeliveryChartComponent implements OnInit {

  labelArray: any;
  delayedArray: any;
  concludedArray: any;

  chartOption: any;
  chartTitle = 'EPI';

  listLabels: Array<string> = new Array<string>();
  listSeries: Array<any>;
  listLegends: any;

  mode: String = "synthetic";

  emptyChart = true;

  _filter: DashboardFilter;

  @Input()
  set filter(dashboardFilter: DashboardFilter) {
    this._filter = dashboardFilter;
    this.updateChart(this._filter);
  }

  get filter(): DashboardFilter {
    return this._filter;
  }

  constructor(
    private dashboardService: DashboardService,
    private constructionService: ConstructionsService,
    private epiService: EpiService,
    private appMessage: AppMessageService,
    private infoDialogHandler: InfoDialogHandler,
    private dialog: MdDialog
  ) { }

  ngOnInit() {
    this.updateChart(this._filter);
  }

  updateChart(dashboardFilter: DashboardFilter) {

    if (dashboardFilter === undefined) {

      let today = new Date();
      let oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      dashboardFilter = new DashboardFilter();
      dashboardFilter.beginAt = oneMonthAgo;
      dashboardFilter.endAt = today;

    }

    this.epiService.updateChart(dashboardFilter, this.mode).subscribe(
      res => {
        this.emptyChart = res.length == 0;
        this.populateLists(dashboardFilter, res);
        this.buildChart();
      }
    );
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

  populateLists(dashboardFilter: DashboardFilter, items: EpiDeliveryChart[]) {

    this.listSeries = [];
    let seriesId = [];

    items.forEach(item => {
      if (seriesId.indexOf(item.epiTypeId) < 0) {
        this.listSeries.push(
          { name: item.epiType, type: 'line', epiTypeId: item.epiTypeId, data: [] }
        );
        seriesId.push(item.epiTypeId);
        this.listLabels.push(item.epiType);
      }
    });

    this.listLegends = this.dashboardService.generateLegends(dashboardFilter);
    this.listLegends.forEach(legend => {
      seriesId.forEach(id => {
        let vl = this.getItem(items, legend, id);
        this.listSeries.forEach(serie => {
          if (serie.epiTypeId == id) {
            if (vl != null) {
              serie.data.push(vl.epiValue);
              items = items.filter(it => it != vl);
            } else {
              serie.data.push(0);
            }
          }
        });
      });
    });
  }

  buildChart() {

    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        formatter: function (p: any) {
          let tip: String;
          tip = p[0].name + '<br />';
          tip += p[0].marker + ' ' + p[0].value.toLocaleString('pt-BR') + ' EPI<br />';
          return tip;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.listLegends
      },  
      yAxis: {
        type: 'value',
        splitNumber: 5,
        minInterval: 1
      },
      series: this.listSeries
    };
  }

  showInfo() {
    this.infoDialogHandler.call(
      'atenção', 'EPI: mostra a quantidade total de EPI entregue no período e nas obras selecionadas. Para visualisar o gráfico orientado por Tipo de EPI, acesse Mais Detalhes.'
    );
  }

  dummyConfig() {
    this.chartOption = { title: { text: '' }, tooltip: { trigger: 'axis' }, legend: { data: ['CABEÇA', 'OLHOS E FACE', 'AUDITIVA', 'RESPIRATÓRIA', 'TRONCO', 'MEMBROS SUPERIORES', 'MEMBROS INFERIORES', 'CORPO INTEIRO', 'CONTRA QUEDAS'] }, grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }, toolbox: { feature: { saveAsImage: {} } }, xAxis: { type: 'category', boundaryGap: false, data: ['JAN‌-2018', 'FEV‌-2018', 'MAR‌-2018', 'ABR‌-2018', 'MAI‌-2018', 'JUN‌-2018', 'JUL‌-2018'] }, yAxis: { type: 'value' }, series: [{ name: 'CABEÇA', type: 'line', stack: '', data: [120, 132, 101, 134, 90, 230, 210] }, { name: 'OLHOS E FACE', type: 'line', stack: '', data: [220, 182, 191, 234, 290, 330, 310] }, { name: 'AUDITIVA', type: 'line', stack: '', data: [150, 232, 201, 154, 190, 330, 410] }, { name: 'RESPIRATÓRIA', type: 'line', stack: '', data: [320, 332, 301, 334, 390, 330, 320] }, { name: 'TRONCO', type: 'line', stack: '', data: [25, 39, 91, 94, 129, 133, 132] }, { name: 'MEMBROS SUPERIORES', type: 'line', stack: '', data: [52, 93, 9, 93, 190, 153, 120] }, { name: 'MEMBROS INFERIORES', type: 'line', data: [91, 37, 52, 14, 58, 19, 65] }, { name: 'CORPO INTEIRO', type: 'line', data: [81, 47, 62, 41, 85, 100, 56] }, { name: 'CONTRA QUEDAS', type: 'line', data: [19, 73, 58, 82, 26, 15, 78] }] };
  }

  openDetails() {

    const openDialog = !this.emptyChart;
      if (openDialog) {
        const dialogRef = this.dialog.open(EpiDeliveryDetailsChartComponent);
        dialogRef.componentInstance.chartTitle = this.chartTitle;
        dialogRef.componentInstance._filter = this._filter;

        dialogRef.afterClosed().subscribe(result => {
        if (result === 'Sim') {
        }        
      });
    } else {
      this.appMessage.showError('Não há dados a serem exibidos!');
    }

  }

}
