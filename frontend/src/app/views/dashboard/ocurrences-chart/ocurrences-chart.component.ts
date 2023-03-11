import { Component, OnInit, Input } from '@angular/core';
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { OccurrenceService } from '../../../shared/services/occurrence.service';
import * as Moment from 'moment';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { InfoDialogHandler } from '../../../shared/util/generic/info-dialog/info-dialog.handler';
import { addDays } from 'app/shared/util/date.util';

@Component({
  selector: 'ocurrences-chart',
  templateUrl: './ocurrences-chart.component.html',
  styleUrls: ['./ocurrences-chart.component.scss']
})
export class OcurrencesChartComponent implements OnInit {

  chartOption: any;
  emptyChart: boolean;
  _filter: DashboardFilter;

  @Input()
  set filter(dashboardFilter: DashboardFilter) {
    this._filter = dashboardFilter;
    this.updateChart(this._filter);
  }

  get filter(): DashboardFilter {
    return this._filter;
  }

  constructor(private occurrenceService: OccurrenceService, private dashboardService: DashboardService, private infoDialogHandler: InfoDialogHandler) { }

  ngOnInit() {
  }

  updateChart(dashboardFilter: DashboardFilter) {
    //update chart from server
    if (dashboardFilter) {
      this.occurrenceService.findAllCountOccurrencesByStatus(dashboardFilter.beginAt, addDays(dashboardFilter.endAt, 1), dashboardFilter.intervalType, dashboardFilter.constructionIds)

        .subscribe(result => {

          let mapSeriesType: Map<String, any> = new Map();
          let seriesType: any = [];
          let xValues: String[] = [];
          result.forEach(item => {
            let serie = mapSeriesType.get(item.occurrenceType);
            if (!serie) {

              serie = {
                name: item.occurrenceType,
                mapXYValues: this.dashboardService.generateTimeSeries(dashboardFilter),
                type: 'bar',
                barGap: 0,
                data: []
              };
              mapSeriesType.set(item.occurrenceType, serie);
              seriesType.push(serie);

            }

            let mapXYValues: Map<String, any> = serie.mapXYValues;
            mapXYValues.get(item.dateFormated).value = item.total;

          })

          if (seriesType.length > 0) {
            let values: any[] = Array.from(seriesType[0].mapXYValues.values());
            values.forEach(element => {
              xValues.push(element.label);
            });
            seriesType.forEach(element => {
              element.data = Array.from(element.mapXYValues.values());
            });

            this.emptyChart = false;
            this.setChartOptions(Array.from(mapSeriesType.keys()), Array.from(xValues.values()), seriesType);
          } else {
            this.emptyChart = true;
          }


        })
    }
  }



  getColor(item: string) {
    switch (item) {
      case 'ACIDENTE':
        return '#fc5e5e';
      case 'BOAS PRÁTICAS':
        return '#13afcb';

      case 'INCIDENTE':
        return '#ffbb1a';

      case 'IRREGULARIDADES':

        return '#3c3c3c';

      default:
        return '#CCC';
    }
  }
  setChartOptions(legends: any[], xValues: any[], series: any) {
    let colors: string[] = [];
    legends.forEach(legend => {
      colors.push(this.getColor(legend));
    });
    this.chartOption = {
      responsive: false,
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: legends
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
          data: xValues
        }
      ],
      yAxis: [
        {
          type: 'value',
          minInterval: 1
        }
      ],
      series: series
    }

  }

  showInfo() {
    this.infoDialogHandler.call(
      'atenção', 'OCORRÊNCIAS: são apresentadas as ocorrências por status no período e nas obras em andamento selecionadas.'
    );
  }

  openDetails() {
    //
  }

}
