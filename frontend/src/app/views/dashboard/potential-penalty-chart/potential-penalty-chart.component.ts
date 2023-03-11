import { Component, OnInit, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { InfoDialogHandler } from "app/shared/util/generic/info-dialog/info-dialog.handler";
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { ChecklistService } from "app/shared/services/checklist.service";
import { AppMessageService } from "app/shared/util/app-message.service";
import { DashboardService } from "app/shared/services/dashboard.service";
import { PotentialPenaltyChart } from "app/shared/models/potential-penalty-chart.model";
import { PotentialPenaltyDetailsChartComponent } from "app/views/dashboard/potential-penalty-details-chart/potential-penalty-details-chart.component";

@Component({
  selector: 'potential-penalty-chart',
  templateUrl: './potential-penalty-chart.component.html',
  styleUrls: ['./potential-penalty-chart.component.scss']
})
export class PotentialPenaltyChartComponent implements OnInit {
  chartTitle = 'Potencial de multa';

  lgPenalty = 'Potencial de multa';

  listValues: Array<any> = [];
  listLegend: Array<any> = [];

  chartOption;
  filterRequest;
  first = true;

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
    private checklistService: ChecklistService,
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
    this.checklistService.getPotentialPenaltyChart(this.filterRequest).subscribe(items => {
      this.emptyChart = items.length == 0;
      this.buildChart(items);
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico ' + this.chartTitle);
      });

  }

  showInfo() {
    const listDescription = [
      'POTENCIAL DE MULTA: Mostra o total do potencial de multa por Período e por Obras em andamento selecionadas para os Checklists aplicados.',
      'Para detalhamento por Checklist. Acesse "Mais Detalhes".'
    ];
    this.infoDialogHandler.callListDescription(
      'atenção', listDescription
    );
  }

  openDetails() {
    if (!this.emptyChart) {
      const dialogRef = this.dialog.open(PotentialPenaltyDetailsChartComponent);

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

  getItem(items: PotentialPenaltyChart[], legend: string): PotentialPenaltyChart {
    let temp = null;
    items.forEach(item => {
      if (item.legend.trim() == legend.trim()) {
        temp = item;
      }
    });

    return temp;
  }

  buildChart(items: PotentialPenaltyChart[]) {
    this.listValues = [];
    this.listLegend = [];

    const legends = this.dashboardService.generateLegends(this.filterRequest.dashboardFilter);
    legends.forEach(leg => {
      this.listLegend.push(leg);

      const item = this.getItem(items, leg);
      if (item) {
        this.listValues.push(item.qtde);
        items = items.filter(temp => item != temp);
      } else {
        this.listValues.push(0);
      }
    });

    if (items.length > 0) {
      this.appMessage.showError('Gráfico ' + this.chartTitle + ' com dados incompletos!');
    }

    this.chartOption = {
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      color: ['#FC5E5E', '#FFBB1A', '#13AFCB', '#3C3C3C'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p: any) {
          let tip: String;
          tip = p[0].name + '<br />';
          p.forEach(s => {
            tip += s.marker + s.seriesName + ': R$ ' + s.value.toLocaleString('pt-BR') + '<br />';
          });
          return tip;
        }
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
        { name: this.lgPenalty, type: 'line', data: this.listValues }
      ]
    };
  }

}
