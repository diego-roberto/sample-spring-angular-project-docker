import { AttachmentTaskFile } from 'app/shared/models/attachmentTaskFile.model';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { DashboardFilter } from '../models/dashboard-filter';

import { Task } from 'app/shared/models/task.model';

@Injectable()
export class TasksService {

    private endpoint = '/tasks';
    private construction = '/construction/';
    private responsible = '/responsible/';    
    private responsibles = '/responsibles/';
    private chart = '/taskChart';

    constructor(
        private http: Http,
        private service: HttpClientService,
    ) { }

    getAllTaskList(): Observable<Array<Task>> {

        return this.service.get(this.endpoint)
            .map((jsonResponse) => {
                return jsonResponse.tasks.map(task => {
                    return new Task().initializeWithJSON(task);
                });
            });
    }

    getConstructionTaskList(id: number): Observable<Array<Task>> {

        return this.service.get(this.endpoint + this.construction + id)
            .map((jsonResponse) => {
                return jsonResponse.tasks.map(task => {
                    return new Task().initializeWithJSON(task);
                });
            });
    }

    getTaskListUserAndConstruction(userId: number, constructionId: number): Observable<Array<Task>> {
        return this.service.get(this.endpoint + this.responsible + userId + this.construction + constructionId)
            .map((jsonResponse) => {
                return jsonResponse.tasks.map(task => {
                    return new Task().initializeWithJSON(task);
                });
            });
    }

    saveTask(task: Task): Observable<Task> {
        if (task.id) {
            return this.updateTask(task);
        } else {
            return this.createTask(task);
        }
    }

    private createTask(task: Task): Observable<Task> {
        return this.service.post(this.endpoint, JSON.stringify(task.toJSON()))
            .map((jsonResponse) => {
                return new Task().initializeWithJSON(jsonResponse.task);
            });
    }

    private updateTask(task: Task): Observable<Task> {
        return this.service.put(this.endpoint + '/' + task.id, JSON.stringify(task.toUpdateJSON()))
            .map((jsonResponse) => {
                return new Task().initializeWithJSON(jsonResponse.task);
            });
    }

    completeTask(formData: any): Observable<Task> {
        return this.service.postWithNoHeaders(this.endpoint + '/completeTask', formData)
            .map((jsonResponse) => {
                return new Task().initializeWithJSON(jsonResponse.task);
            });
    }
    
    uploadFile(formData: any): Observable<Task> {
        return this.service.postWithNoHeaders(this.endpoint + '/attachments', formData)
            .map((jsonResponse) => {
                return new Task().initializeWithJSON(jsonResponse.task);
            });
    }

    deleteTask(id: number): Observable<any> {
        return this.service.delete(this.endpoint + '/' + id)
            .map((response) => {
                return response;
            });
    }

    getById(id: number): Observable<any> {
        return this.service.get(this.endpoint + '/' + id)
        .map((jsonResponse) => {
            return new Task().initializeWithJSON(jsonResponse.task);
        });
    }

    updateChart(dashboardFilter: DashboardFilter): Observable<any> {
        return this.service.post(this.endpoint + this.chart, { dashboardFilter: dashboardFilter })
        .map((jsonResponse) => {
            return jsonResponse;
        });
    }

    
    getResponsibles(): Observable<Array<string>> {

        return this.service.get(this.endpoint+ this.responsibles)
            .map((jsonResponse) => {
                return jsonResponse.responsibles.map((res: string) => {
                    return res;
                });
        });

    }
 }
