import { Component, OnInit, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { InfoDialogHandler } from "app/shared/util/generic/info-dialog/info-dialog.handler";
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { AppMessageService } from "app/shared/util/app-message.service";
import { DashboardService } from "app/shared/services/dashboard.service";
import { TrainingScheduleService } from "app/shared/services/training-schedule.service";
import { TrainingScheduleChart } from "app/shared/models/training-schedule-chart.model";

@Component({
  selector: 'training-schedule-chart',
  templateUrl: './training-schedule-chart.component.html',
  styleUrls: ['./training-schedule-chart.component.scss']
})
export class TrainingScheduleChartComponent implements OnInit {

  emptyChart = true;
  chartTitle = 'Capacitações';
  chartOption;
  filterRequest;
  first = true;

  listLegend = [];
  listTrabalhadorCapacitado = [];
  listTrabalhadorNaoCapacitado = [];
  listCapacitacaoRealizada = [];
  listCapacitacaoAgendada = [];

  lgTrabalhadoresCapacitados = 'TRABALHADORES CAPACITADOS';
  lgTrabalhadoresNaoCapacitados = 'TRABALHADORES NÃO CAPACITADOS';
  lgCapacitacaoRealizada = 'CAPACITAÇÕES REALIZADAS';
  lgCapacitacaoAgendada = 'CAPACITAÇÕES AGENDADAS';

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
    private trainingScheduleService: TrainingScheduleService,
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
    this.trainingScheduleService.getTrainingScheduleChartChart(this.filterRequest).subscribe(items => {
      this.emptyChart = items.length == 0;
      this.buildChart(items);
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico ' + this.chartTitle);
      });
  }

  showInfo() {
    const descriptionInnerHtml = 'CAPACITAÇÕES: mostra o panorama de capacitações por período e por obras vinculadas: <BR />'
      + '<ul>'
      + '<li>trabalhadores capacitados, sendo estes aqueles que assistiram as capacitações agendadas no sistema;</li>'
      + '<li>trabalhadores não capacitados, sendo aqueles que, apesar do agendamento, não assistiram as capacitações;</li>'
      + '<li>capacitações agendadas: são todas as capacitações agendadas na empresa no período;</li>'
      + '<li>capacitações realizadas: são as capacitações que foram agendadas e realizadas.</li>'
      + '</ul>';

    this.infoDialogHandler.callInnerHtml(
      'atenção', descriptionInnerHtml
    );
  }

  getItem(items: TrainingScheduleChart[], legend: string): TrainingScheduleChart {
    let temp = null;
    items.forEach(item => {
      if (item.legend.trim() == legend.trim()) {
        temp = item;
      }
    });

    return temp;
  }

  buildChart(items: TrainingScheduleChart[]) {
    this.listTrabalhadorCapacitado.splice(0, this.listTrabalhadorCapacitado.length);
    this.listTrabalhadorNaoCapacitado.splice(0, this.listTrabalhadorNaoCapacitado.length);
    this.listCapacitacaoRealizada.splice(0, this.listCapacitacaoRealizada.length);
    this.listCapacitacaoAgendada.splice(0, this.listCapacitacaoAgendada.length);

    this.listLegend = this.dashboardService.generateLegends(this.filterRequest.dashboardFilter);
    this.listLegend.forEach(leg => {
      const item = this.getItem(items, leg);
      if (item) {
        this.listTrabalhadorCapacitado.push(item.trabalhadorCapacitado);
        this.listTrabalhadorNaoCapacitado.push(item.trabalhadorNaoCapacitado);
        this.listCapacitacaoRealizada.push(item.capacitacaoRealizada);
        this.listCapacitacaoAgendada.push(item.capacitacaoAgendada);

        items = items.filter(temp => item != temp);
      } else {
        this.listTrabalhadorCapacitado.push(0);
        this.listTrabalhadorNaoCapacitado.push(0);
        this.listCapacitacaoRealizada.push(0);
        this.listCapacitacaoAgendada.push(0);
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
        data: [this.lgTrabalhadoresCapacitados, this.lgCapacitacaoRealizada, this.lgTrabalhadoresNaoCapacitados, this.lgCapacitacaoAgendada]
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
        { name: this.lgTrabalhadoresCapacitados, type: 'bar', color: '#00A77E', data: this.listTrabalhadorCapacitado },
        { name: this.lgTrabalhadoresNaoCapacitados, type: 'bar', color: '#FC5E5E', data: this.listTrabalhadorNaoCapacitado },
        { name: this.lgCapacitacaoRealizada, type: 'line', color: '#13AFCB', data: this.listCapacitacaoRealizada },
        { name: this.lgCapacitacaoAgendada, type: 'line', color: '#1253CB', data: this.listCapacitacaoAgendada }
      ]
    };
  }
}
