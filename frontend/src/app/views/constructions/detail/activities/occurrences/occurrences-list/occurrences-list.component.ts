import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { SessionsService } from '../../../../../../shared/services/sessions.service';
import { ConstructionsService } from '../../../../../../shared/services/constructions.service';
import { OccurrenceService } from '../../../../../../shared/services/occurrence.service';
import { TaskCreatorService } from '../../../_common/task-creator.service';
import { OccurrenceCreatorService } from '../../../_common/occurrence-creator.service';
import { TasksService } from '../../../../../../shared/services/task.service';
import { AppMessageService } from '../../../../../../shared/util/app-message.service';

import { Occurrence } from '../../../../../../shared/models/occurrence.model';
import { OccurrencesFilter } from '../../../../../../shared/models/occurrences-filter.model';
import { Task } from '../../../../../../shared/models/task.model';

import { FormGroup, FormControl } from '@angular/forms';

import { ConfirmDialogHandler } from '../../../../../../shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { PermissionService } from '../../../../../../shared/services/permission.service';

import { UtilValidators } from 'app/shared/util/validators.util';

import * as Moment from 'moment';

@Component({
  selector: 'occurrences-list',
  templateUrl: 'occurrences-list.component.html',
  styleUrls: ['./occurrences-list.component.scss']
})
export class OccurrencesListComponent implements OnInit, OnDestroy {

  @Input() addOccurrence: Observable<Occurrence>;

  loadingActive = false;
  occurrenceLists: Array<any> = [];
  allOccurrences: Array<any> = [];

  qtdeAccident: 0;
  qtdeIncident: 0;
  qtdeGoodHabits: 0;
  qtdeNonCompliance: 0;

  showNewOccurrence = false;
  showSearch = true;

  spin = true;
  direction = 'up';
  animationMode = 'fling';
  fixed = false;

  requestFilter: OccurrencesFilter;
  filterTemp: OccurrencesFilter;

  byFilter = false;
  searchValue: string;
  occurrencesDateFilterForm: FormGroup;

  @Input() opennedByLink = { urlOppened: null };

  selectedFilters = {
    text: '',
    accident: true,
    incident: true,
    goodHabits: true,
    nonCompliance: true
  };

  private addOccurrenceSubscription: Subscription;
  private changeConstructionSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private constructionsService: ConstructionsService,
    public occurrenceService: OccurrenceService,
    public occurrenceCreatorService: OccurrenceCreatorService,
    private sessionsService: SessionsService,
    public dialog: MdDialog,
    private confirmDialogHandler: ConfirmDialogHandler,
    private appMessage: AppMessageService,
    public permissionService: PermissionService
  ) {
    this.occurrencesDateFilterForm = new FormGroup({
      action: new FormControl(''),
      beginAt: new FormControl('', [UtilValidators.date]),
      endAt: new FormControl('', [UtilValidators.date]),
      newObservation: new FormControl('')
    });
  }

  ngOnInit() {
    this.getOccurrenceLists();
    this.resetFields();

    // Toda a vez que uma construção for selecionada esse método será executado.
    this.changeConstructionSubscription = this.constructionsService.changeConstructionObservable.subscribe(construction => {
      this.getOccurrenceLists();
      this.filterOccurrences();
    });
    this.initListenerQueryParams();
  }

  resetFields() {
    this.filterTemp = new OccurrencesFilter();
    this.requestFilter = new OccurrencesFilter();
    this.requestFilter.constructionId = this.getConstructionId();
  }

  initListenerQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params['add'] === 'true') {
        this.openDialog();
      } else if (params['edit']) {
        const occurrenceId = parseInt(params['edit'], 10);
        this.editOccurrence(occurrenceId);
      } else if (params['view']) {
        const occurrenceId = parseInt(params['view'], 10);
        const companyId = parseInt(params['companyId'], 10);
        const isNotification = (params['notification'] === 'true');

        if (isNotification) {
          this.openDialogByNotification(companyId, occurrenceId);
        } else {
          this.openDialogById(occurrenceId);
        }
      }
    });
  }

  navigateToModal(queryParams: any) {
    // changes the route without moving from the current view or
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      skipLocationChange: false,
    });
  }


  ngOnDestroy() {
    this.changeConstructionSubscription.unsubscribe();
  }

  openOccurrenceDetailDialog(occurrence: any) {
    occurrence.occClass = this.getClassOccurrence(occurrence.type);

    this.occurrenceService.getOccurrenceDetail(occurrence.id).subscribe((occurrenceDetail) => {

      const dialogRef = this.dialog.open(OccurrenceDetailDialogOverviewComponent);

      dialogRef.componentInstance.detailOccurrence = occurrence;
      dialogRef.componentInstance.detailOccurrenceDetail = occurrenceDetail;
      dialogRef.componentInstance.constructionId = this.getConstructionId();

      dialogRef.afterClosed().subscribe(result => {
        this.navigateToModal({});
      });
    });
  }

  getConstructionId(): number {
    const construction = this.constructionsService.construction;
    if (construction && construction != null && construction.id && construction.id != null) {
      return construction.id;
    }

    const paramId = this.route.snapshot.parent.params['id'];
    if (paramId && paramId != 'undefined') {
      return paramId;
    }

    return null;
  }

  getOccurrenceLists() {
    const constructionId = this.getConstructionId();
    if (constructionId && constructionId != null) {
      this.loadingActive = true;
      this.occurrenceService.getOccurrenceList(constructionId).subscribe((occurrences) => {
        this.loadingActive = false;
        this.showNewOccurrence = true;
        this.allOccurrences = occurrences;
        this.occurrenceLists = this.mapOccurrences(occurrences);
        this.adjustQtdes();
      }, error => {
        this.loadingActive = false;
        this.showNewOccurrence = false;
        this.appMessage.errorHandle(error, null);
      });
    } else {
      this.router.navigate(['/constructions']);
    }
  }

  openDialogById(occurrenceId: number) {
    if (!isNaN(occurrenceId)) {
      // Verifica na lista a existencia da ocorrencia
      const occurrencesFilter = this.allOccurrences.filter(occurrence => {
        return (
          occurrence.id === occurrenceId
        );
      });

      if (occurrencesFilter && occurrencesFilter.length > 0) {
        this.openOccurrenceDetailDialog(occurrencesFilter[0]);
      } else {
        // Verifica na base a existencia da ocorrencia e exibe mensagens de validação
        this.loadingActive = true;
        this.occurrenceService.verifyOccurrenceDetail(occurrenceId).subscribe((occurrence) => {
          this.loadingActive = false;
          this.openOccurrenceDetailDialog(occurrence);
        }, error => {
          this.loadingActive = false;
          this.appMessage.errorHandle(error, 'Ocorrência não encontrada!');
        });
      }
    }
  }

  openDialogByNotification(companyId: number, occurrenceId: number) {
    const msgCompany = 'A ocorrência em questão não pertence a esta empresa.';
    const currentCompany = this.sessionsService.getCurrentCompany();
    if (!companyId || isNaN(occurrenceId) || companyId !== currentCompany.companyId) {
      this.appMessage.showError(msgCompany);
      return;
    } else {
      this.openDialogById(occurrenceId);
    }
  }

  adjustQtdes() {
    this.qtdeAccident = 0;
    this.qtdeIncident = 0;
    this.qtdeGoodHabits = 0;
    this.qtdeNonCompliance = 0;

    this.allOccurrences.forEach(element => {
      switch (element.type) {
        case 'accident': this.qtdeAccident++; break;
        case 'incident': this.qtdeIncident++; break;
        case 'goodHabits': this.qtdeGoodHabits++; break;
        case 'nonCompliance': this.qtdeNonCompliance++; break;
      }
    });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  toggleActiveFilter(_filter: string) {
    this.selectedFilters = {
      ...this.selectedFilters,
      [_filter]: !this.selectedFilters[_filter]
    };
    this.filterOccurrences();
  }

  private mapOccurrences(occcurrences: Array<any>): Array<any> {
    const list = [];

    const today = occcurrences.filter(occurrence => occurrence.isToday() === true);
    if (today.length > 0) { list.push({ group: 'Hoje', occurrences: today }); }

    const others = occcurrences.filter(occurrence => occurrence.isToday() === false);
    if (others.length > 0) { list.push({ group: 'Dias Anteriores', occurrences: others }); }

    return list;
  }

  getClassOccurrence(type: string): string {
    let cls = '';
    switch (type) {
      case 'accident': cls = 'accident'; break;
      case 'incident': cls = 'incident-img'; break;
      case 'goodHabits': cls = 'good-habits-img'; break;
      case 'nonCompliance': cls = 'non-compliance-img'; break;
    }

    return cls;
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText() {
    this.selectedFilters.text = this.searchValue.trim();
    this.filterOccurrences();
  }

  filterOccurrences() {
    const occurrencesFilter = this.allOccurrences.filter(occurrence => {
      return (
        this.verifyFilter(occurrence)
      );
    });

    this.occurrenceLists = this.mapOccurrences(occurrencesFilter);
  }

  verifyFilter(occurrence): boolean {
    const textFilter = this.selectedFilters.text.toLowerCase();

    if (textFilter !== '') {
      const occurrenceText: string = occurrence.title.trim().toLowerCase() + occurrence.relatedBy.trim().toLowerCase();

      if (occurrenceText.indexOf(textFilter) < 0) {
        return false;
      }
    }

    const types = this.getValidTypes();

    if (types.indexOf(occurrence.type) < 0) {
      return false;
    }

    return true;
  }

  getValidTypes(): Array<any> {
    let types = [];

    if (this.selectedFilters.accident) {
      types.push('accident');
    }

    if (this.selectedFilters.incident) {
      types.push('incident');
    }

    if (this.selectedFilters.goodHabits) {
      types.push('goodHabits');
    }

    if (this.selectedFilters.nonCompliance) {
      types.push('nonCompliance');
    }

    return types;
  }

  inativateOccurrence(occurrenceId) {
    this.confirmDialogHandler.call('Excluir', 'Deseja realmente excluir esta ocorrência ?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.occurrenceService.deleteOccurrence(occurrenceId).subscribe(
          success => {
            if (this.allOccurrences.findIndex(a => a.id === occurrenceId) > -1) {
              this.allOccurrences.splice(this.allOccurrences.findIndex(a => a.id === occurrenceId), 1);
              this.filterOccurrences();
              this.adjustQtdes();
            }
            this.appMessage.showSuccess(null);
          },
          error => {
            this.appMessage.errorHandle(error, 'Não foi possível excluir a ocorrência! ');
          }
        );
      }
    });
  }

  editOccurrence(occurrenceId) {
    this.occurrenceCreatorService.requestDialog(occurrenceId).subscribe(occurrence => {
      this.findOccurrencesByFilter(this.requestFilter);
      this.filterOccurrences();
      this.navigateToModal({});
    });
  }

  openDialog() {
    this.occurrenceCreatorService.requestDialog().subscribe(occurrence => {
      this.findOccurrencesByFilter(this.requestFilter);
      this.filterOccurrences();
      this.navigateToModal({});
    });
  }

  findOccurrencesByFilter(requestFilter: OccurrencesFilter) {
    const constructionId = this.getConstructionId();
    if (constructionId && constructionId != null) {
      this.loadingActive = true;
      requestFilter.constructionId = constructionId;
      this.occurrenceService.findOcurrencesByFilter(requestFilter).subscribe((occurrences) => {
        this.loadingActive = false;
        this.showNewOccurrence = true;
        this.allOccurrences = occurrences;
        this.occurrenceLists = this.mapOccurrences(occurrences);

        this.adjustQtdes();
        this.filterByText();
      }, error => {
        this.loadingActive = false;
        this.showNewOccurrence = false;
        this.appMessage.errorHandle(error, null);
      });
    } else {
      this.router.navigate(['/constructions']);
    }

  }

  get form() {
    return this.occurrencesDateFilterForm;
  }

  hasErrorForm(attr: string, type: string): boolean {
    if (this.occurrencesDateFilterForm.controls[attr].touched) {
      return this.occurrencesDateFilterForm.controls[attr].hasError(type);
    } else {
      return false;
    }
  }

  applyFilter() {
    if (!this.validateFilter()) {
      return;
    }

    this.byFilter = true;
    this.prepareRequest();

    this.findOccurrencesByFilter(this.requestFilter);
  }

  validateFilter(): boolean {

    if (this.requestFilter.constructionId == null) {
      this.appMessage.showError('Não foi possível identificar a obra selecionada');
      return false;
    }

    return this.validateDates();
  }

  validateDates(): boolean {
    if (this.filterTemp.beginAt == null && this.filterTemp.endAt == null) {
      return true;
    }

    if (this.filterTemp.beginAt == null && this.filterTemp.endAt != null) {
      this.appMessage.showError('Preencha a data início');
      return false;
    }

    if (this.filterTemp.beginAt != null && this.filterTemp.endAt == null) {
      this.appMessage.showError('Preencha a data fim');
      return false;
    }

    const dateBegin = Moment(this.filterTemp.beginAt);
    const dateEnd = Moment(this.filterTemp.endAt);

    if (dateEnd.isBefore(dateBegin)) {
      this.appMessage.showError('data início não pode ser superior a data fim');
      return false;
    }

    return this.occurrencesDateFilterForm.valid;
  }

  prepareRequest() {
    this.requestFilter.beginAt = null;
    this.requestFilter.endAt = null;
    if (this.filterTemp.beginAt != null && this.filterTemp.endAt != null) {
      this.requestFilter.beginAt = this.filterTemp.beginAt;
      this.requestFilter.endAt = this.filterTemp.endAt;
    }
  }
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'occurrences-detail.template.html',
  styleUrls: ['./occurrences-list.component.scss', './occurrences-detail.component.scss']
})
export class OccurrenceDetailDialogOverviewComponent {

  occurrenceTaskLimit = 5;

  detailOccurrence: any;
  detailOccurrenceDetail: any;
  constructionId: any;

  constructor(
    public dialogRef: MdDialogRef<OccurrenceDetailDialogOverviewComponent>,
    public confirmDialogHandler: ConfirmDialogHandler,
    public occurrenceService: OccurrenceService,
    private taskCreatorService: TaskCreatorService,
    private taskService: TasksService
  ) { }

  occurenceTaskLimitReached(): boolean {
    return this.detailOccurrenceDetail.listOccurrenceDetailTask.length >= this.occurrenceTaskLimit;
  }

  taskCreate() {
    const task = new Task();
    task.occurrence = new Occurrence();
    task.occurrence.id = this.detailOccurrenceDetail.id;

    this.taskCreatorService.requestDialogTask(this.constructionId, task).subscribe(task => {
    });
  }

  goToTasks(taskId) {
    this.taskService.getById(taskId).subscribe(task => {
      this.taskCreatorService.requestViewTask(this.constructionId, task).subscribe(editedTask => { });
    });
  }
}
