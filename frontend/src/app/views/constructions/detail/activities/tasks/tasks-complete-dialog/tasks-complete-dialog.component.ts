import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import { TaskListResolver } from 'app/resolves/task.list.resolver';
import { AttachmentTaskFile } from 'app/shared/models/attachmentTaskFile.model';
import { Task } from 'app/shared/models/task.model';
import { TasksService } from 'app/shared/services/task.service';
import * as moment from 'moment';

@Component({
  selector: 'tasks-complete-dialog',
  templateUrl: 'tasks-complete-dialog.component.html',
  styleUrls: ['./tasks-complete-dialog.component.scss']
})

export class TasksCompleteDialogComponent implements OnInit {

  @Output() onAddTask = new EventEmitter();

  isSaving = false;
  taskForm: FormGroup;

  title: string;
  task: Task = new Task();
  attachmentFiles: Array<AttachmentTaskFile> = [];
  taskObservationMaxLength = 1000;
  loadTasksAndUsers: () => void;

  constructor(public dialogRef: MdDialogRef<TasksCompleteDialogComponent>,
    public tasksService: TasksService,
    public taskListResolver: TaskListResolver,
    public snackBar: MdSnackBar
  ) { }

  ngOnInit() {
    this.taskForm = new FormGroup({
      checkedObservation: new FormControl('', [Validators.required])
    });

    if (this.task) {
      this.title = 'Concluir Tarefa: ' + this.task.title;
    } else {
      this.title = 'Concluir Tarefa';
    }
  }

  onAddTaskEvent(task: Task) {
    this.task.id = task.id;
    this.task.title = task.title;
  }

  completeTask() {
    this.isSaving = true;


    let hasFileChange = false;
    this.attachmentFiles = [];

    this.task.checkedAt = moment();

    const taskToComplete: Task = Object.assign(new Task(), this.task);

    taskToComplete.attachmentFiles = Object.assign(new Array<AttachmentTaskFile>(), this.task.attachmentFiles);

    taskToComplete.attachmentFiles.forEach((file: AttachmentTaskFile) => {
      if (file.resourceFile || file.resourceThumbFile) {
        this.attachmentFiles.push(file);
        hasFileChange = true;
      }
    });


    const formData = new FormData();

    formData.append('task', JSON.stringify(taskToComplete.toCompleteJSON()));

    if (hasFileChange) {
      this.attachmentFiles.forEach(file => {
        formData.append('file', file.file);
      });
    } else {
      formData.append('file', null);
    }

    this.tasksService.completeTask(formData).subscribe(
      task => {
        this.onAddTask.emit(task);
        this.onAddTask.complete();
        this.dialogRef.close();
        this.snackBar.open('Sucesso ao salvar!', null, { duration: 3000 });
        this.loadTasksAndUsers();
      },
      error => {
        this.handleError(error);
        this.isSaving = false;
      }
    );
  }

  private handleError(error) {
    if (error.json() && error.json().errors && error.json().errors.length > 0) {
      this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
    } else {
      this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
    }
  }
}
