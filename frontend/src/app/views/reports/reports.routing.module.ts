import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { ReportsOverviewComponent } from './reports-overview/reports-overview.component';

const CONFIG_ROUTES: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Relatórios Gerenciais' },
    component: ReportsOverviewComponent
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

export class ReportsRoutingModule { }
