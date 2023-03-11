import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog } from '@angular/material';
import * as Moment from 'moment';
import { DatePipe } from '@angular/common';

import { FormGroup, FormControl } from '@angular/forms';

import { AppMessageService } from "app/shared/util/app-message.service";
import { TrainingScheduleService } from "app/shared/services/training-schedule.service";
import { ConstructionsService } from "app/shared/services/constructions.service";
import { TrainingScheduleConstruction } from "app/shared/models/training-schedule-construction.model";
import { TrainingCategory } from "app/shared/models/training-category.model";
import { TrainingScheduleDialogComponent } from 'app/views/constructions/detail/activities/trainings/training-schedule-dialog/training-schedule-dialog.component';
import { TrainingScheduleConstructionFilter } from "app/shared/models/training-schedule-construction-filter.model";
import { UtilValidators } from 'app/shared/util/validators.util';
import { Paginator } from "app/shared/models/paginator.model";


@Component({
  selector: 'scheduled-trainings-list',
  templateUrl: './scheduled-trainings-list.component.html',
  styleUrls: ['./scheduled-trainings-list.component.scss']
})
export class ScheduledTrainingsListComponent implements OnInit {
  private changeConstructionSubscription: Subscription;

  trainingScheduleConstructionFilterForm: FormGroup;

  categoryList: TrainingCategory[];
  scheduledTrainingList: TrainingScheduleConstruction[];
  categoryFilter: Map<TrainingCategory, boolean>;
  loadingActive = false;
  requestFilter: TrainingScheduleConstructionFilter;
  filterTemp: TrainingScheduleConstructionFilter;
  searchValue = '';
  byFilter = false;

  fixed = false;
  spin = true;

  scheduledTrainingGroups = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appMessage: AppMessageService,
    private constructionsService: ConstructionsService,
    public dialog: MdDialog,
    private trainingScheduleService: TrainingScheduleService,
    private datePipe: DatePipe
  ) {
    this.trainingScheduleConstructionFilterForm = new FormGroup({
      action: new FormControl(''),
      beginAt: new FormControl('', [UtilValidators.date]),
      endAt: new FormControl('', [UtilValidators.date]),
      newObservation: new FormControl('')
    });
  }


  ngOnInit() {
    this.trainingScheduleConstructionFilterForm.controls.action.disable({ onlySelf: true, emitEvent: false });

    this.categoryList = this.getCategoryList();

    this.resetFields();
    this.getScheduledTrainingList(this.requestFilter);

    // Toda a vez que uma construção for selecionada esse método será executado.
    this.changeConstructionSubscription = this.constructionsService.changeConstructionObservable.subscribe(async construction => {
      this.resetFields();
      this.getScheduledTrainingList(this.requestFilter);
      this.applyFilter()
    });

  }


  resetFields() {
    this.filterTemp = new TrainingScheduleConstructionFilter();
    this.requestFilter = new TrainingScheduleConstructionFilter();
    this.requestFilter.constructionId = this.getConstructionId();
    this.requestFilter.categories = new Array();

    this.resetCategoryFilter();
  }

  resetCategoryFilter() {
    this.categoryFilter = new Map<TrainingCategory, boolean>();
    for (const category of this.categoryList) {
      this.categoryFilter.set(category, true);
    }
  }

  getScheduledTrainingList(request: TrainingScheduleConstructionFilter) {
    if (!request.categories.length) {
      request.categories = this.getCategoryList()
    }
    this.loadingActive = true;
    this.trainingScheduleService.findTrainingScheduleByFilter(request).subscribe(async (response) => {
      this.loadingActive = false;
      let paginator: Paginator = response;
      request.totalPages = paginator.totalPages;
      this.scheduledTrainingList = paginator.lista;
      this.mapTrainingSchedule();
    }, error => {
      this.loadingActive = false;
      this.appMessage.errorHandle(error, null);
    });
  }


  mapTrainingSchedule() {
    this.scheduledTrainingGroups = [];
    const now = new Date();
    const groupMesAtual = this.datePipe.transform(now, 'MMMM/yyyy');

    let group = null;
    this.scheduledTrainingList.forEach(item => {
      let groupItem = this.datePipe.transform(item.scheduledBegin, 'MMMM/yyyy');
      if (groupItem === groupMesAtual) {
        groupItem = 'mês atual';
      }

      if (group == null || group.group != groupItem) {
        group = { group: groupItem, scheduledTrainingList: new Array() }
        this.scheduledTrainingGroups.push(group);
      }

      group.scheduledTrainingList.push(item);
    });

  }

  togglePage(page: number) {
    this.requestFilter.page = page;
    this.getScheduledTrainingList(this.requestFilter);
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  applyFilter() {
    this.filterTemp.text = this.searchValue.trim();

    if (!this.validateFilter()) {
      return;
    }

    this.byFilter = true;
    this.prepareRequest();
    this.getScheduledTrainingList(this.requestFilter);
  }

  validateFilter(): boolean {
    if (this.requestFilter.constructionId == null) {
      this.appMessage.showError('Não foi possível identificar a obra selecionada');
      return false;
    }

    let categorySelected = false;
    this.categoryList.map(category => {
      if (this.categoryFilter.get(category)) {
        categorySelected = true;
      }
    });

    if (!categorySelected) {
      this.appMessage.showError('Selecione ao menos uma categoria');
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

    return this.trainingScheduleConstructionFilterForm.valid;
  }

  prepareRequest() {
    this.requestFilter.beginAt = null;
    this.requestFilter.endAt = null;
    if (this.filterTemp.beginAt != null && this.filterTemp.endAt != null) {
      this.requestFilter.beginAt = this.filterTemp.beginAt;
      this.requestFilter.endAt = this.filterTemp.endAt;
    }

    this.requestFilter.text = this.filterTemp.text;

    this.prepareCategoryRequest();
  }

  prepareCategoryRequest() {
    this.requestFilter.categories = new Array();

    let categoryUnselect = false;
    this.categoryList.map(category => {
      if (!this.categoryFilter.get(category)) {
        categoryUnselect = true;
      }
    });

    if (categoryUnselect) {
      this.categoryList.map(category => {
        if (this.categoryFilter.get(category)) {
          this.requestFilter.categories.push(category);
        }
      });
    }
  }

  getConstructionId(): number {
    let construction = this.constructionsService.construction;
    if (construction && construction != null && construction.id && construction.id != null) {
      return construction.id;
    }

    const paramId = this.route.snapshot.parent.params['id'];
    if (paramId && paramId != 'undefined') {
      return paramId;
    }
    return null;
  }

  update() {
    setTimeout(() => {
      this.ngOnInit();
    }, 1000);
  }



  showAddTrainingSchedule() {
    const dialogRef = this.dialog.open(TrainingScheduleDialogComponent, { width: '80%', height: '92%' });
    const sub = dialogRef.componentInstance.onUpdate.subscribe(() => {
      this.update();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.update();
    });
  }


  getCategoryList(): TrainingCategory[] {
    return [
      new TrainingCategory().initializeWithJSON({ id: 1, name: 'Profissionalizante' }),
      new TrainingCategory().initializeWithJSON({ id: 2, name: 'SST' }),
      new TrainingCategory().initializeWithJSON({ id: 3, name: 'Outros' })
    ]
  }

  toggleCategoryFilter(category: TrainingCategory) {
    this.categoryFilter.set(category, !this.categoryFilter.get(category));
  }

  get form() {
    return this.trainingScheduleConstructionFilterForm;
  }

  hasErrorForm(attr: string, type: string): boolean {
    if (this.trainingScheduleConstructionFilterForm.controls[attr].touched) {
      return this.trainingScheduleConstructionFilterForm.controls[attr].hasError(type);
    } else {
      return false;
    }
  }

  toShowPrintLoader(value: boolean) {
    this.loadingActive = value;
  }

  ngOnDestroy() {
    this.changeConstructionSubscription.unsubscribe();
  }


}
