import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../shared/services/permission.service';
import { SettingsModuleDialogComponent } from './components/settings-module-dialog/settings-module-dialog.component';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Module } from '../../../shared/models/module.model';
import { UserProfileService } from '../../../shared/services/user-profile.service';
import { SettingsModuleProfilesPemissionsDialogComponent } from './components/settings-module-profiles-pemissions-dialog/settings-module-profiles-pemissions-dialog.component';

@Component({
  selector: 'settings-module',
  templateUrl: './settings-module.component.html',
  styleUrls: ['./settings-module.component.scss']
})
export class SettingsModuleComponent implements OnInit {

  modulesList: Array<Module>;

  constructor(public permissionService: PermissionService, private dialog: MdDialog,
    private route: ActivatedRoute,
    public userProfileService: UserProfileService
  ) { }

  ngOnInit() {

    this.loadModules();
  }

  loadModules() {
    this.modulesList = [];
    this.permissionService.getAllModules().subscribe(response => {
      this.modulesList = response;

    })
  }

  openModuleDialog(module: Module) {
    let dialogConfig = {
      data: {
        module: module
      }
    };
    const dialogRef = this.dialog.open(SettingsModuleDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.loadModules();
    });
  }

  openPermissionsDialog(moduleId: number) {
    let dialogConfig = {
      data: {
        moduleId: moduleId
      }
    };
    const dialogRef = this.dialog.open(SettingsModuleProfilesPemissionsDialogComponent, dialogConfig);

  }

}
