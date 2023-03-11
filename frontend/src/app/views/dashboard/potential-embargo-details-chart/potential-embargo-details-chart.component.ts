import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { AppMessageService } from "app/shared/util/app-message.service";
import { ChecklistService } from "app/shared/services/checklist.service";

import { DashboardFilter } from "app/shared/models/dashboard-filter";
import { ChecklistChartFilter } from "app/shared/models/checklist-chart-filter";

import { PotentialEmbargoChart } from "app/shared/models/potential-embargo-chart.model";
import { Checklist } from "app/shared/models/checklist.model";
import { DashboardService } from "app/shared/services/dashboard.service";

@Component({
  selector: 'potential-embargo-details-chart',
  templateUrl: './potential-embargo-details-chart.component.html',
  styleUrls: ['./potential-embargo-details-chart.component.scss']
})
export class PotentialEmbargoDetailsChartComponent implements OnInit {
  chartTitle = '';
  limitItems = 3;
  posiItems = 0;

  lgEmbargo = 'EMBARGO';
  lgMaisFiscalizado = 'MAIS FISCALIZADOS';

  listValuesEmbargo = [];
  listValuesMaisFiscalizado = [];
  listLegend = [];
  chartOption;
  dashboardFilter: DashboardFilter;
  listChecklistChartFilter: Array<ChecklistChartFilter> = new Array();
  listChecklistChartFilterLimit: Array<ChecklistChartFilter> = new Array();

  constructor(
    private dashboardService: DashboardService,
    public dialogRef: MdDialogRef<PotentialEmbargoDetailsChartComponent>,
    private appMessage: AppMessageService,
    private checklistService: ChecklistService
  ) { }

  ngOnInit() {
    this.checklistService.getChecklistChart().subscribe(items => {
      items = items.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

      items.forEach(item => {
        if (item.sesiBelongs) {
          let fil = new ChecklistChartFilter();
          fil.checklistFatherId = item.fatherId;
          fil.description = item.name;
          fil.selected = true;

          this.listChecklistChartFilter.push(fil);
          if (this.listChecklistChartFilterLimit.length < this.limitItems) {
            this.listChecklistChartFilterLimit.push(fil);
          }
        }
      })

      this.findValues();
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Potencial de embargo!');
      });
  }

  findValues() {
    let listChecklistFatherIdSelected = this.prepareListChecklistFatherIdSelected();
    if (listChecklistFatherIdSelected.length <= 0) {
      this.appMessage.showError('Selecione ao menos um checklist para consultar!');
      return;
    }

    let filterRequest = {
      dashboardFilter: this.dashboardFilter,
      listChecklistFatherId: listChecklistFatherIdSelected
    }

    this.checklistService.getPotentialEmbargoChart(filterRequest).subscribe(items => {
      this.buildChart(items);
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico Potencial de embargo!');
      });
  }

  prepareListChecklistFatherIdSelected() {
    let ids = [];
    this.listChecklistChartFilter.forEach(item => {
      if (item.selected) {
        ids.push(item.checklistFatherId);
      }
    })
    return ids;
  }

  toggleActiveFilter(item: ChecklistChartFilter) {
    item.selected = !item.selected;
    this.findValues();
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
    this.listChecklistChartFilterLimit = new Array();

    for (var index = 0; index < this.limitItems; index++) {
      const item = this.listChecklistChartFilter[index + this.posiItems];
      this.listChecklistChartFilterLimit.push(item);
    }

  }

  getItem(items: PotentialEmbargoChart[], legend: string): PotentialEmbargoChart {
    let temp = null;
    items.forEach(item => {
      if (item.legend.trim() == legend.trim()) {
        temp = item;
      }
    });

    return temp;
  }

  buildChart(items: PotentialEmbargoChart[]) {
    this.listValuesEmbargo.splice(0, this.listValuesEmbargo.length);
    this.listValuesMaisFiscalizado.splice(0, this.listValuesMaisFiscalizado.length);

    this.listLegend = this.dashboardService.generateLegends(this.dashboardFilter);

    this.listLegend.forEach(leg => {
      const item = this.getItem(items, leg);
      if (item) {
        this.listValuesEmbargo.push(item.embargoQtde);
        this.listValuesMaisFiscalizado.push(item.maisFiscalizadoQtde);

        items = items.filter(temp => item != temp);
      } else {
        this.listValuesEmbargo.push(0);
        this.listValuesMaisFiscalizado.push(0);
      }
    });

    if (items.length > 0) {
      this.appMessage.showError('Gráfico detalhado potencial embargo com dados incompletos!');
    }

    this.chartOption = {
      color: ['#ffbb1a', '#13afcb'],
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
        data: [this.lgEmbargo, this.lgMaisFiscalizado]
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
            formatter: function (value, index) {
              return value.toLocaleString('pt-BR');
            }
          }
        }
      ],
      series: [
        { name: this.lgEmbargo, type: 'bar', barGap: 0, data: this.listValuesEmbargo },
        { name: this.lgMaisFiscalizado, type: 'bar', data: this.listValuesMaisFiscalizado }
      ]
    }
  }
}
