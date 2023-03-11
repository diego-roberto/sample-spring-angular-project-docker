import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/shared/guards';
import { CompaniesComponent } from 'app/views/company/company/companies.component';
import { CompanyComponent } from 'app/shared/components/company/company.component';

const COMPANY_ROUTER: Routes = [
    {
        path: '', component: CompanyComponent,
        canActivateChild: [AuthGuard],
        children: [
            { path: '', component: CompaniesComponent }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(COMPANY_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class CompanyRoutingModule { }
