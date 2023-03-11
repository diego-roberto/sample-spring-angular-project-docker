import { TasksDialogComponent } from './../tasks-dialog/tasks-dialog.component';
import { MdSnackBar, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Moment from 'moment';

import { User } from 'app/shared/models/user.model';
import { Task } from 'app/shared/models/task.model';
import { AttachmentTaskFile } from 'app/shared/models/attachmentTaskFile.model';
import { TasksService } from 'app/shared/services/task.service';
import { TaskListResolver } from 'app/resolves/task.list.resolver';
import { UserService } from 'app/shared/services/user.service';
import { SessionsService } from 'app/shared/services/sessions.service';
import { UtilValidators } from 'app/shared/util/validators.util';


@Component({
  selector: 'tasks-data-form',
  templateUrl: './tasks-data-form.component.html',
  styleUrls: ['./tasks-data-form.component.scss']
})

export class TasksDataFormComponent implements OnInit {
  private currentUser: User;
  isSaving = false;
  taskForm: FormGroup;

  @Output() onAddTask = new EventEmitter();
  selectedKeywords: any[] = [];

  responsibleInput: string;
  responsibles: User[] = [];

  title: string;
  task: Task = new Task();
  users: Array<User> = [];
  attachmentFiles: Array<AttachmentTaskFile> = [];

  isUpdating: boolean;

  @ViewChild('textInput') textInput: ElementRef;

  taskDetailsMaxLength = 250;

  constructor(public dialogRef: MdDialogRef<TasksDialogComponent>,
    public tasksService: TasksService,
    public taskListResolver: TaskListResolver,
    public snackBar: MdSnackBar,
    private userService: UserService,
    private sessionsService: SessionsService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.taskForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required, UtilValidators.date]),
      responsible: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      responsibleIsUserSystem: new FormControl(true, [Validators.required]),
    });

    this.currentUser = this.sessionsService.getCurrent();

    if (this.data) {
      const { task, constructionId } = this.data;
      this.task = new Task();
      this.task.responsible = new User();

      if (task) {
        if (task.occurrence !== undefined && task.title === undefined) {
          this.isUpdating = false;

          this.title = 'nova tarefa de ocorrência';
          this.task.constructionId = constructionId;
          this.task.occurrence = task.occurrence;

          this.task.responsibleIsUserSystem = false;
          this.task.responsible.id = 0;
          this.task.responsible.name = '';
          this.task.responsible.email = '';
          this.responsibleInput = '';
        } else {
          this.isUpdating = true;

          this.task.initializeWithJSON(task);
          this.title = task.title;

          this.responsibleInput = task.responsibleName;
          this.task.responsible.id = task.responsibleId;
          this.task.responsible.name = task.responsibleName;
          this.task.responsible.email = task.responsibleEmail;
        }
      } else {
        this.isUpdating = false;

        this.title = 'nova tarefa';
        this.task.constructionId = constructionId;

        this.task.responsibleIsUserSystem = false;
        this.task.responsible.id = 0;
        this.task.responsible.name = '';
        this.task.responsible.email = '';
        this.responsibleInput = '';
      }
    }

    this.userService.getUsersByCompanyId(this.sessionsService.getCurrentCompany().companyId).subscribe(
      users => {
        this.responsibles = users;
        this.users = users;
        this.setUsers();
      }
    );
  }

  blurEventHandler() { }

  @HostListener('focus', ['$event'])
  focusEventHandler() {
    this.taskForm.controls.responsible.setValue('');
  }
  focusOutEventHandler() { }


  removeUsersAdmin(listUserAdmin, users: Array<User>): Array<User> {

    if (listUserAdmin != null && listUserAdmin.length > 0) {
      const prefixU = 'u_';
      const prefixW = 'w_';

      let adminIds = new Array();

      listUserAdmin.forEach(item => {
        adminIds.push(prefixU + item.userId);
        if (item.workerId && item.workerId != null) {
          adminIds.push(prefixW + item.workerId);
        }
      });

      // Remove usuário ADMIN SESI e usuario MERCADO da lista
      let filtered = users.filter(
        item => !(adminIds.indexOf(prefixU + item.id) >= 0 || adminIds.indexOf(prefixW + item.workerId) >= 0)
      );

      return filtered;
    }

    return users;
  }

  displayFn(user: User): any {
    return user ? user.name : user;
  }

  process(option) {
    this.task.responsible = option;
  }

  saveTask() {
    this.isSaving = true;

    if (
      this.task.title &&
      this.task.description &&
      this.task.deadline &&
      (this.task.responsible || this.responsibleInput)
    ) {

      if (!this.task.author) {
        this.task.author = new User();
        this.task.author.id = this.currentUser.id;
        this.task.author.email = this.currentUser.email;
      }

      if (!this.task.responsibleIsUserSystem) {
        let responsible = new User();

        responsible.name = this.responsibleInput;
        responsible.email = '';
        responsible.id = 0;

        this.task.responsible = responsible;
      }

      this.task.responsibleId = this.task.responsible.id;
      this.task.responsibleName = this.task.responsible.name;
      this.attachmentFiles = [];
      const deadline = Moment(this.task.deadline);
      this.task.deadline = deadline.endOf('hour').toDate();

      const taskToSave: Task = Object.assign(new Task(), this.task);
      taskToSave.attachmentFiles = Object.assign(new Array<AttachmentTaskFile>(), this.task.attachmentFiles);

      let isAttachmentFilesEmpty = taskToSave.attachmentFiles.length == 0 || !taskToSave.attachmentFiles
      if(isAttachmentFilesEmpty){
        this.tasksService.saveTask(this.task).subscribe(
          savedTask => {
            this.onAddTask.emit(savedTask);
            this.onAddTask.complete();
            this.dialogRef.close();
            this.snackBar.open('Sucesso ao salvar!', null, { duration: 3000 });
          },
          error => {
            this.handleError(error);
            this.isSaving = false;
          }
        );
      }
      else
      {
        taskToSave.attachmentFiles.forEach((file: AttachmentTaskFile) => {
          if (file.resourceFile || file.resourceThumbFile) {
            this.attachmentFiles.push(file);

          }
        });


        this.attachmentFiles.forEach((file: AttachmentTaskFile) => {
          taskToSave.attachmentFiles.splice(taskToSave.attachmentFiles.indexOf(file), 1);
        });

        const formData = new FormData();

        formData.append('task', JSON.stringify(taskToSave.toJSON()));

        this.attachmentFiles.forEach(file => {
          formData.append('file', file.file);
        });

        this.tasksService.uploadFile(formData).subscribe(
          task => {
            this.onAddTask.emit(task);
            this.onAddTask.complete();
            this.dialogRef.close();
            this.snackBar.open('Sucesso ao salvar!', null, { duration: 3000 });
          },
          error => {
            this.handleError(error);
            this.isSaving = false;
          }
        );
      }
    } else {
      this.snackBar.open('Deve preencher todos os campos obrigatórios', null, { duration: 3000 });
      this.isSaving = false;
    }
  }

  changeHasResponsible() {
    this.taskForm.controls.responsible.setValue(null);
    this.responsibleInput = "";
    this.task.responsible = null;

    if (this.taskForm.controls.responsibleIsUserSystem.value) {
      this.responsibles = this.users;
    } else {
      this.responsibles = [];
    }
  }

  private setUsers() {
    this.responsibles.forEach(user => {
      if (this.task.responsibleId === user.id) {
        this.task.responsible = user;
      }
      if (this.task.authorId === user.id) {
        this.task.author = user;
      }
    });
  }

  private handleError(error) {
    if (error.json() && error.json().errors && error.json().errors.length > 0) {
      this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
    } else {
      this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
    }
  }

  hasKeywords(selectedKeywords) {
    this.selectedKeywords = selectedKeywords;
  }
}
