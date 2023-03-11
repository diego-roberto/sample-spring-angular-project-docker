import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompanyRoutingModule } from 'app/views/company/company/companies.routing.module';
import { CompaniesComponent } from 'app/views/company/company/companies.component';
import { AddInformationComponent } from 'app/views/company/company/additional-information/additional-information.component';
import { CompanyDetailsComponent } from 'app/views/company/company/company-details/company-details.component';
import { ResponsableDataComponent } from 'app/views/company/company/responsable-data/responsable-data.component';
import { CompanyDocumentationComponent } from './company-documentation/company-documentation.component';
import { CompanyDocumentationItemComponent } from './company-documentation/company-documentation-item/company-documentation-item.component';
import { CompanyReportDialogComponent } from './company-report-dialog/company-report-dialog.component';


@NgModule({
    imports: [
        SharedModule,
        CompanyRoutingModule,

    ],
    declarations: [
        CompaniesComponent,
        AddInformationComponent,
        CompanyDetailsComponent,
        ResponsableDataComponent,
        CompanyDocumentationComponent,
        CompanyDocumentationItemComponent,
        CompanyReportDialogComponent
    ],
    //teste
    entryComponents: [
        AddInformationComponent,
        CompanyDetailsComponent,
        ResponsableDataComponent,
        CompanyReportDialogComponent
    ]
})
export class CompanyModule { }
