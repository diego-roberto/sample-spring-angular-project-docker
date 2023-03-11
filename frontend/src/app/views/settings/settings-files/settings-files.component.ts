import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../shared/services/permission.service';
import { MdDialog } from '@angular/material';

import { FileInfo } from 'app/shared/models/file-info.model';
import { FilesService } from 'app/shared/services/files.service';
import { SettingsFilesDialogComponent } from './components/settings-files-dialog.component';
import { FilesReplicateDialogComponent } from './files-replicate/files-replicate-dialog.component';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { ConfirmDialogHandler } from '../../../shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { EnumPermission } from 'app/shared/models/permission/enum-permission';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'settings-files',
  templateUrl: './settings-files.component.html',
  styleUrls: ['./settings-files.component.scss']
})
export class SettingsFilesComponent implements OnInit {

  filesList: Array<FileInfo>;

  constructor(public permissionService: PermissionService,
    public filesService: FilesService,
    private dialog: MdDialog,
    private appMessage: AppMessageService,
    public confirmDialogHandler: ConfirmDialogHandler
  ) { }

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.filesService.getFilesAndReplicatedFilesByFunctionality('file').subscribe(response => {
      this.filesList = response;
    });
  }

  openFilesDialog() {
    const dialogRef = this.dialog.open(SettingsFilesDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.loadFiles();
    });
  }

  downloadFile(file: FileInfo) {
    this.filesService.downloadFile(file.id).subscribe((fileResult: File) => {
      FileSaver.saveAs(fileResult);
    },
      error => {
        this.appMessage.showError('Erro no download do arquivo!');
      });
  }

  deleteFile(file: FileInfo) {
    this.confirmDialogHandler.call('excluir', 'Deseja realmente excluir o Arquivo?').subscribe((confirm) => {
      if (confirm) {
        this.filesService.deleteFile(file.id).subscribe(response => {
          if (response.ok) {
            this.loadFiles();
            this.appMessage.showSuccess('Arquivo removido com sucesso');
          } else {
            this.appMessage.showError('Erro ao remover arquivo');
          }
        }, error => {
          this.appMessage.showError(JSON.parse(error._body).errors[0].message);
        });
      }
    });
  }

  hasPermissionAddRemoveFiles() {
    return this.permissionService.hasPermission(EnumPermission.SETTINGS_ADD_REMOVE_FILES);
  }

  hasPermissionToReplicateFiles() {
    return this.permissionService.hasPermission(EnumPermission.SETTINGS_REPLICATE_FILES);
  }

  openReplicateDialog(file: FileInfo) {
    const dialogRef = this.dialog.open(FilesReplicateDialogComponent);
    dialogRef.componentInstance.fileId = file.id;
    dialogRef.afterClosed().subscribe(() => { });
  }

}

