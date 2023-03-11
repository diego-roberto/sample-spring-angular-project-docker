import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'title-training-schedule-dialog',
  templateUrl: './title-training-schedule-dialog.component.html',
  styleUrls: ['./title-training-schedule-dialog.component.scss']
})
export class TitleTrainingScheduleDialogComponent implements OnInit {

  @Input() totalSteps = 0;
  @Input() title: string;
  @Input() step: number;

  constructor() { }

  ngOnInit() { }

  getTitle(): string {
    switch (this.step) {
      case 1:
        return 'Selecione a capacitação';
      case 2:
        return 'Selecione a data e trabalhadores ';
      default:
        return '';
    }
  }

}
