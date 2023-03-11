import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ScheduledTrainingDetailsComponent } from '../../scheduled-training-details/scheduled-training-details.component';
import { TrainingScheduleService } from '../../../../../../shared/services/training-schedule.service';

@Component({
    selector: 'list-cell',
    templateUrl: 'list-cell.component.html',
    styleUrls: ['./list-cell.component.scss']
})

export class ListCellComponent {
    @Input() text = '';
    @Input() time = '';
    @Input() icon = '';
    @Input() display = 'left';
    @Input() id = '';

    dialogConfig = {
        data: {
            id: null
        }
    };

    constructor(
        public dialog: MdDialog,
        public scheduledTrainingService: TrainingScheduleService) { }

    openTrainingDetails(id: number) {
        this.dialogConfig.data.id = id;
        const dialogRef = this.dialog.open(ScheduledTrainingDetailsComponent, this.dialogConfig);
    }
}
