import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'title-dialog-content',
  templateUrl: './title-dialog-content.component.html',
  styleUrls: ['./title-dialog-content.component.scss']
})
export class OccurrencesDialogTitleComponent implements OnInit {

  @Input() stepList = [];
  @Input() title: string;
  @Input() step: number;

  constructor() { }

  ngOnInit() { }

  getTitle(): string {
    switch (this.stepList[this.step]) {
      case 'data':
        return 'Detalhes da ocorrência';
      case 'workers':
        return 'Trabalhadores envolvidos';
      case 'attachments':
        return 'Imagens';
      default:
        return '';
    }
  }

}
