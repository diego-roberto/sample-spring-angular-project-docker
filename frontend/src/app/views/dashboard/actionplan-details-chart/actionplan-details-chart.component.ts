import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActionPlanChart } from './../../../shared/models/action-plan-chart.model';
import { ActionPlanItemService } from './../../../shared/services/action-plan-item.service';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { ChecklistService } from 'app/shared/services/checklist.service';

import { DashboardFilter } from 'app/shared/models/dashboard-filter';
import { ChecklistChartFilter } from 'app/shared/models/checklist-chart-filter';
import { identifierModuleUrl } from '@angular/compiler';
import { ActionPlanChartFilterModel } from 'app/shared/models/action-plan-chart-filter.model';
import { ActionPlanChartFilter } from 'app/shared/models/action-plan-chart-filter';


@Component({
  selector: 'actionplan-details-chart',
  templateUrl: './actionplan-details-chart.component.html',
  styleUrls: ['./actionplan-details-chart.component.scss']
})
export class ActionPlanDetailsChartComponent implements OnInit {

    private lgAtrasadas = 'ATRASADAS';
    private lgEmProgresso = 'EM PROGRESSO';
    private lgConcluidas = 'CONCLUÍDAS';

    listValuesAtrasadas = [];
    listValuesEmProgresso = [];
    listValuesConcluidas = [];
    listLegend = [];
    chartTitle = '';
    dashboardFilter: DashboardFilter;
    filterRequest;
    chartOption;
    actionPlanChartFilter: Array<ActionPlanChartFilter> = new Array();
    actionPlanChartFilterLimit: Array<ActionPlanChartFilter> = new Array();
    filterIds = '';
    limitItems = 3;
    posiItems = 0;
    _filter: DashboardFilter;


  constructor(
      public dialogRef: MdDialogRef<ActionPlanDetailsChartComponent>,
      private appMessage: AppMessageService,
      private actionplanItemService: ActionPlanItemService,
      ) { }



  first = true;

  ngOnInit() {

    this.loadFilter();    
    this.updateFilterIds();
    this.findValues();

  }


  loadFilter() {    
    this.filterRequest = { dashboardFilter: this.dashboardFilter  };

    this.actionplanItemService.getActionPlanChartFilter(this.filterRequest).subscribe(
        items => {
            items.forEach(item => {
                  const fil = new ActionPlanChartFilter();
                  fil.id = item.id;
                  fil.name = item.name;
                  fil.selected = true;
                  this.actionPlanChartFilter.push(fil);
                  if (this.actionPlanChartFilterLimit.length < this.limitItems){
                      this.actionPlanChartFilterLimit.push(fil);
                  }
            });
            this.updateFilterIds();
            this.findValues();

        },
        error => {
            this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Ações de Melhoria!');
        });
  }


nextItem(){
    this.posiItems++;
    this.showChecklistItems();
}

previousItem(){
    this.posiItems--;
    this.showChecklistItems();
}

showChecklistItems(){
    this.actionPlanChartFilterLimit = new Array();
    for (var index = 0; index < this.limitItems; index++) {
        const item = this.actionPlanChartFilter[index + this.posiItems];
        this.actionPlanChartFilterLimit.push(item);
    }
}

updateFilterIds() {
    this.filterIds = '0';
    this.actionPlanChartFilter.forEach(item => {
        if(item.selected){
            this.filterIds = this.filterIds + ',' + item.id;
        }
    });
}

toggleActiveFilter(item: ActionPlanChartFilter) {
    item.selected = !item.selected;
    this.updateFilterIds();
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
    this.updateFilterIds();
    this.filterRequest = { dashboardFilter: this.dashboardFilter, filterIds: this.filterIds  };
    
    this.actionplanItemService.getActionPlanChartFiltered(this.filterRequest).subscribe(
      items => {
        this.buildChart(items);
      },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Ações de Melhoria!');
      });
  }

  buildChart(items: ActionPlanChart[]) {
        this.clearValues();
        items.forEach(item => {

          this.listValuesAtrasadas.push(item.delayedTotal);
          this.listValuesEmProgresso.push(item.scheduledTotal);
          this.listValuesConcluidas.push(item.completeTotal);

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
              minInterval:1
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



  clearValues(){
    this.listValuesAtrasadas = [];
    this.listValuesEmProgresso = [];
    this.listValuesConcluidas = [];
    this.listLegend = [];
  }


}
