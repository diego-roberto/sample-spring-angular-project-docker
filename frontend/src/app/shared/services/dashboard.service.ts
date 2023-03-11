import { Injectable } from '@angular/core';
import { DashboardFilter } from '../models/dashboard-filter';
import * as Moment from 'moment';

@Injectable()
export class DashboardService {

  constructor() { }

  generateTimeSeries(dashboardFilter: DashboardFilter): Map<String, any> {
    let mapXYValues: Map<String, any> = new Map();

    let dateBegin = Moment(dashboardFilter.beginAt);
    let dateEnd = Moment(dashboardFilter.endAt);
    let dateFormat: string;
    let dateFormatLabel: string;

    switch (dashboardFilter.intervalType) {
      case 'WEEKS':
        dateBegin =dateBegin.startOf('isoWeek');
        dateEnd =dateEnd.startOf('isoWeek');
        dateFormat = 'YYYY/WW';
        dateFormatLabel = 'MMM-YYYY';
        break;
      case 'DAYS':
        dateFormat = 'DD/MM/YY';
        dateFormatLabel = 'DD/MM/YY';
        break;
      case 'MONTHS':
        dateBegin =dateBegin.startOf('month');
        dateEnd =dateEnd.startOf('month');
        dateFormat = 'MM/YY';
        dateFormatLabel = 'MMM-YYYY';
        break;
    }
    let typeInterval: any = dashboardFilter.intervalType.toLocaleUpperCase();
    let interval = Math.ceil(dateEnd.diff(dateBegin, typeInterval, true));
    let i = 0;

    while (i <= interval) {
      let m = dateBegin.clone().add(i, typeInterval);
      let x = m.format(dateFormat);
      let xLabel: string;
      if (dashboardFilter.intervalType === 'WEEKS') {
        xLabel = ' SMN ' + (i + 1) + ', ' + m.locale('pt-br').format(dateFormatLabel);
      } else {
        xLabel = m.locale('pt-br').format(dateFormatLabel);
      }

      mapXYValues.set(x, { value: 0, label: xLabel.toLocaleUpperCase() });
      i++;
    }

    return mapXYValues;
  }

    generateLegends(dashboardFilter: DashboardFilter): string[]{
        const mapXYValues = this.generateTimeSeries(dashboardFilter);

        let legends: string[] = [];
        
        for(let key of Array.from( mapXYValues.entries()) ) {
            legends.push(key[1].label.trim());
        }
        
        return legends;
    }

}
