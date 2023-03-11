import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { TasksDataFormComponent } from './../../tasks/tasks-data-form/tasks-data-form.component';
import { ConstructionWorkersFormComponent } from 'app/views/constructions/form/construction-form/components/construction-workers-form/construction-workers-form.component';
import { OccurrencesDataFormComponent } from './../occurrences-data-form/occurrences-data-form.component';
import { OccurrencesWorkersComponent } from './occurrences-workers/occurrences-workers.component';

import { AppMessageService } from './../../../../../../shared/util/app-message.service';
import { FilesService } from 'app/shared/services/files.service';
import { ConstructionsService } from './../../../../../../shared/services/constructions.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { OccurrenceService } from './../../../../../../shared/services/occurrence.service';

import { Construction } from 'app/shared/models/construction.model';
import { Worker } from 'app/shared/models/worker.model';
import { User } from './../../../../../../shared/models/user.model';
import { Occurrence } from './../../../../../../shared/models/occurrence.model';

import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';

@Component({
  selector: 'occurrences-dialog',
  templateUrl: './occurrences-dialog.component.html',
  styleUrls: ['./occurrences-dialog.component.scss']
})
export class OccurrencesDialogComponent implements OnInit {

  readonly REGULATORY_MODULE_ID = 1;

  stepList = [];
  title: string;
  step = 0;
  occurrence: Occurrence;
  isSaved: boolean;
  createTask: boolean;
  currentUser: User;
  spinnerStack = new Set<string>();

  listSubType = [];

  @ViewChild('occurrenceForm') occurrenceForm: OccurrencesDataFormComponent;
  @ViewChild('occurrenceWorkers') occurrenceWorkers: OccurrencesWorkersComponent;
  @ViewChild('workerList') workerList: ConstructionWorkersFormComponent;
  @ViewChild('taskForm') taskForm: TasksDataFormComponent;
  constructor(
    @Inject(MD_DIALOG_DATA) public dialogData: any,
    private dialogRef: MdDialogRef<OccurrencesDialogComponent>,
    private occurrenceService: OccurrenceService,
    private filesService: FilesService,
    private constructionService: ConstructionsService,
    private sessionsService: SessionsService,
    private appMessage: AppMessageService,
    private confirmDialogHandler: ConfirmDialogHandler
  ) { }

  ngOnInit() {
    this.loadSteps();
    this.occurrence = new Occurrence();
    if (this.isOnEdit()) {
      this.doLoadOccurrenceToEdit(this.dialogData.occurrenceId);
      this.title = 'editar ocorrência';
    } else {
      this.title = 'cadastrar ocorrência';
    }
    this.isSaved = false;
    this.createTask = false;
    this.currentUser = this.sessionsService.getCurrent();
  }

  isOnEdit(): boolean {
    return (this.dialogData && this.dialogData.occurrenceId)
      || (this.occurrence && this.occurrence.id);
  }

  doLoadOccurrenceToEdit(occurrenceId: number) {
    if (occurrenceId) {
      this.doAddToSpinnerStack('loadOccurrenceToEdit');
      const getOccurrenceObservable = this.occurrenceService.getOccurrence(occurrenceId);
      getOccurrenceObservable.subscribe(occurrence => {
        this.occurrence = occurrence;
      },
        error => {
          this.appMessage.errorHandle(error, 'Erro ao carregar ocorrência! ');
          this.doRemoveFromSpinnerStack('loadOccurrenceToEdit');
          this.dialogRef.close(undefined);
        },
        () => {
          this.doRemoveFromSpinnerStack('loadOccurrenceToEdit');
        }
      );
      getOccurrenceObservable.toPromise();
    }
  }

  loadSteps() {
    this.stepList = ['data', 'workers', 'attachments'];

    this.doRemoveStepWorkersIfConstructionHasOnlyRegulatoryModule();
  }

  isActualStep(step: string): boolean {
    return this.stepList[this.step] === step;
  }

  changeStep(toBackward?: boolean) {
    if (toBackward) {
      this.step--;
    } else {
      this.step++;
    }

    if (this.step < 0) {
      this.step = this.stepList.length;
    } else if (this.step > this.stepList.length) {
      this.step = 0;
    }
  }

  saveAndCreateTask() {
    this.confirmDialogHandler.call('Gerar ocorrência', 'Esta ação irá registrar uma ocorrência. Deseja continuar?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.save(true);
      }
    });
  }

  async save(createTask?: boolean) {
    this.doAddToSpinnerStack('save');
    await this.saveAttachmentFiles();
    this.setOccurrenceInfo();
    await this.occurrenceService.saveOccurrence(this.occurrence).subscribe(
      value => {
        if (!this.occurrence.id) { this.occurrence.id = value.id; }
        this.isSaved = true;
        if (createTask) { this.createTask = createTask; }
        this.dialogRef.close(value);
      },
      error => {
        this.appMessage.errorHandle(error, 'Erro ao salvar ocorrência! ');
        this.doRemoveFromSpinnerStack('save');
      },
      () => {
        this.doRemoveFromSpinnerStack('save');
      }
    );
  }

  async saveAttachmentFiles() {
    for (const file of this.occurrence.files) {
      if (!file.id) {
        const uploadFileObservable = this.filesService.uploadFile('occurrences', file.resourceFile);
        uploadFileObservable.subscribe(
          savedFile => {
            file.id = savedFile.id;
            file.fileName = savedFile.fileName;
            file.fileType = savedFile.fileType;
            file.filePath = savedFile.filePath;
          },
          error => {
            this.appMessage.errorHandle(error, 'Erro ao salvar ocorrência! ');
          }
        );
        await uploadFileObservable.toPromise();
      }
    };
  }

  async edit(createTask?: boolean) {
    this.doAddToSpinnerStack('edit');
    await this.occurrenceService.saveOccurrence(this.occurrence).subscribe(
      value => {
        this.isSaved = true;
        if (createTask) { this.createTask = createTask; }
        this.appMessage.showSuccess('Ocorrência atualizada com sucesso!');
        this.dialogRef.close(value);
      },
      error => {
        this.appMessage.errorHandle(error, 'Erro ao editar a ocorrência! ');
        this.doRemoveFromSpinnerStack('edit');
      },
      () => {
        this.doRemoveFromSpinnerStack('edit');
      }
    );
  }

  setOccurrenceInfo() {
    this.occurrence.author = this.currentUser;
    this.occurrence.workerAuthor = new Worker();
    this.occurrence.workerAuthor.id = this.currentUser.workerId;
    this.occurrence.construction = this.constructionService.construction;
    this.occurrence.companyId = this.currentUser.companyId;
  }

  doRemoveStepWorkersIfConstructionHasOnlyRegulatoryModule() {
    this.constructionService.getModules(this.constructionService.construction.id).subscribe(modules => {
      if (modules.length === 1 && modules[0] === this.REGULATORY_MODULE_ID) {
        this.stepList.splice(this.stepList.indexOf('workers'), 1);
      }
    });
  }

  doAddToSpinnerStack(key: string) {
    this.spinnerStack.add(key);
  }

  doRemoveFromSpinnerStack(key: string) {
    this.spinnerStack.delete(key);
  }

  isSpinnerActivated(key?: string): boolean {
    if (key) {
      return this.spinnerStack.has(key);
    }
    return this.spinnerStack.size > 0;
  }

  disableNextButton() {
    if (this.step == 1) {
      return (this.occurrenceWorkers.workersSelectedVirtualScrollItems.length === 0) ||
        (this.occurrenceWorkers.workersSelectedVirtualScrollItems.length === 0 && this.occurrenceWorkers.workersVirtualScrollItems.length === 0);
    }
    return !this.occurrenceForm.oneStepFormGroup.valid;
  }
}
