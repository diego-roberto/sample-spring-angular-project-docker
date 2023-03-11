import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { MarkerRemoved, ConeUpdated, ConeUpdateRequest } from 'app/views/constructions/detail/monitoring/_common/sector-instance-manager/events/sectors-events-types';
import { Cone } from 'app/shared/models/cone.model';
import { Sector } from 'app/shared/models/sector.model';
import { Construction } from 'app/shared/models/construction.model';
import { Floor } from 'app/shared/models/floor.model';
import { Risk } from 'app/shared/models/risk.model';
import { ConesWorkers } from 'app/shared/models/cones-workers.model';
import { ConesAlert } from 'app/shared/models/cones-alert.model';
import { MarkerService } from 'app/shared/services/marker.service';
import { RiskService } from 'app/shared/services/risks.service';
import { ConesWorkersService } from 'app/shared/services/cones-workers.service';
import { ConesAlertService } from 'app/shared/services/cones-alert.service';
import { ConeService } from 'app/shared/services/cone.service';
import { FloorService } from 'app/shared/services/floor.service';
import { MappingDialogComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/mapping-dialog/mapping-dialog.component';
import { MappingDialogGuardComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/mapping-dialog-guard/mapping-dialog-guard.component';
import { MappingResultAlertsComponent } from 'app/views/constructions/detail/monitoring/cone-management-list/mapping-result-alerts/mapping-result-alerts.component';


@Component({
  selector: 'cone-management-line-detail',
  templateUrl: './cone-management-line-detail.component.html',
  styleUrls: ['./cone-management-line-detail.component.scss']
})
export class ConeManagementLineDetailComponent implements OnInit {
  @Input() cone: Cone;
  @Input() sector: Sector;
  @Input() construction: Construction;
  @Input() floor: Floor;
  @Output() removed: EventEmitter<MarkerRemoved> = new EventEmitter();
  @Output() edited: EventEmitter<ConeUpdateRequest> = new EventEmitter();

  dialogConfig = {
    data: {
      cone: new Cone(),
      update: false,
      view: false,
      risks: new Array<Risk>(),
      coneWorkers: new Array<ConesWorkers>(),
      floor: new Floor(),
      construction: new Construction()
    }
  };

  today = new Date();
  isToday = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public confirmDialogHandler: ConfirmDialogHandler,
    public markerService: MarkerService,
    public riskService: RiskService,
    public conesWorkersService: ConesWorkersService,
    public conesAlertService: ConesAlertService,
    public coneService: ConeService,
    public floorService: FloorService
  ) { }

  ngOnInit() {
    if (this.cone) {

      this.isToday =
        new Date(this.cone.dtLastSync).getDay() === this.today.getDay() &&
        new Date(this.cone.dtLastSync).getMonth() === this.today.getMonth() &&
        new Date(this.cone.dtLastSync).getFullYear() === this.today.getFullYear();

      this.cone.dtLastSync = new Date(this.cone.dtLastSync);
    }
  }

  activeCone() {
    this.cone.active = !this.cone.active;
    this.edited.emit({
      markerLocation: {
        sectorId: this.sector.id,
        floorId: this.floor.id,
        markerId: this.cone.marker.id
      },
      cone: this.cone,
      justActivating: true
    });
  }
  toResultAlerts(edit: boolean) {
    if (this.cone.risks.length == 0) {
      const dialogRef = this.dialog.open(MappingResultAlertsComponent);
      dialogRef.componentInstance.setCone(this.fillRisksAndWorkers(this.cone), !edit);
      dialogRef.afterClosed().subscribe(cone => {
        if (cone) {
          this.edited.emit({
            markerLocation: {
              sectorId: this.sector.id,
              floorId: this.floor.id,
              markerId: this.cone.marker.id
            },
            cone: this.cone,
            justActivating: false
          });
        }
      });


    }
  }

  toEditCone(edit: boolean) {
    if (this.cone.risks.length == 0) {
      const dialogRef = this.dialog.open(MappingDialogGuardComponent);
      dialogRef.componentInstance.setCone(this.cone, !edit);
      dialogRef.afterClosed().subscribe(cone => {
        if (cone) {
          this.edited.emit({
            markerLocation: {
              sectorId: this.sector.id,
              floorId: this.floor.id,
              markerId: this.cone.marker.id
            },
            cone: this.cone,
            justActivating: false
          });
        }
      });


    } else {
      const dialogRef = this.dialog.open(MappingDialogComponent);
      dialogRef.componentInstance.setCone(this.fillRisksAndWorkers(this.cone), !edit);
      dialogRef.afterClosed().subscribe(cone => {
        if (cone) {
          this.edited.emit({
            markerLocation: {
              sectorId: this.sector.id,
              floorId: this.floor.id,
              markerId: this.cone.marker.id
            },
            cone: this.cone,
            justActivating: false
          });
        }
      });
    }
  }

  deleteCone() {
    const dialogRef = this.confirmDialogHandler.call('excluir', 'Deseja remover esse registro?').subscribe((confirm) => {
      if (confirm) {
        this.removed.emit({ markerLocation: { sectorId: this.sector.id, floorId: this.floor.id, markerId: this.cone.marker.id } });
      }
    });
  }

  private fillRisksAndWorkers(cone: Cone): Observable<Cone> {
    return new Observable<Cone>(observer => {
      Observable.forkJoin(
        this.riskService.getRiskListCone(this.cone.id),
        this.conesWorkersService.getConesWorkersListCone(this.cone.id),
        this.conesAlertService.getConesAlertListCone(this.cone.id),
      ).subscribe(
        (result: [Risk[], ConesWorkers[], ConesAlert[]]) => {
          cone.risks = result[0];
          cone.workers = result[1];
          cone.alerts = result[2];
          observer.next(cone);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  private handleError(error) {
    if (error.json() && error.json().errors && error.json().errors.length > 0) {
      this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
    } else {
      this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
    }
  }
}
