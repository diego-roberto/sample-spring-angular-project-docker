import { AuthGuard } from 'app/shared/guards';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicTopNavBarLayoutComponent } from 'app/shared/components/basic-topnavbar/basic-topnavbar.component';
import { ConstructionsListComponent } from 'app/views/constructions/list/constructions-list.component';
import { ConstructionFormSmartComponent } from 'app/views/constructions/form/construction-form.component';
import { ConstructionResolver } from 'app/resolves/construction.resolver';
import { ConstructionDetailComponent } from 'app/views/constructions/detail/construction-detail.component';
import { OverviewComponent } from 'app/views/constructions/detail/overview/overview.component';
import { MonitoringComponent } from 'app/views/constructions/detail/monitoring/monitoring.component';
import { EmotionalPanelComponent } from 'app/views/constructions/detail/emotional/emotional-panel/emotional-panel.component';

import { ReportsComponent } from 'app/views/constructions/detail/reports/reports.component';
import { RepositoriesComponent } from 'app/views/constructions/detail/repositories/repositories.component';
import { EnumPermission } from '../../shared/models/permission/enum-permission';
import { ConstructionDetailsResolver } from '../../resolves/construction-details-resolver';


const CONSTRUCTIONS_ROUTING: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        canActivateChild: [AuthGuard],
        component: BasicTopNavBarLayoutComponent,
        children: [
            {
                path: '',
                canActivateChild: [AuthGuard],
                data: { breadcrumb: 'Minhas Obras',
                        expectedPermissions: [EnumPermission.CONSTRUCTION_LIST_CONSTRUCTIONS]
               },
                component: ConstructionsListComponent
            }
        ]
    },
    {
        path: 'new',
        canActivateChild: [AuthGuard],
        component: BasicTopNavBarLayoutComponent,
        loadChildren: 'app/views/constructions/form/construction-form.module#ConstructionFormModule',
       
    },
    {
        path: 'edit',
        canActivate: [AuthGuard],
      
        component: BasicTopNavBarLayoutComponent,
        loadChildren: 'app/views/constructions/form/construction-form.module#ConstructionFormModule'
    },
    {
        path: ':id',
        canActivate: [AuthGuard],
        data: { 
           
            paramCurrentConstruction:'id',
            expectedPermissions: [
                EnumPermission.CONSTRUCTION_EDIT_CONSTRUCTION,
                EnumPermission.CONSTRUCTION_DETAILS_CONSTRUCTION
            ]
        
        },
        resolve: { construction: ConstructionDetailsResolver },
        loadChildren: 'app/views/constructions/detail/construction-detail.module#ConstructionDetailModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(CONSTRUCTIONS_ROUTING)
    ],
    exports: [
        RouterModule
    ]
})
export class ConstructionsRoutingModule { }
