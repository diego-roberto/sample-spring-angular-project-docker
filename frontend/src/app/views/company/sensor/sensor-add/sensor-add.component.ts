import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { Component, OnInit, Input } from '@angular/core';
import { SensorCompanyService } from '../../../../shared/services/sensorcompany.service';

import { Sensor } from '../../../../shared/models/sensor.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilValidators } from '../../../../shared/util/validators.util';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import { now } from 'moment';
import { Profile } from 'selenium-webdriver/firefox';
import { Observable } from 'rxjs';
import { MaskUtil } from 'app/shared/util/mask.util';

@Component({
  selector: 'sensor-add',
  templateUrl: './sensor-add.component.html',
  styleUrls: ['./sensor-add.component.scss']
})
export class SensorAddComponent implements OnInit {
  public userForm: FormGroup;
  public sensor: Sensor;
  public title = 'CADASTRO DE SENSOR';
  
  public mode: String = 'create';

  constructor(private sensorCompanyService: SensorCompanyService,
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<SensorAddComponent>,
    private snackBar: MdSnackBar,
    public confirmDialogHandler: ConfirmDialogHandler) {

    this.userForm = this.fb.group({
      identificacao: new FormControl('', [Validators.required]),
    });
    this.sensor = new Sensor();
  }

  ngOnInit() {
  }

  compareById(obj1, obj2) {
    return obj1.id === obj2.id;
  }

  public saveSensor(): void {
    
    if (this.mode === 'create') {
      this.save();
    } else if (this.mode === 'update') {
      this.update();
    }

    
  }
 
  public save() {
    
    this.sensorCompanyService.createSensorCompany(this.sensor)
    .subscribe(response => {
      this.dialogRef.close();
        this.snackBar.open('Sensor cadastrado com sucesso!', null, { duration: 4000 });
    }, (error) => {
      this.handleError(error, 'cadastrar');
    });
  }

  

  public update(): void {
    this.sensorCompanyService.updateSensorCompany(this.sensor)
    .subscribe(response => {
      this.dialogRef.close();
      this.snackBar.open('Sensor alterado com sucesso!', null, { duration: 4000 });
    }, (error) => {
      this.handleError(error, 'alterar');
    });
  }

  public handleError(error: any, action: String): void {
      this.snackBar.open('Não foi possível ' + action + ' o Sensor.', null, { duration: 4000 });
  }


  isValid(): boolean {
    return (this.userForm.valid || this.userForm.disabled);
  }

  get coneIdMask() {
        return MaskUtil.coneIdMask;
    }

}
