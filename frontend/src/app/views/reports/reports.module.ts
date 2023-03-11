import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReportsRoutingModule } from './reports.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsOverviewComponent } from './reports-overview/reports-overview.component';
import { CompanyReportDialogComponent } from './company-report-dialog/company-report-dialog.component';
import { EventReportDialogComponent } from './event-report-dialog/event-report-dialog.component';
import { ChecklistReportDialogComponent } from './checklist-report-dialog/checklist-report-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    ReportsOverviewComponent,
    CompanyReportDialogComponent,
    EventReportDialogComponent,
    ChecklistReportDialogComponent
  ]
  ,
  entryComponents: [
    CompanyReportDialogComponent,
    EventReportDialogComponent,
    ChecklistReportDialogComponent
  ]
})
export class ReportsModule { }
