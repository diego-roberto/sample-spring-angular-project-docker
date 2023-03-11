import { Component, OnInit, Input } from '@angular/core';
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { ChecklistQuestionAnswerService } from 'app/shared/services/checklist-question-answer.service';
import { DashboardService } from 'app/shared/services/dashboard.service';
import { InfoDialogHandler } from 'app/shared/util/generic/info-dialog/info-dialog.handler';
import { MdDialog } from '@angular/material';
import { ChecklistDetailsChartComponent } from '../checklist-details-chart/checklist-details-chart.component';
import { AppMessageService } from 'app/shared/util/app-message.service';

@Component({
  selector: 'checklist-chart',
  templateUrl: './checklist-chart.component.html',
  styleUrls: ['./checklist-chart.component.scss']
})
export class ChecklistChartComponent implements OnInit {

  chartOption: any;
  emptyChart: boolean;
  _filter: DashboardFilter;

  xValues: String[] = [];

  @Input()
  set filter(dashboardFilter: DashboardFilter) {
    this._filter = dashboardFilter;
    this.updateChart(this._filter);
    this.updateTitle(this._filter);
  }

  get filter(): DashboardFilter {
    return this._filter;
  }

  title = '';

  constructor(private dashboardService: DashboardService,
    private checklistQuestionAnswerService: ChecklistQuestionAnswerService,
    private infoDialogHandler: InfoDialogHandler,
    private dialog: MdDialog,
    private appMessage: AppMessageService) { }

  ngOnInit() { }

  updateChart(dashboardFilter: DashboardFilter) {
    // update chart from server
    if (dashboardFilter) {
      this.checklistQuestionAnswerService.findAppliedChecklistsChartData(dashboardFilter.beginAt, dashboardFilter.endAt, dashboardFilter.intervalType, dashboardFilter.constructionIds)
        .subscribe(result => {
          const mapSeriesType: Map<String, any> = new Map();
          const seriesType: any = [];

          result.forEach(item => {
            let serie = mapSeriesType.get(item.answerType);
            if (!serie) {
              serie = {
                name: item.answerType,
                mapXYValues: this.dashboardService.generateTimeSeries(dashboardFilter),
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

            seriesType.forEach(element => {
              element.data = Array.from(element.mapXYValues.values());
            });

            this.emptyChart = false;
            this.setChartOptions(Array.from(mapSeriesType.keys()), this.xValues, seriesType);
          } else {
            this.emptyChart = true;
          }

        });
    }
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
        data: legends /* ['CONFORME', 'IRREGULARIDADE', 'PARCIALMENTE CONFORME'] */
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
          minInterval: 1,
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

  showInfo() {
    this.infoDialogHandler.call(
      'atenção',
      'CHECKLISTS APLICADOS: mostra o total de respostas por tipo (conforme, irregular e parcialmente conforme) de todos os checklists aplicados no período e nas obras em andamento selecionadas. ' +
      ' Para detalhamento por checklist, acesse "MAIS DETALHES".'
    );
  }

  updateTitle(dashboardFilter: DashboardFilter) {
    this.checklistQuestionAnswerService.countAppliedChecklistsByPeriod(dashboardFilter.beginAt, dashboardFilter.endAt, dashboardFilter.constructionIds)
      .subscribe(result => {
        result.forEach(count => {
          this.title = count;
          this.title = this.title + ' Checklists Aplicados';
        });
      });
  }

  openDetails() {
    const openDialog = !(this.xValues == null || this.xValues.length <= 0);
    if (openDialog) {
      const dialogRef = this.dialog.open(ChecklistDetailsChartComponent);

      dialogRef.componentInstance.chartTitle = this.title;
      dialogRef.componentInstance.dashboardFilter = this._filter;

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Sim') {
        }
      });
    } else {
      this.appMessage.showError('Não há dados a serem exibidos!');
    }
  }

}
