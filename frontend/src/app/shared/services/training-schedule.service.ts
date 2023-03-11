import { HttpClientService } from './http-client.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TrainingSchedule } from 'app/shared/models/training-schedule.model';
import { TrainingScheduleConstruction } from 'app/shared/models/training-schedule-construction.model';
import { TrainingScheduleConstructionFilter } from 'app/shared/models/training-schedule-construction-filter.model';
import { TrainingScheduleDetails } from 'app/shared/models/training-schedule-details.model';
import { Paginator } from 'app/shared/models/paginator.model';
import { FileInfo } from 'app/shared/models/file-info.model';
import { TrainingTotem } from '../models/training-totem.model';
import { ScheduledTrainingAttendance } from 'app/shared/models/scheduled-training-attendance.model';
import { TrainingScheduleChart } from "app/shared/models/training-schedule-chart.model";

@Injectable()
export class TrainingScheduleService {
    public trainingSchedule: TrainingSchedule;

    private endpoint = '/training-schedule';
    private forthcoming = '/forthcoming';
    private details = '/details';

    constructor(private service: HttpClientService) { }

    findTrainingScheduleByFilter(requestFilter: TrainingScheduleConstructionFilter): Observable<any> {
        return this.service.post(this.endpoint + '/findTrainingScheduleByFilter', requestFilter.toJSON()).map(
            (jsonResponse) => {
                let paginator = new Paginator().initializeWithJSON(jsonResponse.response);
                jsonResponse.response.listTrainingSchedule.map(item => {
                    let temp = new TrainingScheduleConstruction().initializeWithJSON(item);
                    paginator.lista.push(temp);
                });
                return paginator;
            },
            error => { return null; }
        );
    }

    uploadAttendanceList(trainingScheduleId: number, file: File ): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.service.postWithNoHeaders(this.endpoint +'/'+ trainingScheduleId+ '/uploadAttendace'  , formData).map((jsonResponse) => {
            return jsonResponse;
        });
    }

    public toPrintTrainingScheduleReport(trainingScheduleId: number): Observable<File> {
        return this.service.get(this.endpoint + '/printTrainingScheduleReport/' + trainingScheduleId)
            .map(
                (response) => {
                    const fileInfo: FileInfo = new FileInfo().initializeWithJSON(response);
                    const sFile: string = fileInfo.file;
                    const byteCharacters = atob(sFile);
                    const byteNumbers = new Array(byteCharacters.length);

                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: fileInfo.fileType });

                    return new File([blob], fileInfo.fileName, { type: fileInfo.fileType });
                }
            );
    }

    getForthcomingTrainings(constructionId: number): Observable<Array<any>> {
        return this.service.get(this.endpoint + this.forthcoming + '/' + constructionId).map(
            (jsonResponse) => {
                return jsonResponse.listForthcomingTrainings.map(trainingSchedule => {
                    return new TrainingSchedule().initializeWithJSON(trainingSchedule);
                });
            },
            error => { return null; }
        );
    }

    getScheduledTrainingDetails(scheduledTrainingId: number): Observable<Array<any>> {
        return this.service.get(this.endpoint + this.forthcoming + this.details + '/' + scheduledTrainingId).map(
            (jsonResponse) => {
                return jsonResponse.listTrainingDetails.map(trainingDetails => {
                    return new TrainingScheduleDetails().initializeWithJSON(trainingDetails);
                });
            },
            error => { return null; }
        );
    }

    getScheduledTrainingAttendanceList(scheduledTrainingId: number): Observable<Array<any>> {
        return this.service.get(this.endpoint + '/attendanceList/' + scheduledTrainingId).map(
            (jsonResponse) => {
                if(jsonResponse.response.attendanceList === null){
                    return [];
                }
                return jsonResponse.response.attendanceList.map(attendance => {
                    return new ScheduledTrainingAttendance().initializeWithJSON(attendance);
                });
            },
            error => { return null; }
        );
    }

    updateScheduledTrainingAttendanceList(scheduledTrainingId: number, attendaceSelectedIdList: number[]): Observable<any> {
        const params = {
            participationDate: new Date(),
            trainingScheduleId: scheduledTrainingId,
            trainingScheduleWorkerIds: attendaceSelectedIdList
        };

        return this.service.post(this.endpoint + '/updateAttendanceList', params).map(
            (jsonResponse) => {
                return jsonResponse;
            },
            error => { return null; }
        );
    }

    findPendingTrainingsTotem(workerId: number,contructionId:number): Observable<Array<any>> {
        return this.service.get(this.endpoint + '/pendingTrainings/' + workerId+"?contructionId="+contructionId).map(
            (jsonResponse) => {
                return jsonResponse.listPendingTrainings.map(trainingTotem => {
                    return new TrainingTotem().initializeWithJSON(trainingTotem);
                });
            },
            error => { return null; }
        );
    }

    completedTraining(workerId: number, trainingScheduleId: number): Observable<Array<any>> {
  
        const params = {
            trainingScheduleId: trainingScheduleId
        };

        return this.service.post(this.endpoint + '/completedTraining/'+workerId, params).map(
            (jsonResponse) => {
                return jsonResponse;
            },
            error => { return null; }
        );
    }

    removeScheduledTraining(scheduledTrainingId: number) {
        const params = {
            scheduledTrainingId: scheduledTrainingId
        };

        return this.service.post(this.endpoint + '/removeScheduledTraining/' + scheduledTrainingId, params).map(
            (jsonResponse) => {
                return jsonResponse;
            },
            error => { return null; }
        );
    }

    getTrainingScheduleChartChart(filter: any): Observable<TrainingScheduleChart[]> {
        return this.service.post(this.endpoint + '/trainingScheduleChart', filter).map((jsonResponse) => {
            return jsonResponse.response.items.map(item => new TrainingScheduleChart().initializeWithJSON(item));
        });
    }

}
