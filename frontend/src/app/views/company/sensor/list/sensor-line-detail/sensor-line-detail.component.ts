import { forEach } from '@angular/router/src/utils/collection';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Sensor } from 'app/shared/models/sensor.model';
import { MdSnackBar, MdDialog } from '@angular/material';
import { SensorAddComponent } from '../../sensor-add/sensor-add.component';

@Component({
  selector: 'sensor-line-detail',
  templateUrl: './sensor-line-detail.component.html',
  styleUrls: ['./sensor-line-detail.component.scss']
})
export class SensorLineDetailComponent implements OnInit {
  @Input() sensor: Sensor;
  @Output() saved: EventEmitter<any> = new EventEmitter();

  constructor(private snackBar: MdSnackBar,
    private _dialog: MdDialog) { }

  ngOnInit() { }

  toEditSensor() {
    const dialogRef = this._dialog.open(SensorAddComponent);
    dialogRef.componentInstance.sensor = new Sensor().initializeWithJSON(this.sensor);
    dialogRef.componentInstance.mode = 'update';
    dialogRef.afterClosed().subscribe(sensor => {
      this.saved.emit();
    });
    
  }

  
  checkType(type){
    if (type==1){
      return "Guarda Corpo Inteligente (Remoto)"
    } else if(type==2){
      return "Guarda Corpo Inteligente (Gateway)"
    }
  }

  private handleError(error) {
    if (error.json() && error.json().errors && error.json().errors.length > 0) {
      this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
    } else {
      this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
    }
  }

}
