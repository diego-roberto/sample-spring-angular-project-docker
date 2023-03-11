import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../shared/services/permission.service';
import { MdDialog } from '@angular/material';
import { ManualsReplicateDialogComponent } from './manuals-replicate/manuals-replicate-dialog.component';
import { FileInfo } from 'app/shared/models/file-info.model';
import { FilesService } from 'app/shared/services/files.service';
import * as FileSaver from 'file-saver';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { EnumPermission } from 'app/shared/models/permission/enum-permission';
import { SettingsManualsDialogComponent } from './components/settings-manuals-dialog.component';
import { ConfirmDialogHandler } from '../../../shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { UserProfileService } from 'app/shared/services/user-profile.service';

@Component({
  selector: 'settings-manuals',
  templateUrl: './settings-manuals.component.html',
  styleUrls: ['./settings-manuals.component.scss']
})
export class SettingsManualsComponent implements OnInit {

  manualsList: Array<FileInfo>;

  constructor(public permissionService: PermissionService,
    public filesService: FilesService,
    private dialog: MdDialog,
    private appMessage: AppMessageService,
    public confirmDialogHandler: ConfirmDialogHandler,
    public userProfileService: UserProfileService
  ) { }

  ngOnInit() {
    this.loadManuals();
  }

  loadManuals() {
    this.filesService.getFilesAndReplicatedFilesByFunctionality('manual').subscribe(response => {
      this.manualsList = response;
    });
  }

  openManualsDialog() {
    const dialogRef = this.dialog.open(SettingsManualsDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.loadManuals();
    });
  }

  downloadManual(manual: FileInfo) {
    this.filesService.downloadFile(manual.id).subscribe((manualResult: File) => {
      FileSaver.saveAs(manualResult);
    },
      error => {
        this.appMessage.showError('Erro no download do manual!');
      });
  }

  deleteManual(manual: FileInfo) {
    this.confirmDialogHandler.call('excluir', 'Deseja realmente excluir o Manual?').subscribe((confirm) => {
      if (confirm) {
        this.filesService.deleteFile(manual.id).subscribe(response => {
          if (response.ok) {
            this.loadManuals();
            this.appMessage.showSuccess('Manual removido com sucesso');
          } else {
            this.appMessage.showError('Erro ao remover manual');
          }
        }, error => {
          this.appMessage.showError(JSON.parse(error._body).errors[0].message);
        });
      }
    });
  }

  hasPermissionAddRemoveManuals() {
    return this.permissionService.hasPermission(EnumPermission.SETTINGS_ADD_REMOVE_MANUALS);
  }


  hasPermissionToReplicateFiles() {
    return this.permissionService.hasPermission(EnumPermission.SETTINGS_REPLICATE_MANUALS);
  }

  openReplicateDialog(manual: FileInfo) {
    const dialogRef = this.dialog.open(ManualsReplicateDialogComponent);
    dialogRef.componentInstance.fileId = manual.id;
    dialogRef.afterClosed().subscribe(() => { });
  }
}

