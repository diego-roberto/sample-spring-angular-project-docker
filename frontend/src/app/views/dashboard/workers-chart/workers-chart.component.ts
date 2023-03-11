import { WorkerService } from './../../../shared/services/worker.service';

import { Component, OnInit, Input } from '@angular/core';
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { InfoDialogHandler } from 'app/shared/util/generic/info-dialog/info-dialog.handler';
import { MdDialog } from '@angular/material';
import { WorkersChart } from 'app/shared/models/workers-chart.model';
import { addDays } from 'app/shared/util/date.util';

@Component({
  selector: 'workers-chart',
  templateUrl: './workers-chart.component.html',
  styleUrls: ['./workers-chart.component.scss']
})
export class WorkersChartComponent implements OnInit {

  chartTitle = 'Trabalhadores';

  private lgProprios = 'PRÓPRIOS';
  private lgTerceiros = 'TERCEIROS';

  listValuesProprios = [];
  listValuesTerceiros = [];
 
  listLegend = [];
  emptyChart = true;


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
    private workerService: WorkerService,
    private appMessage: AppMessageService,
    private infoDialogHandler: InfoDialogHandler,

    ) {

  }

  first = true;

  ngOnInit() {
    this.findValues();
  }

  updateChart(dashboardFilter: DashboardFilter) {
    this.filterRequest = { dashboardFilter: dashboardFilter };
    if (this.first){
      this.first = false;
    } else {
      this.findValues();
    }
  }

  findValues(){
    let newDashboardFilter = {
      dashboardFilter: {...this.filterRequest.dashboardFilter, endAt: addDays(this.filterRequest.dashboardFilter.endAt, 1)}
    }

    this.workerService.getWorkersChart(newDashboardFilter).subscribe(
      items => {
        this.buildChart(items);
      },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Ações de Melhoria!');
      });
  }

  buildChart(items: WorkersChart[]) {
        this.clearValues();
        this.emptyChart = true;

        items.forEach(item => {
          this.listValuesProprios.push(item.ownTotal);
          this.listValuesTerceiros.push(item.thirdpartyTotal);
          if(item.ownTotal > 0 || item.thirdpartyTotal > 0  ){
            this.emptyChart =  false;
          }
          this.listLegend.push(item.legend);
        });


        this.chartOption = {
          color: ['#a1abb0', '#69dca5'],
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
          legend: {
              data: [this.lgProprios, this.lgTerceiros]
          },
          toolbox: {
              show: false,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {

              }
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
                  axisLabel: {
                      formatter: function (value) {
                          return  value.toLocaleString('pt-BR');
                      }
                  }
              }
          ],
          series: [
              { name: this.lgProprios, type: 'bar', barGap: 0, data: this.listValuesProprios },
              { name: this.lgTerceiros, type: 'bar', data:  this.listValuesTerceiros}
          ]
      }




  }

  showInfo(){
    this.infoDialogHandler.call(
      'atenção', 'TRABALHADORES: mostra o total de trabalhadores próprios e terceiros com status ativo por período e por obras vinculadas.'
      );
  }

  clearValues(){
    this.listValuesProprios = [];
    this.listValuesTerceiros = [];
    this.listLegend = [];
  }


}
