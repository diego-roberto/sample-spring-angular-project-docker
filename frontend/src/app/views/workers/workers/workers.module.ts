import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { WorkersRoutingModule } from 'app/views/workers/workers/workers.routing.module';
import { WorkerFormComponent } from './form/form.component';
import { WorkersDataComponent } from './form/worker-details-form/worker-details-form.component';
import { WorkerCpfExistsDialogComponent } from './form/worker-details-form/worker-dialog/worker-cpf-exists-dialog.component';
import { WorkerHealthFormComponent } from './form/worker-health-form/worker-health-form.component';
import { WorkerQualificationsFormComponent } from './form/worker-qualifications-form/worker-qualifications-form.component';
import { SecurityWorksComponent } from './form/worker-security-form/worker-security-form.component';
import { WorkerListComponent } from './list/list.component';
import { WorkerNextExpirationsComponent } from './list/worker-next-expirations/worker-next-expirations.component';
import { WorkersCardDetailComponent } from './list/workers-card-detail/workers-card-detail.component';
import { WorkersLandingPageComponent } from './list/workers-landing-page/workers-landing-page.component';
import { LineWorkerDetailComponent, WorkerProfileDialogOverviewComponent } from './list/workers-line-detail/workers-line-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { AsoDetailsWorkerComponent } from './profile/worker-aso-details/worker-aso-details.component';
import { PersonalDetailsWorkerComponent } from './profile/worker-personal-details/worker-personal-details.component';
import { QualificationsDetailsWorkerComponent } from './profile/worker-qualifications-details/worker-qualifications-details.component';
import { SecurityDetailsWorkerComponent } from './profile/worker-security-details/worker-security-details.component';
import { WorkerAsoDialogComponent } from './list/worker-next-expirations/worker-aso-dialog/worker-aso-dialog.component';
import { WorkerQualificationDialogComponent } from './list/worker-next-expirations/worker-qualification-dialog/worker-qualification-dialog.component';
import { WorkerReportDialogComponent } from './list/worker-report-dialog/worker-report-dialog.component';
import { UploadWorkersComponent } from './upload-workers/upload-workers.component';
import { WorkerEditAllDialogComponent } from './list/worker-edit-all-dialog/worker-edit-all-dialog.component';


@NgModule({
  imports: [
    SharedModule,
    WorkersRoutingModule,
  ],
  declarations: [
    WorkerFormComponent,
    WorkersDataComponent,
    WorkerCpfExistsDialogComponent,
    WorkerHealthFormComponent,
    WorkerQualificationsFormComponent,
    SecurityWorksComponent,
    WorkerAsoDialogComponent,
    WorkerQualificationDialogComponent,
    WorkerListComponent,
    WorkerNextExpirationsComponent,
    WorkersCardDetailComponent,
    WorkersLandingPageComponent,
    LineWorkerDetailComponent,
    WorkerProfileDialogOverviewComponent,
    ProfileComponent,
    AsoDetailsWorkerComponent,
    PersonalDetailsWorkerComponent,
    QualificationsDetailsWorkerComponent,
    SecurityDetailsWorkerComponent,
    WorkerReportDialogComponent,
    UploadWorkersComponent,
    WorkerEditAllDialogComponent
  ],
  entryComponents: [
    WorkerAsoDialogComponent,
    WorkerQualificationDialogComponent,
    WorkerCpfExistsDialogComponent,
    WorkerProfileDialogOverviewComponent,
    WorkerReportDialogComponent,
    WorkerEditAllDialogComponent
  ]
})
export class WorkersModule { }
