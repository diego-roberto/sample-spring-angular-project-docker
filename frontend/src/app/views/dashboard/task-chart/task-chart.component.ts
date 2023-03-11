import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { ConstructionsService } from '../../../shared/services/constructions.service';
import { TasksService } from '../../../shared/services/task.service';
import { InfoDialogHandler } from "app/shared/util/generic/info-dialog/info-dialog.handler";
import { DashboardService } from "app/shared/services/dashboard.service";
import { TaskChartSerie } from "app/shared/models/task-chart.model";
import { addDays } from 'app/shared/util/date.util';

@Component({
  selector: 'task-chart',
  templateUrl: './task-chart.component.html',
  styleUrls: ['./task-chart.component.scss']
})
export class TaskChartComponent implements OnInit {

  labelArray: any;
  delayedArray: any;
  concludedArray: any;
  chartOption: any;

  listLabels: Array<string> = new Array<string>();
  listSeries: Array<any>;
  listLegends: any;

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
    private taskService: TasksService,
    private infoDialogHandler: InfoDialogHandler
  ) { }

  ngOnInit() {
  }

  updateChart(dashboardFilter: DashboardFilter) {

    let newDashboardFilter = new DashboardFilter();
    newDashboardFilter.beginAt = dashboardFilter.beginAt;
    newDashboardFilter.endAt = addDays(dashboardFilter.endAt, 1);
    newDashboardFilter.intervalType = dashboardFilter.intervalType
    newDashboardFilter.constructionIds = dashboardFilter.constructionIds;

    this.taskService.updateChart(newDashboardFilter).subscribe(
      res => {
        this.emptyChart = res.response.labels.length == 0;
        this.populateLists(dashboardFilter, res.response);
        this.buildChart();
      }
    );

  }

  populateLists(dashboardFilter: DashboardFilter, items: any) {

    this.listSeries = [];
    let listSeriesLegends = ['CONCLUÍDAS', 'ATRASADAS'];
    let seriesId = [];
    let values: Array<number> = [];

    this.labelArray = items.labels;
    this.concludedArray = items.totalConcluded;
    this.delayedArray = items.totalDelayed;

    this.listLegends = this.dashboardService.generateLegends(dashboardFilter);

    let serie1: TaskChartSerie = new TaskChartSerie();
    serie1.name = 'CONCLUÍDAS';
    serie1.type = 'line';
    serie1.labels = [];
    serie1.data = [];

    let serie2: TaskChartSerie = new TaskChartSerie();
    serie2.name = 'ATRASADAS';
    serie2.type = 'line';
    serie2.labels = [];
    serie2.data = [];

    this.listLegends.forEach((legend, idx) => {

      if ( this.labelArray.indexOf(legend) < 0) {
        serie1.labels.push(legend);
        serie2.labels.push(legend);
        serie1.data.push(0);
        serie2.data.push(0);
      } else {
        serie1.labels.push(legend);
        serie2.labels.push(legend);
        serie1.data.push(this.concludedArray[this.labelArray.indexOf(legend)]);
        serie2.data.push(this.delayedArray[this.labelArray.indexOf(legend)]);
      }

    });

    this.listSeries.push(serie1);
    this.listSeries.push(serie2);

  }

  buildChart() {

    this.chartOption = {
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      color: ['#00A77E', '#FC5E5E'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
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
        data: ['CONCLUÍDAS', 'ATRASADAS']
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
          data: this.listLegends, //['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN']
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitNumber: 5,
          minInterval: 1
        }
      ],
      series: this.listSeries
      // [{
      //     name: 'ATRASADAS',
      //     type: 'line',
      //     data: this.delayedArray //[120, 132, 101, 134, 90, 230, 210]
      //   },
      //   {
      //     name: 'CONCLUÍDAS',
      //     type: 'line',
      //     data: this.concludedArray //[220, 182, 191, 234, 290, 330, 310]
      //   }]
    };

  }

  showInfo() {
    this.infoDialogHandler.call(
      'atenção', 'TAREFAS: são apresentadas as tarefas por status no período e nas obras em andamento selecionadas.'
    );
  }

}
