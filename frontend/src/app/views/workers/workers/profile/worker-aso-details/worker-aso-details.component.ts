import { Worker } from 'app/shared/models/worker.model';
import { Component, Input, OnInit } from '@angular/core';
import { Aso } from 'app/shared/models/aso.model';

@Component({
  selector: 'worker-aso-details',
  templateUrl: './worker-aso-details.component.html',
  styleUrls: ['./worker-aso-details.component.scss'],
})
export class AsoDetailsWorkerComponent implements OnInit {

  @Input() worker: Worker;

  bloodTypes = new Map([
    ['0', 'A+'],
    ['1', 'A-'],
    ['2', 'B+'],
    ['3', 'B-'],
    ['4', 'AB+'],
    ['5', 'AB-'],
    ['6', 'O+'],
    ['7', 'O-']
  ]);

  readonly asoTypes = [
    "Data periódico",
    "Data demissão",
    "Próximo exame",
    "Data periódico",
    "Data periódico",
  ];


  constructor(
  ) { }

  ngOnInit() {
  }

  getDateLabel(aso: Aso) {
    const { id } = aso.asoType

    if (id <= 5) {
      return this.asoTypes[id - 1];
    } else {
      return "Próximo exame";
    }
  }
}

