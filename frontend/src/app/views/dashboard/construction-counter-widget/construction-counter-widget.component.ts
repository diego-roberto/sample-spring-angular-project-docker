import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { DashboardFilter } from '../../../shared/models/dashboard-filter';
import { ConstructionsService } from '../../../shared/services/constructions.service';
import { InfoDialogHandler } from 'app/shared/util/generic/info-dialog/info-dialog.handler';
import { TasksService } from 'app/shared/services/task.service';
import { addDays } from 'app/shared/util/date.util';

@Component({
  selector: 'construction-counter-widget',
  templateUrl: './construction-counter-widget.component.html',
  styleUrls: ['./construction-counter-widget.component.scss']
})
export class ConstructionCounterWidgetComponent implements OnInit {

  chartOption: any;
  _filter: DashboardFilter;
  labelArray = [];
  concludedArray = [];
  delayedArray = [];

  granTotal: number = 0;
  totalRunning: number = 0;
  totalStopped: number = 0;
  totalFinished: number = 0;

  @Input()
  set filter(dashboardFilter: DashboardFilter) {
    this._filter = dashboardFilter;
    this.updateChart(this._filter);
  }

  get filter(): DashboardFilter {
    return this._filter;
  }

  constructor(
    private constructionService: ConstructionsService,
    private infoDialogHandler: InfoDialogHandler
  ) { }

  ngOnInit() {
    this.updateChart(this._filter);
  }

  ngAfterContentInit() {
    this.updateChart(this._filter);
  }

  updateChart(dashboardFilter: DashboardFilter) {
    let newDashboardFilter = new DashboardFilter();

    if (dashboardFilter === undefined) {

      let today = new Date();
      let oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 3);

      newDashboardFilter.beginAt = oneMonthAgo;
      newDashboardFilter.endAt = addDays(today, 1);

    } else {
      newDashboardFilter.beginAt = dashboardFilter.beginAt;
      newDashboardFilter.endAt = addDays(dashboardFilter.endAt, 1);
    }


    this.constructionService.updateCounterWidget(newDashboardFilter).subscribe(
      res => {
        this.totalRunning = res.response.totalRunning;
        this.totalStopped = res.response.totalStopped;
        this.totalFinished = res.response.totalFinished;
        this.granTotal = this.totalRunning + this.totalStopped + this.totalFinished;
      }
    );

  }

}
