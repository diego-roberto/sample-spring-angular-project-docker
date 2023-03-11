import { NgModule } from '@angular/core';
import { SettingsModuleComponent } from './settings-module/settings-module.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsRoutingModule } from './settings.routing.module';
import { SettingsModuleProfilesComponent } from './settings-module/components/settings-module-profiles/settings-module-profiles.component';
import { SettingsModuleProfilesPemissionsDialogComponent } from './settings-module/components/settings-module-profiles-pemissions-dialog/settings-module-profiles-pemissions-dialog.component';
import { SettingsModuleDialogComponent } from './settings-module/components/settings-module-dialog/settings-module-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsModuleProfileDialogComponent } from './settings-module/components/settings-module-profile-dialog/settings-module-profile-dialog.component';
import { SettingsModuleProfileGlobalPermissionsComponent } from './settings-module/components/settings-module-profile-global-permissions/settings-module-profile-global-permissions.component';
import { SettingsOveriviewComponent } from './settings-overiview/settings-overiview.component';
import { SettingsModuleProfilePermissionsComponent } from './settings-module/components/settings-module-profile-permissions/settings-module-profile-permissions.component';
import { SettingsModuleProfileCreateDialogComponent } from './settings-module/components/settings-module-profile-create-dialog/settings-module-profile-create-dialog.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { ConnectionsComponent } from './connections/connections.component';
import { SettingsDegreeComponent } from './settings-degree/settings-degree.component';
import { SettingsDegreeDialogComponent } from './settings-degree/components/settings-degree-dialog/settings-degree-dialog.component';
import { SettingsFilesComponent } from './settings-files/settings-files.component';
import { SettingsFilesDialogComponent } from './settings-files/components/settings-files-dialog.component';
import { SettingsManualsComponent } from './settings-manuals/settings-manuals.component';
import { SettingsManualsDialogComponent } from './settings-manuals/components/settings-manuals-dialog.component';
import { FilesReplicateDialogComponent } from './settings-files/files-replicate/files-replicate-dialog.component';
import { ManualsReplicateDialogComponent } from './settings-manuals/manuals-replicate/manuals-replicate-dialog.component';
import { SettingsOptionComponent } from './settings-option/settings-option.component';
import { SettingsQualitiesComponent } from './settings-qualities/settings-qualities.component';
import { SettingsQualitiesDialogComponent } from './settings-qualities/components/settings-qualities-dialog/settings-qualities-dialog.component';
import { SettingsAsoComponent } from './settings-asos/settings-asos.component';
import { SettingsAsoDialogComponent } from './settings-asos/components/settings-asos-dialog/settings-asos-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    SettingsModuleComponent,
    SettingsModuleProfilesComponent,
    SettingsModuleProfilesPemissionsDialogComponent,
    SettingsModuleProfileGlobalPermissionsComponent,
    SettingsModuleDialogComponent,
    SettingsModuleProfileDialogComponent,
    SettingsOveriviewComponent,
    SettingsModuleProfilePermissionsComponent,
    SettingsModuleProfileCreateDialogComponent,
    CreateCompanyComponent,
    ConnectionsComponent,
    SettingsDegreeComponent,
    SettingsDegreeDialogComponent,
    SettingsFilesComponent,
    SettingsFilesDialogComponent,
    SettingsManualsComponent,
    SettingsManualsDialogComponent,
    FilesReplicateDialogComponent,
    ManualsReplicateDialogComponent,
    SettingsOptionComponent,
    SettingsQualitiesComponent,
    SettingsQualitiesDialogComponent,
    SettingsAsoComponent,
    SettingsAsoDialogComponent
  ]
  ,
  entryComponents: [
    SettingsModuleProfilesPemissionsDialogComponent,
    SettingsModuleDialogComponent,
    SettingsModuleProfileDialogComponent,
    SettingsDegreeDialogComponent,
    SettingsFilesDialogComponent,
    SettingsManualsDialogComponent,
    FilesReplicateDialogComponent,
    ManualsReplicateDialogComponent,
    SettingsQualitiesDialogComponent,
    SettingsAsoDialogComponent
  ]
})
export class SettingsModule { }
