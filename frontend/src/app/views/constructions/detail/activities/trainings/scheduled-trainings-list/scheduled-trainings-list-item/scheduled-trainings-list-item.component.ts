
import { MdDialogRef, MdDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { AppMessageService } from 'app/shared/util/app-message.service';

import { TrainingScheduleConstruction } from 'app/shared/models/training-schedule-construction.model';
import { TrainingScheduleService } from 'app/shared/services/training-schedule.service';
import { AttendanceListDialogComponent } from 'app/views/constructions/detail/activities/trainings/scheduled-trainings-list/scheduled-trainings-list-item/attendance-list-dialog/attendance-list-dialog.component';
import { ScheduledTrainingDetailsComponent } from '../../../../overview/scheduled-training-details/scheduled-training-details.component';
import { TrainingScheduleEditDialogComponent } from 'app/views/constructions/detail/activities/trainings/training-schedule-edit-dialog/training-schedule-edit-dialog.component';

import { RemoveScheduledTrainingsDialogService } from './remove-scheduled-training-dialog/remove-scheduled-training-dialog.service';

import * as Moment from 'moment';
import { TrainingScheduleAttendanceListUploadDialogComponent } from '../../training-schedule-attendance-list-upload-dialog/training-schedule-attendance-list-upload-dialog.component';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'scheduled-trainings-list-item',
  templateUrl: './scheduled-trainings-list-item.component.html',
  styleUrls: ['./scheduled-trainings-list-item.component.scss']
})
export class ScheduledTrainingsListItemComponent implements OnInit {

  @Input() scheduledTraining: TrainingScheduleConstruction;

  @Output() toShowPrintLoader: EventEmitter<boolean> = new EventEmitter();
  @Output() doUpdateList: EventEmitter<boolean> = new EventEmitter();

  timeState: number;

  private EXHIBITION_ID_PRESENCIAL = 1;
  private EXHIBITION_ID_TOTEM = 2;

  dialogConfig = {
    data: {
      id: null,
      scheduledTraining:null,
    }
  };

  constructor(
    private datePipe: DatePipe,
    private appMessage: AppMessageService,
    private trainingScheduleService: TrainingScheduleService,
    private dialog: MdDialog,
    private removeItemDialogService: RemoveScheduledTrainingsDialogService
  ) { }

  ngOnInit() {
    this.setTimeState();
  }

  verifyShowAttendanceList(scheduledTraining: TrainingScheduleConstruction) {
    if (scheduledTraining.attendanceListAt == null &&
      scheduledTraining.exhibitionModeId != null &&
      scheduledTraining.exhibitionModeId === this.EXHIBITION_ID_PRESENCIAL) {
      let dialogRef: MdDialogRef<AttendanceListDialogComponent>;
      dialogRef = this.dialog.open(AttendanceListDialogComponent, { data: { training: scheduledTraining } });
      dialogRef.afterClosed().subscribe(dialogReturn => {
        if (dialogReturn.doPrint) {
          this.printAttendanceList(scheduledTraining);
        }
      });
    } else {
      this.printAttendanceList(scheduledTraining);
    }
  }

  printAttendanceList(scheduledTraining: TrainingScheduleConstruction) {
    this.toShowPrintLoader.emit(true);
    this.trainingScheduleService.toPrintTrainingScheduleReport(scheduledTraining.id).subscribe((response) => {
      openNewTab(URL.createObjectURL(response));
      
      this.toShowPrintLoader.emit(false);
      this.doUpdateList.emit();
    },
      (error) => {
        this.toShowPrintLoader.emit(false);
        this.appMessage.errorHandle(error, 'Não foi possível carregar as informações da lista de presença');
      });

  }

  editScheduledTraining(scheduledTraining: TrainingScheduleConstruction) {
    const dialogRef = this.dialog.open(TrainingScheduleEditDialogComponent, { data: { scheduledTraining: scheduledTraining } });
    const sub = dialogRef.componentInstance.onUpdate.subscribe(() => {
      this.doUpdateList.emit();
      this.update();

    });
    dialogRef.afterClosed().subscribe(() => {
      this.update();

    });
  }

  update() {
    this.doUpdateList.emit();
  }

  setTimeState() {
    this.timeState = 0;

    const today = new Date(this.datePipe.transform(new Date(), 'MM/dd/yyyy'));
    const trainingDate = new Date(this.datePipe.transform(this.scheduledTraining.scheduledBegin, 'MM/dd/yyyy'));

    if (today > trainingDate) {
      this.timeState = -1;
    } else if (today < trainingDate) {
      this.timeState = 1;
    }
  }

  isTimeState(state: number): boolean {
    return this.timeState === state;
  }

  openTrainingDetails(id: number) {
    this.dialogConfig.data.id = id;
    this.dialogConfig.data.scheduledTraining=this.scheduledTraining;
    const dialogRef = this.dialog.open(ScheduledTrainingDetailsComponent, this.dialogConfig);
  }

  removeScheduledTraining(scheduledTraining: TrainingScheduleConstruction) {

    this.removeItemDialogService.requestDialog().subscribe(confirm => {
      if (confirm) {
        this.toShowPrintLoader.emit(true);
        this.trainingScheduleService.removeScheduledTraining(scheduledTraining.id).subscribe(
          success => {
            this.toShowPrintLoader.emit(false);
            this.appMessage.showSuccess('Agendamento excluído com sucesso.');
            this.doUpdateList.emit();
          },
          error => {
            this.toShowPrintLoader.emit(false);
            this.appMessage.errorHandle(error, 'Não foi possí­vel excluir o agendamento!');
          }
        );
      };
    });
  }

  showRemoveButton(scheduledTraining): Boolean {
    const scheduledBegin = Moment(scheduledTraining.scheduledBegin);
    const today = Moment(new Date());

    return today.isBefore(scheduledBegin);
  }

  showMinisters(scheduledTraining: TrainingScheduleConstruction): Boolean {
    const show = scheduledTraining.exhibitionMode && scheduledTraining.exhibitionMode.toUpperCase() == 'PRESENCIAL'; 
    return show;
  }

  openTrainingScheduleAttendanceListUploadDialogComponent (TrainingScheduleConstruction:TrainingScheduleConstruction) {
    let   dialogConfig = {
        data: {
          trainingScheduleConstruction:TrainingScheduleConstruction
        }
    };
    const dialogRef = this.dialog.open(TrainingScheduleAttendanceListUploadDialogComponent, dialogConfig);
  
  }

}
