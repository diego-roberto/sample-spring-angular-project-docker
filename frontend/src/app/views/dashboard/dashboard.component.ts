import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UtilValidators } from '../../shared/util/validators.util';
import { DashboardFilter } from '../../shared/models/dashboard-filter';
import { AppMessageService } from '../../shared/util/app-message.service';
import * as Moment from 'moment';
import { PermissionService } from '../../shared/services/permission.service';
import { Construction } from 'app/shared/models/construction.model';
import { ConstructionsService } from '../../shared/services/constructions.service';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboardFilter: DashboardFilter;
  dashboardFilterForm: FormGroup;

  constructionsList: Construction[] = [];
  selectedConstruction: any[] = [];

  constructor(private appMessage: AppMessageService,
    public permissionService: PermissionService,
    private constructionsService: ConstructionsService) { }

  ngOnInit() {
    this.loadConstructionList();
    this.loadFilterOnInput();
    this.applyFilter(true);
  }

  loadFilterOnInput(){
    var filter = JSON.parse(sessionStorage.getItem('dashboard_filter'));
    if(filter==null){
      this.dashboardFilterForm = new FormGroup({
        beginAt: new FormControl(this.initialBeginDate(), [Validators.required, UtilValidators.date, this.validateDates]),
        endAt: new FormControl(this.initialEndDate(), [Validators.required, UtilValidators.date, this.validateDates]),
        constructionIds: new FormControl([]),
      });
    } else {
      this.dashboardFilterForm = new FormGroup({
        beginAt: new FormControl(new Date(filter.beginAt), [Validators.required, UtilValidators.date, this.validateDates]),
        endAt: new FormControl(new Date(filter.endAt), [Validators.required, UtilValidators.date, this.validateDates]),
        constructionIds: new FormControl(filter.constructionIds),
      });
      this.selectedConstruction = filter.constructionIds;
    }
  }

  loadConstructionList() {
    this.constructionsService.getConstructionsEssential().subscribe(response => {
      this.constructionsList = response;
    },
      error => {
        this.appMessage.errorHandle(error, null);
      });
  }

  hasErrorForm(attr: string, type: string): boolean {
    if (this.dashboardFilterForm.controls[attr].touched) {
      return this.dashboardFilterForm.controls[attr].hasError(type);
    } else {
      return false;
    }
  }

  initialBeginDate(): Date {
    return new Date(
        Moment()
        .add(-3, 'months')
        .add(-1, 'days')
        .format('L')
      );
  }

  initialEndDate(): Date {
    return new Date(
        Moment()
        .add(-1, 'days')
        .format('L')
      );
  }

  maxBeginDate(): Date {
    return this.dashboardFilterForm.controls.endAt.value;
  }

  maxEndDate(): Date {
    return new Date(
        Moment()
        .add(-1, 'days')
        .format('L')
      );
  }

  /* validateDates(): boolean {
    if (this.dashboardFilterForm.controls.beginAt == null && this.dashboardFilterForm.controls.endAt == null) {
      return true;
    }

    if (this.dashboardFilterForm.controls.beginAt == null && this.dashboardFilterForm.controls.endAt != null) {
      this.appMessage.showError('Preencha a data início');
      return false;
    }

    if (this.dashboardFilterForm.controls.beginAt != null && this.dashboardFilterForm.controls.endAt == null) {
      this.appMessage.showError('Preencha a data fim');
      return false;
    }

    const dateBegin = Moment(this.dashboardFilterForm.controls.beginAt.value);
    const dateEnd = Moment(this.dashboardFilterForm.controls.endAt.value);

    if (dateEnd.isBefore(dateBegin)) {
      this.appMessage.showError('data início não pode ser superior a data fim');
      return false;
    }

    return this.dashboardFilterForm.valid;
  } */

  validateDates(control: AbstractControl) {
    if ((!control || !control.parent) || (!control.parent.controls['beginAt'] || !control.parent.controls['beginAt'].value)
      || (!control.parent.controls['endAt'] || !control.parent.controls['endAt'].value)) {
      return null;
    }

    const dateBegin = Moment(control.parent.controls['beginAt'].value);
    const dateEnd = Moment(control.parent.controls['endAt'].value);
    const dateChosen = Moment(control.value);
    const dateCurrent = Moment(new Date(Moment().format('L')));

    if (dateChosen.isSameOrAfter(dateCurrent)) {
      return { isTodayOrAfter: true };
    }

    if (dateEnd.isBefore(dateBegin)) {
      return { isEndBeforeBegin: true };
    }

    return null;
  }

  applyFilter(firstTime: boolean=false) {
    this.dashboardFilter = this.dashboardFilterForm.value;
    this.dashboardFilter.intervalType = this.calculeIntervalType();
    this.dashboardFilter = Object.assign({}, this.dashboardFilter);
    if(!firstTime)
      sessionStorage.setItem('dashboard_filter', JSON.stringify(this.dashboardFilter));
  }

  private calculeIntervalType(): string {
    const dateBegin = Moment(this.dashboardFilter.beginAt);
    const dateEnd = Moment(this.dashboardFilter.endAt);
    const intervalMonths = dateEnd.diff(dateBegin, 'months', true);

    let typeInterval: any;
    if (intervalMonths <= 1) {
      typeInterval = 'DAYS';
    } else {
      typeInterval = 'MONTHS';
    }

    return typeInterval;
  }

}
