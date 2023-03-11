import { ConstructionsService } from '../../../../../../shared/services/constructions.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as _c from 'lodash/collection';
import * as _a from 'lodash/array';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Task } from '../../../../../../shared/models/task.model';
import { User } from '../../../../../../shared/models/user.model';
import { TasksService } from '../../../../../../shared/services/task.service';
import { SessionsService } from '../../../../../../shared/services/sessions.service';
import { TaskListResolver } from '../../../../../../resolves/task.list.resolver';
import { ConfirmDialogHandler } from '../../../../../../shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { TaskCreatorService } from '../../../_common/task-creator.service';
import { UserService } from '../../../../../../shared/services/user.service';
import { AppMessageService } from '../../../../../../shared/util/app-message.service';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { TasksCompleteDialogComponent } from '../tasks-complete-dialog/tasks-complete-dialog.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {

  public tasks: Array<Task> = null;
  private constructionId: number = this.route.snapshot.parent.params['id'];
  private currentUser: User;
  private users: Array<User>;

  public searchValue: string = '';
  public allFilteredTask = [];

  spin = true;
  direction = 'up';
  animationMode = 'fling';
  fixed = false;

  @Input() addTask: Observable<Task>;

  @Input() set index(index) {
    if (index === 1) {
      if (!this.listsLoaded) {
        this.loadTasksAndUsers();
      }
    }
  }

  @Input() taskScroll;

  private addTaskSubscription: Subscription;
  private changeConstructionSubscription: Subscription;

  listsLoaded = false;

  selectedFilters = {
    text: '',
    personal: true,
    team: true,
    history: true,
  };

  dialogConfig = {
    data: {
      task: new Task(),
      constructionId: this.constructionId
    }
  };

  scrollTasks = [];

  @Input() opennedByLink;

  constructor(
    private mdDialog: MdDialog,
    private taskService: TasksService,
    private sessionsService: SessionsService,
    public taskListResolver: TaskListResolver,
    private appMessage: AppMessageService,
    public confirmDialogHandler: ConfirmDialogHandler,
    private route: ActivatedRoute,
    private taskCreatorService: TaskCreatorService,
    private userService: UserService,
    private constructionsService: ConstructionsService,
    private router: Router,
    public permissionService: PermissionService
  ) { }

  ngOnInit() {

    this.route.snapshot.data['construction'];
    this.currentUser = this.sessionsService.getCurrent();

    /*this.addTaskSubscription = this.addTask.subscribe(task => {
        this.tasks.push(task);
        this.sortAndRenderTasks();
    });*/

    this.constructionId = this.constructionsService.construction.id;
    this.changeConstructionSubscription = this.constructionsService.changeConstructionObservable.subscribe(construction => {
      this.constructionId = this.constructionsService.construction.id;
      this.loadTasksAndUsers();
    });

    this.loadTasksAndUsers();
    this.initListenerQueryParams();
  }

  initListenerQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params['add'] === 'true') {
        this.openTaskDialog();
      } else if (params['edit']) {
        const taskId = parseInt(params['edit']);
        this.openTaskDialogById(taskId, true);
      } else if (params['view']) {
        const taskId = parseInt(params['view']);
        const companyId = parseInt(params['companyId']);
        const isNotification = (params['notification'] === 'true');

        if (isNotification) {
          this.openDialogByNotification(companyId, taskId);
        } else {
          this.openTaskDialogById(taskId, false);
        }
      }
    });
  }

  complete(task: Task) {
      const dialogRef = this.mdDialog.open(TasksCompleteDialogComponent);
      dialogRef.componentInstance.loadTasksAndUsers = this.loadTasksAndUsers.bind(this);
      dialogRef.componentInstance.onAddTaskEvent(task);
  }

  navigateToModal(queryParams: any) {
    // changes the route without moving from the current view or

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      skipLocationChange: false,

    });
  }

  openTaskDialog() {
    this.taskCreatorService.requestDialogTask(this.constructionId).subscribe(task => {
      if (task) {
        this.loadTasksAndUsers();
      }
      this.navigateToModal({});
    });
  }

  edit(task: Task) {
    this.taskCreatorService.requestDialogTask(this.constructionId, task).subscribe(editedTask => {
      if (editedTask) {
        this.tasks.splice(this.tasks.indexOf(this.tasks.find(t => t.id === editedTask.id)), 1, editedTask);
        this.loadTasksAndUsers();
      }
      this.navigateToModal({});
    });
  }

  view(task: Task) {
    this.taskCreatorService.requestViewTask(this.constructionId, task).subscribe(editedTask => {
      if (editedTask) {
        this.tasks.splice(this.tasks.findIndex(t => t.id === editedTask.id), 1, editedTask);
        this.sortAndRenderTasks();
      }
      this.navigateToModal({});
    });
  }

  delete(task: Task) {
    this.confirmDialogHandler.call('excluir', 'Deseja realmente excluir a Tarefa?').subscribe((confirm) => {
      if (confirm) {
        this.taskService.deleteTask(task.id).subscribe(
          response => {
            this.appMessage.showSuccess('Tarefa excluida com sucesso!');
            _a.remove(this.tasks, (t) => task.id === t.id);
            this.filterTasks();
          },
          error => {
            this.appMessage.errorHandle(error, null);
          }
        );
      }
    });
  }

  check(task: Task) {
    task.checked = true;

    this.setUsers(task);

    this.taskService.saveTask(task).subscribe(
      savedTask => {
        this.appMessage.showSuccess('Tarefa feita!');
        this.tasks.splice(this.tasks.findIndex(t => t.id === task.id), 1, savedTask);
        this.sortAndRenderTasks();
      },
      error => {
        task.checked = false;
        this.appMessage.errorHandle(error, null);
      }
    );
  }

  private setUsers(task: Task) {
    this.users.forEach(user => {
      if (task.responsibleId === user.id) {
        task.responsible = user;
      }
      if (task.authorId === user.id) {
        task.author = user;
      }
    });
  }

  filterTasks() {
    this.allFilteredTask = this.mapTasks(
      this.tasks.filter(task => {
        return (
          (this.selectedFilters.personal && task.responsibleId === this.currentUser.id && !task.checked) &&
          !(this.selectedFilters.text.length > 0 && task.title.toLowerCase().indexOf(this.selectedFilters.text.toLowerCase()) === -1) ||
          (this.selectedFilters.team && task.responsibleId !== this.currentUser.id && !task.checked) &&
          !(this.selectedFilters.text.length > 0 && task.title.toLowerCase().indexOf(this.selectedFilters.text.toLowerCase()) === -1) ||
          (this.selectedFilters.history && task.checked) &&
          !(this.selectedFilters.text.length > 0 && task.title.toLowerCase().indexOf(this.selectedFilters.text.toLowerCase()) === -1)
        );
      })
    );
  }


  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText() {
    this.selectedFilters.text = this.searchValue.trim();
    this.filterTasks();
  }

  toggleTaskActiveFilter(filter: string) {
    this.selectedFilters[filter] = !this.selectedFilters[filter];
    this.filterTasks();
  }

  private mapTasks(tasks: Array<Task>): Array<any> {
    const list = tasks.map(task => {
      return { title: null, task: task };
    });

    for (const status in TaskStatus) {
      if (!isNaN(Number(status))) {
        const taskIndex = list.findIndex(group => group.task.status === Number(status));
        if (taskIndex > -1) {
          // taskGroup.title = TaskStatus[Number(status)];
          list.splice(taskIndex, 0, { title: TaskStatus[Number(status)], task: list[taskIndex].task });
        }
      }
    }
    return list;
  }

  private findAndOpen(tasks: Task[], taskId: number, edit: boolean = null): void {
    const found = tasks.find(task => task.id === taskId);

    if (found) {
      if (edit) {
        this.edit(found);
      } else {
        this.view(found);
      }
    } else {
      this.appMessage.showError('Tarefa não encontrada');
    }
  }

  private openTaskDialogById(taskId: number, edit: boolean = null) {
    if (this.taskListResolver.load.getValue() && this.taskListResolver.load.getValue().length > 0) {
      this.findAndOpen(this.taskListResolver.load.getValue(), taskId, edit);
    } else {
      const subscription = this.taskListResolver.load.subscribe(tasks => {
        if (tasks.length > 0) {
          this.findAndOpen(tasks, taskId, edit);

          if (subscription) {
            subscription.unsubscribe();
          }
        }
      });
    }
  }

  private loadTasksAndUsers() {
    const subject = new Subject<any>();

    Observable.forkJoin(
      this.userService.getUsers(),
      this.taskService.getConstructionTaskList(this.constructionId)).subscribe
      (
        ([users, tasks]) => {
          this.users = users;
          this.sortAndRenderTasks();
          this.tasks = _c.sortBy(tasks, ['status', 'deadline', 'title']);
          this.taskListResolver.setListTask(this.tasks);
          this.filterTasks();
          this.listsLoaded = true;
        }
      ).add(() => {
        subject.next();
      });

    return subject.asObservable();
  }

  private sortAndRenderTasks() {
    this.tasks = _c.sortBy(this.tasks, ['status', 'deadline', 'title']);
    this.filterTasks();
  }

  public getTaskScroll() {
    return this.taskScroll;
  }

  openDialogByNotification(companyId: number, taskId: number) {
    const msgCompany = 'A tarefa em questão não pertence a esta empresa.';
    const currentCompany = this.sessionsService.getCurrentCompany();

    if (!companyId || isNaN(taskId) || companyId !== currentCompany.companyId) {
      this.appMessage.showError(msgCompany);
      return;
    } else {
      this.openTaskDialogById(taskId);
    }

  }

  ngOnDestroy() {
    this.changeConstructionSubscription.unsubscribe();
  }

}

export enum TaskStatus {
  'Tarefas Atrasadas',
  'Hoje',
  'Próximas',
  'Concluídas'
}

