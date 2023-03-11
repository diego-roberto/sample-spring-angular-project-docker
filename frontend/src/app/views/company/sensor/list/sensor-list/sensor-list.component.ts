import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog } from '@angular/material';
import { SensorAddComponent } from '../../sensor-add/sensor-add.component';
import { SensorCompanyService } from '../../../../../shared/services/sensorcompany.service';
import { Sensor } from '../../../../../shared/models/sensor.model';
import * as _c from 'lodash/collection';

@Component({
  templateUrl: 'sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})

export class SensorListComponent implements OnInit {

  public sensorsCompany: Sensor[];
  public sensorsCompanyFiltered: Sensor[];
  public textFilter = '';

  public fixed = false;
  public spin = true;
  public direction = 'up';
  public animationMode = 'fling';
  public status: string;
  public activeFilter: boolean;
  public inactiveFilter: boolean;
  public waiting: boolean;
  public showFabButton: boolean = false;
  public searchValue: string = '';

  @ViewChild('bodyContent') bodyContent: ElementRef;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private _dialog: MdDialog,
    private sensorcompanyService: SensorCompanyService) {
    this.status = 'loading';
    this.activeFilter = true;
    this.inactiveFilter = false;
    this.waiting = true;

  }

  ngOnInit() {
    this.waiting = true;
    this.sensorsCompany = [];
    this.reloadList();
    this.setShowFabButton();
  }

  setShowFabButton() {
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        this.showFabButton = true;
      }
    }, 200);
  }

  reloadList(): void {
    this.sensorcompanyService.getSensorCompanyList().subscribe((sensors) => {
      this.sensorsCompany = sensors;
      this.sensorsCompanyFiltered = sensors;
      this.status = 'active';
    }, (error) => {
      console.log(error);
    });
    this.waiting = false;
  }

  redirectTo(path) {
    this.router.navigate([path], { relativeTo: this.route });
  }

  onSearchValueChange(text: string) {
    this.searchValue = text;
  }

  filterByText() {
    this.sensorsCompanyFiltered = this.sensorsCompany.filter(sensors => {
      return !((this.searchValue.length > 0) && (sensors.identification.toLowerCase().indexOf(this.searchValue.toLowerCase()) === -1)) ||
        !((this.searchValue.length > 0) && (this.checkType(sensors.type).toLowerCase().indexOf(this.searchValue.toLowerCase()) === -1));
    });
  }

  checkType(type) {
    if (type == 1) {
      return "Guarda Corpo Inteligente (Remoto)"
    } else if (type == 2) {
      return "Guarda Corpo Inteligente (Gateway)"
    } else {
      return ""
    }

  }

  getParentScroll() {
    return this.bodyContent.nativeElement;
  }

  openDialogCadastro() {
    const dialogRef = this._dialog.open(SensorAddComponent);
    dialogRef.afterClosed().subscribe(sensor => {
      this.reloadList();
    });
  }

}
