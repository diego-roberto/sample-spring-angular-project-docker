import { Component, OnInit } from '@angular/core';
import { DashboardFilter } from 'app/shared/models/dashboard-filter';
import { ChecklistChartFilter } from 'app/shared/models/checklist-chart-filter';
import { MdDialogRef } from '@angular/material';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { ChecklistService } from 'app/shared/services/checklist.service';
import { ChecklistQuestionAnswerService } from 'app/shared/services/checklist-question-answer.service';
import { DashboardService } from 'app/shared/services/dashboard.service';

@Component({
  selector: 'checklist-details-chart',
  templateUrl: './checklist-details-chart.component.html',
  styleUrls: ['./checklist-details-chart.component.scss']
})
export class ChecklistDetailsChartComponent implements OnInit {

  chartOption;
  chartTitle = '';
  dashboardFilter: DashboardFilter;

  listChecklistChartFilter: Array<ChecklistChartFilter> = new Array();
  listChecklistChartShow: Array<ChecklistChartFilter> = new Array();

  limitItems = 3;
  posiItems = 0;
  filterIds: number[] = [];
  first = true;
  xValues: String[] = [];

  constructor(
    public dialogRef: MdDialogRef<ChecklistDetailsChartComponent>,
    private appMessage: AppMessageService,
    private checklistService: ChecklistService,
    private checklistQuestionAnswerService: ChecklistQuestionAnswerService,
    private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadFilter();
  }

  loadFilter() {
    this.checklistQuestionAnswerService.findAppliedChecklistsDetailsFilters(this.dashboardFilter.beginAt, this.dashboardFilter.endAt, this.dashboardFilter.constructionIds).subscribe(listChecklist => {
      listChecklist = listChecklist.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

      listChecklist.forEach(item => {
        const fil = new ChecklistChartFilter();
        fil.checklistFatherId = item.fatherId;
        fil.description = item.name;
        fil.selected = true;

        this.listChecklistChartFilter.push(fil);
      });

      this.updateFilterIds();
      this.findValues();
      this.showChecklistItems();
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Checklists Aplicados!');
      });
  }

  nextItem() {
    this.posiItems++;
    this.showChecklistItems();
  }

  previousItem() {
    this.posiItems--;
    this.showChecklistItems();
  }

  showChecklistItems() {
    this.listChecklistChartShow = new Array();
    for (let index = 0; index < this.limitItems; index++) {
      const item = this.listChecklistChartFilter[index + this.posiItems];
      this.listChecklistChartShow.push(item);
    }
  }

  updateFilterIds() {
    this.filterIds = [0];
    this.listChecklistChartFilter.forEach(item => {
      if (item.selected) {
        this.filterIds.push(item.checklistFatherId);
      }
    });
  }

  toggleActiveFilter(item: ChecklistChartFilter) {
    item.selected = !item.selected;
    this.updateFilterIds();
    this.findValues();
  }

  findValues() {
    this.updateFilterIds();

    this.checklistQuestionAnswerService.findAppliedChecklistsDetailsChartData(this.dashboardFilter.beginAt, this.dashboardFilter.endAt, this.dashboardFilter.intervalType, this.dashboardFilter.constructionIds, this.filterIds)
      .subscribe(items => {
        this.buildChart(items);
      },
        error => {
          this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Checklists Aplicados!');
        });
  }

  buildChart(items: any[]) {
    const mapSeriesType: Map<String, any> = new Map();
    const seriesType: any = [];

    items.forEach(item => {
      let serie = mapSeriesType.get(item.answerType);
      if (!serie) {
        serie = {
          name: item.answerType,
          mapXYValues: this.dashboardService.generateTimeSeries(this.dashboardFilter),
          type: 'bar',
          stack: 'ad',
          data: []
        };
        mapSeriesType.set(item.answerType, serie);
        seriesType.push(serie);
      }

      const mapXYValues: Map<String, any> = serie.mapXYValues;
      mapXYValues.get(item.formattedDate).value = item.quantity;
    });

    this.xValues = [];
    if (seriesType.length > 0) {
      const values: any[] = Array.from(seriesType[0].mapXYValues.values());
      values.forEach(element => {
        this.xValues.push(element.label);
      });
    }

    seriesType.forEach(element => {
      element.data = Array.from(element.mapXYValues.values());
    });

    this.setChartOptions(Array.from(mapSeriesType.keys()), this.xValues, seriesType);
  }

  setChartOptions(legends: any[], xValues: any[], series: any) {
    this.chartOption = {
      color: ['#00a77e', '#fc5e5e', '#ffbb1a'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: legends /* ['CONFORME', 'IRREGULAR', 'PARCIALMENTE CONFORME'] */
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {}
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: xValues /* ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL'] */
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: function (value, index) {
              return value.toLocaleString('pt-BR');
            }
          }
        }
      ],
      series: series /* [
        { name: 'CONFORME', type: 'bar', stack: 'ad', data: [120, 132, 101, 134, 90, 230, 210] }
        ,
        { name: 'IRREGULAR', type: 'bar', stack: 'ad', data: [220, 182, 191, 234, 290, 330, 310] }
        ,
        { name: 'PARCIALMENTE CONFORME', type: 'bar', stack: 'ad', data: [150, 232, 201, 154, 190, 330, 410] }
      ] */
    };
  }

}
