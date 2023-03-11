import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SuppliersRoutingModule } from 'app/views/suppliers/suppliers.routing.module';
import { SupplierFormComponent } from 'app/views/suppliers/form/form.component';
import { SupplierListComponent } from 'app/views/suppliers/list/list.component';
import { LineSupplierDetailComponent } from 'app/views/suppliers/list/line-supplier/line-supplier.component';
import { SupplierDataFormComponent } from './form/supplier-data-form/supplier-data-form.component';
import { SupplierContactFormComponent } from './form/supplier-contact-form/supplier-contact-form.component';
import { SupplierAdditionalInformationComponent } from './form/supplier-additional-information/supplier-additional-information.component';
import { SupplierDocumentationComponent } from './form/supplier-documentation/supplier-documentation.component';
import { SupplierDocumentationItemComponent } from './form/supplier-documentation/supplier-documentation-item/supplier-documentation-item.component';
import { SupplierOverviewComponent } from './supplier-overview/supplier-overview.component';
import { SupplierOverviewDataComponent } from './supplier-overview/supplier-overview-data/supplier-overview-data.component';
import { SupplierOverviewContactComponent } from './supplier-overview/supplier-overview-contact/supplier-overview-contact.component';
import { SupplierOverviewAdditionalInformationComponent } from './supplier-overview/supplier-overview-additional-information/supplier-overview-additional-information.component';
import { SupplierOverviewDocumentationComponent } from './supplier-overview/supplier-overview-documentation/supplier-overview-documentation.component';
import { SupplierReportDialogComponent } from './list/supplier-report-dialog/supplier-report-dialog.component';

@NgModule({
    imports: [
        SharedModule,
        SuppliersRoutingModule
    ],
    declarations: [
        SupplierListComponent,
        SupplierFormComponent,
        LineSupplierDetailComponent,
        SupplierDataFormComponent,
        SupplierContactFormComponent,
        SupplierAdditionalInformationComponent,
        SupplierDocumentationComponent,
        SupplierDocumentationItemComponent,
        SupplierOverviewComponent,
        SupplierOverviewDataComponent,
        SupplierOverviewContactComponent,
        SupplierOverviewAdditionalInformationComponent,
        SupplierOverviewDocumentationComponent,
        SupplierReportDialogComponent
    ],
    entryComponents: [
        SupplierOverviewComponent,
        SupplierReportDialogComponent
    ]

})
export class SuppliersModule { }
