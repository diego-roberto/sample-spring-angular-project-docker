import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { WorkersManagementComponent } from 'app/shared/components/workers-management/workers-management.component';
import { WorkerListComponent } from 'app/views/workers/workers/list/list.component';
import { BasicTopNavBarLayoutComponent } from 'app/shared/components/basic-topnavbar/basic-topnavbar.component';
import { WorkerFormComponent } from 'app/views/workers/workers/form/form.component';
import { WorkerResolver } from 'app/resolves/worker.resolver';
import { QualitiesResolver } from 'app/resolves/qualities.resolver';
import { UploadWorkersComponent } from './upload-workers/upload-workers.component';

const WORKERS_ROUTER: Routes = [
    {
        path: '', component: WorkersManagementComponent,
        canActivateChild: [AuthGuard],
        children: [
            { path: '', component: WorkerListComponent }
        ]
    },
    {
        path: 'new', component: BasicTopNavBarLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '', data: { breadcrumb: 'Cadastro de Trabalhadores' }, component: WorkerFormComponent, resolve: { worker: WorkerResolver, qualities: QualitiesResolver }
            }
        ]
    },
    {
        path: 'upload', component: BasicTopNavBarLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '', data: { breadcrumb: 'Importar Trabalhadores' }, component: UploadWorkersComponent
            }
        ]
    },
    {
        path: ':workerId/edit', component: BasicTopNavBarLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '', data: { breadcrumb: 'Editar Trabalhador' }, component: WorkerFormComponent, resolve: { worker: WorkerResolver, qualities: QualitiesResolver }
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(WORKERS_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class WorkersRoutingModule { }
