import { Component, OnInit, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { InfoDialogHandler } from "app/shared/util/generic/info-dialog/info-dialog.handler";
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { AppMessageService } from "app/shared/util/app-message.service";
import { AsoService } from "app/shared/services/aso.service";
import { WorkerAsoChart } from "app/shared/models/worker-aso-chart.model.";
import { DashboardService } from "app/shared/services/dashboard.service";

@Component({
  selector: 'worker-aso-chart',
  templateUrl: './worker-aso-chart.component.html',
  styleUrls: ['./worker-aso-chart.component.scss']
})
export class WorkerAsoChartComponent implements OnInit {

  emptyChart = true;
  chartTitle = 'ASO';
  chartOption;
  filterRequest;
  first = true;

  listLegend = [];
  listProprioRealizado = [];
  listProprioAtrasado = [];
  listTerceiroRealizado = [];
  listTerceiroAtrasado = [];

  lgPropriosRealizados = 'PRÓPRIOS REALIZADOS';
  lgPropriosAtrasados = 'PRÓPRIOS ATRASADOS';
  lgTerceirosRealizados = 'TERCEIROS REALIZADOS';
  lgTerceirosAtrasados = 'TERCEIROS ATRASADOS';

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
    private asoService: AsoService,
    private appMessage: AppMessageService,
    private infoDialogHandler: InfoDialogHandler,
    private dialog: MdDialog
  ) { }

  ngOnInit() {
    this.findValues();
  }

  updateChart(dashboardFilter: DashboardFilter) {
    this.filterRequest = { dashboardFilter: dashboardFilter };

    if (this.first) {
      this.first = false;
    } else {
      this.findValues();
    }
  }

  findValues() {
    this.asoService.getWorkerAsoChart(this.filterRequest).subscribe(items => {
      this.emptyChart = items.length == 0;
      this.buildChart(items);
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico ' + this.chartTitle);
      });
  }

  showInfo() {
    const listDescription = [
      'ASO: mostra o total de Atestados de Saúde Ocupacional por status (atrasado ou realizado) no período e nas obras selecionadas vinculadas aos trabalhadores próprios e terceiros.'
    ];
    this.infoDialogHandler.callListDescription(
      'atenção', listDescription
    );
  }

  getItem(items: WorkerAsoChart[], legend: string): WorkerAsoChart {
    let temp = null;
    items.forEach(item => {
      if (item.legend.trim() == legend.trim()) {
        temp = item;
      }
    });

    return temp;
  }

  buildChart(items: WorkerAsoChart[]) {
    this.listProprioRealizado.splice(0, this.listProprioRealizado.length);
    this.listProprioAtrasado.splice(0, this.listProprioAtrasado.length);
    this.listTerceiroRealizado.splice(0, this.listTerceiroRealizado.length);
    this.listTerceiroAtrasado.splice(0, this.listTerceiroAtrasado.length);

    this.listLegend = this.dashboardService.generateLegends(this.filterRequest.dashboardFilter);
    this.listLegend.forEach(leg => {
      const item = this.getItem(items, leg);
      if (item) {
        this.listProprioRealizado.push(item.proprioRealizado);
        this.listProprioAtrasado.push(item.proprioAtrasado);
        this.listTerceiroRealizado.push(item.terceiroRealizado);
        this.listTerceiroAtrasado.push(item.terceiroAtrasado);

        items = items.filter(temp => item != temp);
      } else {
        this.listProprioRealizado.push(0);
        this.listProprioAtrasado.push(0);
        this.listTerceiroRealizado.push(0);
        this.listTerceiroAtrasado.push(0);
      }
    });

    if (items.length > 0) {
      this.appMessage.showError('Gráfico ' + this.chartTitle + ' com dados incompletos!');
    }

    this.chartOption = {

      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p: any) {
          let tip: String;
          tip = p[0].name + '<br />';
          p.forEach(s => {
            tip += s.marker + s.seriesName + ': ' + s.value.toLocaleString('pt-BR') + '<br />';
          });
          return tip;
        }
      },
      legend: {
        data: [this.lgPropriosRealizados, this.lgPropriosAtrasados, this.lgTerceirosRealizados, this.lgTerceirosAtrasados]
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
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
          axisLabel: {
            formatter: function (value, index) {
              return value.toLocaleString('pt-BR');
            }
          }
        }
      ],
      series: [
        { name: this.lgPropriosRealizados, type: 'bar', color: '#00A77E', stack: 'PROPRIO', data: this.listProprioRealizado },
        { name: this.lgPropriosAtrasados, type: 'bar', color: '#FC5E5E', stack: 'PROPRIO', data: this.listProprioAtrasado },
        { name: this.lgTerceirosRealizados, type: 'bar', color: '#CEFFF3', stack: 'TERCEIROS', data: this.listTerceiroRealizado },
        { name: this.lgTerceirosAtrasados, type: 'bar', color: '#FED1D1', stack: 'TERCEIROS', data: this.listTerceiroAtrasado }
      ]
    };

  }

}
