import { AuthGuard } from 'app/shared/guards';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConstructionFormSmartComponent } from 'app/views/constructions/form/construction-form.component';
import { ConstructionResolver } from 'app/resolves/construction.resolver';
import { EnumPermission } from '../../../shared/models/permission/enum-permission';

const CONSTRUCTION_FORM_ROUTING: Routes = [
    {
        path: '',
        data: { breadcrumb: 'Cadastro de Obra' },
        canActivateChild: [AuthGuard],
        component: ConstructionFormSmartComponent,
        resolve: { construction: ConstructionResolver }
    },
    {
        path: ':id',
        data: {
             breadcrumb: 'Editar Obra' ,
             paramCurrentConstruction:'id',
             expectedPermissions: [
                 EnumPermission.CONSTRUCTION_EDIT_CONSTRUCTION,
                 EnumPermission.COMPANY_CONSTRUCTIONS_SETUP_MODULES
            ]
    
        },
        canActivate : [AuthGuard],
        component: ConstructionFormSmartComponent,
        resolve: { construction: ConstructionResolver }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(CONSTRUCTION_FORM_ROUTING)
    ],
    exports: [
        RouterModule
    ]
})
export class ConstructionFormRoutingModule { }
