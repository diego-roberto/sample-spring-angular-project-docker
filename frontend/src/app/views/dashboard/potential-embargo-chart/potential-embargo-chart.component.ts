import { Component, OnInit, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { InfoDialogHandler } from "app/shared/util/generic/info-dialog/info-dialog.handler";
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { AppMessageService } from "app/shared/util/app-message.service";
import { ChecklistService } from "app/shared/services/checklist.service";
import { DashboardService } from "app/shared/services/dashboard.service";
import { PotentialEmbargoChart } from "app/shared/models/potential-embargo-chart.model";
import { PotentialEmbargoDetailsChartComponent } from "app/views/dashboard/potential-embargo-details-chart/potential-embargo-details-chart.component";

@Component({
  selector: 'potential-embargo-chart',
  templateUrl: './potential-embargo-chart.component.html',
  styleUrls: ['./potential-embargo-chart.component.scss']
})
export class PotentialEmbargoChartComponent implements OnInit {
  chartTitle = 'Potencial de criticidade';
  private lgEmbargo = 'EMBARGO';
  private lgMaisFiscalizado = 'MAIS FISCALIZADOS';

  listValuesEmbargo = [];
  listValuesMaisFiscalizado = [];
  listLegend = [];

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
    this.checklistService.getPotentialEmbargoChart(this.filterRequest).subscribe(items => {
      this.emptyChart = items.length == 0;
      this.buildChart(items);
    },
      error => {
        this.appMessage.errorHandle(error, 'Não foi possível gerar o gráfico ' + this.chartTitle);
      });
  }

  showInfo() {
    const listDescription = [
      'POTENCIAL DE CRITICIDADE: Mostra a quantidade de itens classificados como embargo e mais fiscalizados foram respondidos como irregular e ou parcialmente conforme o Período e as Obras em andamento selecionadas para os Checklists aplicados.',
      'Para detalhamento por Checklist. Acesse "Mais Detalhes".'
    ];
    this.infoDialogHandler.callListDescription(
      'atenção', listDescription
    );
  }

  openDetails() {
    if (!this.emptyChart) {
      const dialogRef = this.dialog.open(PotentialEmbargoDetailsChartComponent);

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

    this.listLegend = this.dashboardService.generateLegends(this.filterRequest.dashboardFilter);

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
      this.appMessage.showError('Gráfico ' + this.chartTitle + ' com dados incompletos!');
    }

    this.chartOption = {
      color: ['#FFBB1A', '#13AFCB'],
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
