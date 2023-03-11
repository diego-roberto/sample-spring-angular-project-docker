import { ActionPlanChart } from './../../../shared/models/action-plan-chart.model';
import { ActionPlanItemService } from './../../../shared/services/action-plan-item.service';

import { Component, OnInit, Input } from '@angular/core';
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { InfoDialogHandler } from 'app/shared/util/generic/info-dialog/info-dialog.handler';
import { ActionPlanDetailsChartComponent } from '../actionplan-details-chart/actionplan-details-chart.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'actionplan-chart',
  templateUrl: './actionplan-chart.component.html',
  styleUrls: ['./actionplan-chart.component.scss']
})
export class ActionPlanChartComponent implements OnInit {

  chartTitle = 'Ações de Melhoria';

  private lgAtrasadas = 'ATRASADAS';
  private lgEmProgresso = 'EM PROGRESSO';
  private lgConcluidas = 'CONCLUÍDAS';

  listValuesAtrasadas = [];
  listValuesEmProgresso = [];
  listValuesConcluidas = [];
  listLegend = [];
  emptyChart = true;
  first = true;

  filterRequest;
  chartOption;

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
    private actionplanItemService: ActionPlanItemService,
    private appMessage: AppMessageService,
    private infoDialogHandler: InfoDialogHandler,
    private dialog: MdDialog,

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
    this.actionplanItemService.getActionPlanChart(this.filterRequest).subscribe(
      items => {

        this.buildChart(items);
      },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Ações de Melhoria!');
      });
  }

  buildChart(items: ActionPlanChart[]) {
    this.clearValues();
    this.emptyChart = true;
    items.forEach(item => {

      this.listValuesAtrasadas.push(item.delayedTotal);
      this.listValuesEmProgresso.push(item.scheduledTotal);
      this.listValuesConcluidas.push(item.completeTotal);
      if (item.delayedTotal > 0 || item.scheduledTotal > 0 || item.completeTotal > 0) {
        this.emptyChart = false;
      }
      this.listLegend.push(item.legend);
    });

    this.chartOption = {
      color: ['#fc5e5e', '#ffbb1a', '#00a77e'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: [this.lgAtrasadas, this.lgEmProgresso, this.lgConcluidas]
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          //  mark: {show: true},
          // dataView: {show: true, readOnly: false},
          //  magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          // restore: {show: true},
          // saveAsImage: {show: true}
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: this.listLegend,
        }
      ],
      yAxis: [
        {
          type: 'value',
          minInterval: 1

        }
      ],
      series: [
        { name: this.lgAtrasadas, type: 'bar', stack: 'ad', data: this.listValuesAtrasadas }
        ,
        { name: this.lgEmProgresso, type: 'bar', stack: 'ad', data: this.listValuesEmProgresso }
        ,
        { name: this.lgConcluidas, type: 'bar', stack: 'ad', data: this.listValuesConcluidas }
      ]
    };

  }

  showInfo() {
    this.infoDialogHandler.call(
      'atenção', 'AÇÕES DE MELHORIA: mostra o total de ações dos planos de ação por status (atrasada, em progresso e concluída) dentro do período e das obras em andamento selecionadas. Para detalhamento por plano de ação, acesse "MAIS DETALHES".'
    );
  }

  clearValues() {
    this.listValuesAtrasadas = [];
    this.listValuesEmProgresso = [];
    this.listValuesConcluidas = [];
    this.listLegend = [];
  }

  openDetails() {

    const openDialog = !this.emptyChart;
    if (openDialog) {
      const dialogRef = this.dialog.open(ActionPlanDetailsChartComponent);
      dialogRef.componentInstance.chartTitle = this.chartTitle;
      dialogRef.componentInstance.dashboardFilter = this.filterRequest.dashboardFilter;

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Sim') {
        }
      });
    } else {
      this.appMessage.showError('Não há dados a serem exibidos!');
    }

  }
}
