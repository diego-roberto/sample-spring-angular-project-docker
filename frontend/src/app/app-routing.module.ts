import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { BasicComponent } from 'app/shared/components/basic/basic.component';
import { BasicTopNavBarLayoutComponent } from 'app/shared/components/basic-topnavbar/basic-topnavbar.component';
import { BlankComponent } from 'app/shared/components/blank/blank.component';
import { WorkersManagementComponent } from 'app/shared/components/workers-management/workers-management.component';
import { CompanyComponent } from 'app/shared/components/company/company.component';
import { TaskListResolver } from './resolves/task.list.resolver';
import { SupplierListResolver } from './resolves/supplier-list.resolver';
import { SupplierResolver } from './resolves/supplier.resolver';
import { WorkerListResolver } from './resolves/worker-list.resolver';
import { CaEpiListResolver } from './resolves/ca-epi-list.resolver';
import { ConstructionsListResolver } from './resolves/construction-list.resolver';
import { WorkerResolver } from './resolves/worker.resolver';
import { WorkerWearableListResolver } from './resolves/worker-wearable-list.resolver';
import { QualitiesResolver } from './resolves/qualities.resolver';
import { ChecklistResolver } from './resolves/checklist.list.resolver';
import { ChecklistItemResolver } from './resolves/checklist.item.resolver';
import { EnumPermission } from './shared/models/permission/enum-permission';
import { ConstructionDetailsResolver } from './resolves/construction-details-resolver';
import { DashboardHeaderComponent } from './views/dashboard/dashboard-header/dashboard-header.component';
import { environment } from 'environments/environment';
import { EnumEnvProfile } from 'environments/EnumEnvProfile';

//Permissão apenas para INATIVAR EM PRODUÇÃO. Quando for implementada a função de sensor, voltar o arquivo como estava antes.
let sensorPermissionCompany = EnumPermission.COMPANY_COMPANY_CREATE;
let sensorPermissionWereable = EnumPermission.COMPANY_WORKERS_WEARABLE_LIST;
if (environment.profile == EnumEnvProfile.PROD){
    sensorPermissionCompany = EnumPermission.INACTIVATE;
    sensorPermissionWereable = EnumPermission.INACTIVATE;
}

const routes: Routes = [
  // Main redirect
  { path: '', redirectTo: 'constructions', pathMatch: 'full', canActivate: [AuthGuard] },
  // App views
  {
    path: '',
    component: BasicComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'constructions',
        data: {
          expectedPermissions: [EnumPermission.CONSTRUCTION_LIST_CONSTRUCTIONS]
        },
        loadChildren: 'app/views/constructions/constructions.module#ConstructionsModule'
      },
      {
        path: 'company/users', component: CompanyComponent,
        data: {
          expectedPermissions: [

            EnumPermission.COMPANY_USER_CREATE,
            EnumPermission.COMPANY_USER_EDIT,
            EnumPermission.COMPANY_USER_CHANGE_STATUS,
            EnumPermission.COMPANY_USER_LIST,
          ]
        },
        loadChildren: 'app/views/company/user/user.module#UsersModule'
      },
      {
        path: 'company/sensor', component: CompanyComponent,
        data: {
          expectedPermissions: [
            sensorPermissionCompany,
          ]
        },
        loadChildren: 'app/views/company/sensor/sensor.module#SensorModule'
      },
      {
        path: 'company',
        data: {
          expectedPermissions: [
            EnumPermission.COMPANY_COMPANY_CREATE,
            EnumPermission.COMPANY_COMPANY_EDIT,
          ]
        },
        loadChildren: 'app/views/company/company/companies.module#CompanyModule'
      },
      {
        path: 'workers',
        data: {
          expectedPermissions: [
            EnumPermission.COMPANY_WORKERS_LIST,
          ]
        },
        loadChildren: 'app/views/workers/workers/workers.module#WorkersModule'
      },
      {
        path: 'workers/epi', component: WorkersManagementComponent,
        data: {
          expectedPermissions: [
            EnumPermission.COMPANY_WORKERS_EPI_LIST,
          ]
        },
        loadChildren: 'app/views/workers/epi/epi.module#EpiModule'
      },
      {
        path: 'workers/wearable', component: WorkersManagementComponent,
        data: {
          expectedPermissions: [
              sensorPermissionWereable,
          ]
        },
        loadChildren: 'app/views/workers/wearable/wearable.module#WearableModule'
      },
      {
        path: 'suppliers', component: BasicTopNavBarLayoutComponent,
        data: {
          expectedPermissions: [
            EnumPermission.COMPANY_SUPPLIERS_LIST,
          ]
        },
        loadChildren: 'app/views/suppliers/suppliers.module#SuppliersModule'
      },
      {
        path: 'training', component: BasicTopNavBarLayoutComponent,
        data: {
          expectedPermissions: [
            EnumPermission.COMPANY_TRAINING_LIST,
          ]
        },
        loadChildren: 'app/views/training/training.module#TrainingModule'
      },
      {
        path: 'dashboard', component: DashboardHeaderComponent,
        loadChildren: 'app/views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'settings', component: BasicTopNavBarLayoutComponent,
        data: {
          expectedPermissions: [
            EnumPermission.COMPANY_SETTINGS,
          ]
        },
        loadChildren: 'app/views/settings/settings.module#SettingsModule'
      },
      {
        path: 'reports', component: BasicTopNavBarLayoutComponent,
        loadChildren: 'app/views/reports/reports.module#ReportsModule'
      },
    ]
  },
  {
    path: '',
    component: BlankComponent,
    loadChildren: 'app/views/auth/auth.module#AuthModule'
  },
  {
    path: 'totem/construction/:id',
    resolve: { construction: ConstructionDetailsResolver },
    loadChildren: 'app/views/totem/totem.module#TotemModule',
  },

  // Handle all other routes
  { path: '**', redirectTo: 'constructions', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    SupplierListResolver,
    SupplierResolver,
    WorkerListResolver,
    WorkerResolver,
    QualitiesResolver,
    ConstructionsListResolver,
    TaskListResolver,
    CaEpiListResolver,
    WorkerWearableListResolver,
    ChecklistResolver,
    ChecklistItemResolver
  ]
})
export class AppRoutingModule { }
