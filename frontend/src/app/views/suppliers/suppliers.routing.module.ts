import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { EnumPermission } from 'app/shared/models/permission/enum-permission';
import { SupplierListComponent } from 'app/views/suppliers/list/list.component';
import { SupplierFormComponent } from 'app/views/suppliers/form/form.component';

const SUPPLIER_ROUTER: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        canActivateChild: [AuthGuard],
        data: { breadcrumb: 'Gerenciamento de Fornecedores' },
        component: SupplierListComponent
    },
    {
        path: 'new',
        canActivateChild: [AuthGuard],
        data: {
            breadcrumb: 'Cadastro de Fornecedor',
            expectedPermissions: [
                EnumPermission.COMPANY_SUPPLIERS_CREATE,
            ]
        },
        component: SupplierFormComponent
    },
    {
        path: ':id/edit',
        canActivateChild: [AuthGuard],
        data: { breadcrumb: 'Alteração de Fornecedor' },
        component: SupplierFormComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(SUPPLIER_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class SuppliersRoutingModule { }
