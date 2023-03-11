import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { TrainingScheduleService } from '../../../../../shared/services/training-schedule.service';
import { TrainingScheduleDetails } from '../../../../../shared/models/training-schedule-details.model';
import * as Moment from 'moment';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import { TrainingScheduleConstruction } from '../../../../../shared/models/training-schedule-construction.model';
import { TrainingScheduleAttendanceListUploadDialogComponent } from '../../activities/trainings/training-schedule-attendance-list-upload-dialog/training-schedule-attendance-list-upload-dialog.component';

@Component({
  selector: 'scheduled-training-details',
  templateUrl: './scheduled-training-details.component.html',
  styleUrls: ['./scheduled-training-details.component.scss']
})
export class ScheduledTrainingDetailsComponent implements OnInit {
  @ViewChild('workersVirtualScroll') workersVirtualScroll: VirtualScrollComponent;
  workersVirtualScrollItems = [];

  scheduledTrainingDetails: TrainingScheduleDetails;
  trainingTitle: string;
  scheduledDate: string;
  scheduledEndDate: string;
  scheduledTime: string;
  scheduledPlace: string;
  exhibitionType: string;
  ministersNames: string[];
  workers = [];
  ministersCount: number;
  dateFormat = 'DD/MM/YYYY';
  timeFormat = 'HH:mm';

  constructor(
    public dialogRef: MdDialogRef<ScheduledTrainingDetailsComponent>,
    public scheduledTrainingService: TrainingScheduleService,
    public dialog: MdDialog,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.scheduledTrainingService.getScheduledTrainingDetails(this.data.id).subscribe(
      (trainingDetails: TrainingScheduleDetails[]) => {
        for (const scheduledTrainingDetails of trainingDetails) {
          this.scheduledTrainingDetails = scheduledTrainingDetails;
        }
        this.scheduledTrainingDetails.workers.forEach((cbo, name) => {
          this.workers.push({name: name, cbo: cbo});
        });
        this.orderWorkersByName();
        this.workersVirtualScrollItems = this.workers;
        this.trainingTitle = this.scheduledTrainingDetails.trainingTitle;
        this.scheduledDate = Moment(this.scheduledTrainingDetails.scheduledDate).format(this.dateFormat);
        this.scheduledEndDate = Moment(this.scheduledTrainingDetails.scheduledEndDate).format(this.dateFormat);
        this.scheduledTime = Moment(this.scheduledTrainingDetails.scheduledTime).format(this.timeFormat);
        this.scheduledPlace = this.scheduledTrainingDetails.scheduledPlace;
        this.exhibitionType = this.scheduledTrainingDetails.exhibitionType;
        this.ministersCount = this.scheduledTrainingDetails.ministersNames.length;
        this.ministersNames = this.scheduledTrainingDetails.ministersNames;
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  orderWorkersByName() {
    this.workers = this.workers.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  openTrainingScheduleAttendanceListUploadDialogComponent () {
    let   dialogConfig = {
        data: {
          trainingScheduleConstruction:this.data.scheduledTraining
        }
    };
    const dialogRef = this.dialog.open(TrainingScheduleAttendanceListUploadDialogComponent, dialogConfig);
  
  }

}
