import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { EnumPermission } from 'app/shared/models/permission/enum-permission';
import { DashboardComponent } from 'app/views/dashboard/dashboard.component';
import { StrategicFactorsDashboardComponent } from './strategic-factors-dashboard/strategic-factors-dashboard.component';
import { HumanFactorsDashboardComponent } from './human-factors-dashboard/human-factors-dashboard.component';


const DASHBOARD_ROUTER: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
       // canActivateChild: [AuthGuard],
        data: { breadcrumb: 'Dashboard' },
        component: DashboardComponent
    },
    {
        path: 'strategicFactors',
        pathMatch: 'prefix',
        data: { breadcrumb: 'Dashboard' },
        component: StrategicFactorsDashboardComponent
    },
    {
        path: 'strategicHumans',
        pathMatch: 'prefix',
        data: { breadcrumb: 'Dashboard' },
        component: HumanFactorsDashboardComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(DASHBOARD_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule { }
