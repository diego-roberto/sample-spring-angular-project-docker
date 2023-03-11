import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { TrainingListComponent } from 'app/views/training/list/list.component';
import { TrainingFormComponent } from 'app/views/training/form/form.component';

const TRAINING_ROUTER: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        canActivateChild: [AuthGuard],
        data: { breadcrumb: 'Capacitações' },
        component: TrainingListComponent
    },
    {
        path: 'page/:page/exclude/:categories',
        pathMatch: 'prefix',
        canActivateChild: [AuthGuard],
        data: { breadcrumb: 'Capacitações' },
        component: TrainingListComponent
    },
    {
        path: 'new',
        canActivateChild: [AuthGuard],
        data: { breadcrumb: 'Cadastro de Capacitações' },
        component: TrainingFormComponent
    }
    // { path: ':id/edit', data: { breadcrumb: 'Cadastro de Capacitações' }, component: TrainingFormComponent}
];
@NgModule({
    imports: [
        RouterModule.forChild(TRAINING_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class TrainingRoutingModule { }
