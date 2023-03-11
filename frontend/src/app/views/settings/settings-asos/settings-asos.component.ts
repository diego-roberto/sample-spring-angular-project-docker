import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../shared/services/permission.service';
import { SettingsAsoDialogComponent } from './components/settings-asos-dialog/settings-asos-dialog.component';
import { MdDialog } from '@angular/material';
import { UserProfileService } from '../../../shared/services/user-profile.service';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { AsoService } from 'app/shared/services/aso.service';
import { AsoType } from 'app/shared/models/aso.model';

@Component({
  selector: 'settings-asos',
  templateUrl: './settings-asos.component.html',
  styleUrls: ['./settings-asos.component.scss']
})
export class SettingsAsoComponent implements OnInit {
  asos: AsoType[];
  loading: boolean = false;

  constructor(
    public userProfileService: UserProfileService,
    public permissionService: PermissionService,
    public asoService: AsoService,
    private confirmDialogHandler: ConfirmDialogHandler,
    private dialog: MdDialog,
    private appMessage: AppMessageService,
  ) { }

  ngOnInit() {
    this.loadAsos();
  }

  loadAsos() {
    this.asoService.getAsoTypesList().subscribe(response => {
      this.asos = response;
    })
  }

  openAsoDialog(aso: AsoType) {
    let dialogConfig = {
      data: {
        aso: aso,
      }
    };

    const dialogRef = this.dialog.open(SettingsAsoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.loadAsos();
    });
  }

  openDeleteDialog(aso: AsoType) {
    this.confirmDialogHandler.call('excluir', 'Deseja realmente excluir essa ASO?').subscribe((confirm) => {
      if (confirm) {
        this.asoService.deleteAsoType(aso.name).subscribe(() => {
          this.appMessage.showSuccess('ASO excluída com sucesso!');
          this.loadAsos();
        }, (e)  => {
          const body = JSON.parse(e._body);
          this.appMessage.showError(body.message);
          this.loading = false;
        });
      }
    });
  }
}

