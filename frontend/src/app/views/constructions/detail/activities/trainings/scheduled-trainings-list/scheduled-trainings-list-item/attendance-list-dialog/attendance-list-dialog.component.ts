import { Worker } from 'app/shared/models/worker.model';
import { MD_DIALOG_DATA, MdDialogRef, MdDialog } from '@angular/material';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { TrainingScheduleConstruction } from 'app/shared/models/training-schedule-construction.model';
import { TrainingScheduleService } from 'app/shared/services/training-schedule.service';
import { ScheduledTrainingAttendance } from 'app/shared/models/scheduled-training-attendance.model';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { TrainingScheduleAttendanceListUploadDialogComponent } from '../../../training-schedule-attendance-list-upload-dialog/training-schedule-attendance-list-upload-dialog.component';

@Component({
  selector: 'attendance-list-dialog',
  templateUrl: './attendance-list-dialog.component.html',
  styleUrls: ['./attendance-list-dialog.component.scss']
})
export class AttendanceListDialogComponent implements OnInit {

  @ViewChild('filter') filter: ElementRef;

  training: TrainingScheduleConstruction;
  attendanceList: ScheduledTrainingAttendance[];
  attendanceFilteredList: ScheduledTrainingAttendance[];
  attendanceMap: Map<ScheduledTrainingAttendance, boolean>;

  constructor(
    @Inject(MD_DIALOG_DATA) public dialogData: any,
    private dialogRef: MdDialogRef<AttendanceListDialogComponent>,
    private trainingScheduleService: TrainingScheduleService,
    private confirmDialogHandler: ConfirmDialogHandler,
    private dialog: MdDialog,
  ) { }

  ngOnInit() {
    this.training = this.dialogData.training;
    this.trainingScheduleService.getScheduledTrainingAttendanceList(this.training.id).subscribe(attendanceList => {
      this.attendanceList = attendanceList;
      this.doCompanyWorkersOrderByName();
      this.attendanceMap = new Map<ScheduledTrainingAttendance, boolean>();
      for (const attendance of this.attendanceList) {
        const attendanceSelectedState = attendance.participationDate !== undefined && attendance.participationDate !== null;
        this.attendanceMap.set(attendance, attendanceSelectedState);
      }
    });
  }

  doPrint() {
    this.confirmDialogHandler.call('Gerar relatório de presença', 'Após imprimir, não será mais possível alterar a Lista de Presença. Deseja prosseguir?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
        if (confirm) { this.doSave(true); }
    });
  }

  doSave(doPrint: boolean) {
    this.trainingScheduleService.updateScheduledTrainingAttendanceList(this.training.id, this.getAttendaceSelectedIdList()).subscribe(response => {
      this.doUpdateTrainingTotalParticipantReal();
      this.dialogRef.close({ doPrint: doPrint });
    });
  }

  doUpdateTrainingTotalParticipantReal() {
    this.training.totalParticipantReal = this.getAttendaceSelectedList().length;
  }

  toggleAttendanceSelection(attendance: ScheduledTrainingAttendance) {
    this.attendanceMap.set(attendance, ! this.attendanceMap.get(attendance));
  }

  toggleAttendanceSelectionDisabled(): boolean {
    return this.training.attendanceListAt !== undefined && this.training.attendanceListAt !== null;
  }

  getAttendaceSelectedIdList(): number[] {
    const attendaceSelectedIdList = [];
    for (const attendance of this.getAttendaceSelectedList()) {
      attendaceSelectedIdList.push(attendance.id);
    }
    return attendaceSelectedIdList;
  }

  getAttendaceSelectedList(): ScheduledTrainingAttendance[] {
    const attendaceSelectedList = [];
    for (const attendance of this.attendanceList) {
      if (this.attendanceMap.get(attendance)) {
        attendaceSelectedList.push(attendance);
      }
    }
    return attendaceSelectedList;
  }

  doCompanyWorkersOrderByName() {
    this.attendanceList = this.attendanceList.sort(function (a, b) {
        return a.worker.name.localeCompare(b.worker.name);
    });
    this.doFilterAttendaceList(this.filter.nativeElement.value);
  }

  doClearFilterAttendaceList() {
    this.filter.nativeElement.value = '';
    this.doFilterAttendaceList(this.filter.nativeElement.value);
  }

  doFilterAttendaceList(filterValue: string) {
    if (! filterValue || filterValue === '') {
      this.attendanceFilteredList = this.attendanceList;
    } else {
      this.attendanceFilteredList = this.attendanceList.filter(attendance =>
        attendance.worker.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
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
