import { NgModule } from '@angular/core';
import { SettingsModuleComponent } from './settings-module/settings-module.component';

import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { SettingsModuleProfilesComponent } from './settings-module/components/settings-module-profiles/settings-module-profiles.component';
import { SettingsOveriviewComponent } from './settings-overiview/settings-overiview.component';
import { SettingsModuleProfilePermissionsComponent } from './settings-module/components/settings-module-profile-permissions/settings-module-profile-permissions.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { ConnectionsComponent } from './connections/connections.component';
import { SettingsDegreeComponent } from './settings-degree/settings-degree.component';
import { SettingsFilesComponent } from './settings-files/settings-files.component';
import { SettingsManualsComponent } from './settings-manuals/settings-manuals.component';
import { SettingsOptionComponent } from './settings-option/settings-option.component';
import { SettingsQualitiesComponent } from './settings-qualities/settings-qualities.component';
import { SettingsAsoComponent } from './settings-asos/settings-asos.component';

const CONFIG_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Configurações' },
    component: SettingsOveriviewComponent
  },
  /*  {
        path: 'new',
        canActivateChild: [AuthGuard],
        data: {
            breadcrumb: 'Cadastro de Fornecedor',
            expectedPermissions: [
                EnumPermission.COMPANY_SUPPLIERS_CREATE,
            ]
        },
        component: SupplierFormComponent
    },*/
  {
    path: 'profile',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Permissões dos Perfis ' },
    component: SettingsModuleProfilesComponent
  },
  {
    path: 'profile/:id/edit',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Permissões dos Perfis dos módulos' },
    component: SettingsModuleProfilePermissionsComponent
  },
  {
    path: 'module',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: ' Módulos' },
    component: SettingsModuleComponent
  },
  {
    path: 'create-company',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: ' Cadastrar Empresa' },
    component: CreateCompanyComponent
  },
  {
    path: 'connections',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: ' Configure a integração' },
    component: ConnectionsComponent
  },
  {
    path: 'degree',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Escolaridades' },
    component: SettingsDegreeComponent
  },
  {
    path: 'files',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Arquivos do Sistema' },
    component: SettingsFilesComponent
  },
  {
    path: 'manuals',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Manuais do Sistema' },
    component: SettingsManualsComponent
  },
  {
    path: 'option',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Opções de Sistema' },
    component: SettingsOptionComponent
  },
  {
    path: 'qualities',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Habilitações' },
    component: SettingsQualitiesComponent
  },
  {
    path: 'aso',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'ASO' },
    component: SettingsAsoComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(CONFIG_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule { }
