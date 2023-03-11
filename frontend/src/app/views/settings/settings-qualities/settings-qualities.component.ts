import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../shared/services/permission.service';
import { QualitiesService } from '../../../shared/services/qualities.service';
import { SettingsQualitiesDialogComponent } from './components/settings-qualities-dialog/settings-qualities-dialog.component';
import { MdDialog } from '@angular/material';
import { Qualities } from '../../../shared/models/qualities.model';
import { UserProfileService } from '../../../shared/services/user-profile.service';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { AppMessageService } from 'app/shared/util/app-message.service';

@Component({
  selector: 'settings-qualities',
  templateUrl: './settings-qualities.component.html',
  styleUrls: ['./settings-qualities.component.scss']
})
export class SettingsQualitiesComponent implements OnInit {
  qualities: Qualities[];
  loading: boolean = false;

  constructor(
    public userProfileService: UserProfileService,
    public permissionService: PermissionService,
    public qualitiesService: QualitiesService,
    private confirmDialogHandler: ConfirmDialogHandler,
    private dialog: MdDialog,
    private appMessage: AppMessageService,
  ) { }

  ngOnInit() {
    this.loadQualities();
  }

  loadQualities() {
    this.qualitiesService.getQualitiesList().subscribe(response => {
      this.qualities = response;
    })
  }

  openQualityDialog(quality: Qualities) {
    let dialogConfig = {
      data: {
        quality: quality,
      }
    };

    const dialogRef = this.dialog.open(SettingsQualitiesDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.loadQualities();
    });
  }

  openDeleteDialog(quality: Qualities) {
    this.confirmDialogHandler.call('excluir', 'Deseja realmente excluir essa habilitação?').subscribe((confirm) => {
      if (confirm) {
        this.qualitiesService.deleteQuality(quality.name).subscribe(() => {
          this.appMessage.showSuccess('Habilitação excluída com sucesso!');
          this.loadQualities();
        }, (e)  => {
          const body = JSON.parse(e._body);
          this.appMessage.showError(body.message);
        });
      }
    });
  }
}

