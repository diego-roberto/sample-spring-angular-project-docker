import { Service } from 'app/shared/models/service.model';
import { ConstructionDetailModule } from './../../views/constructions/detail/construction-detail.module';
import { OccurrencesDialogComponent } from './../../views/constructions/detail/activities/occurrences/occurrences-dialog/occurrences-dialog.component';
import { ActionPlanItemService } from './action-plan-item.service';
import { ActionPlanService } from './action-plan.service';
import { ChecklistResultService } from './checklist-result.service';
import { AssessmentPenaltyService } from './assessment-penalty.service';
import { ChecklistAnswerService } from './checklist-answer.service';
import { AssessmentService } from './assessment.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingService } from './training.service';
import { NotificationSidenavService } from './notification-sidenav.service';
import { HttpClientService } from './http-client.service';
import { MarkerService } from './marker.service';
import { IconService } from './icon.service';
import { FloorService } from './floor.service';
import { SupplierService } from './supplier.service';
import { EmotionService } from './emotion.service';
import { CompanyService } from './company.service';
import { WebSocketService } from './web-socket.service';
import { ExternalImportEpiService } from './external-import-epi.service';
import { NotificationTypesService } from './notification-type.service';
import { NotificationsService } from './notifications.service';
import { WorkerWearableService } from './worker-wearable.service';
import { CaEpiService } from './ca-epi.service';
import { EpiWorkersService } from './epi-workers.service';
import { EpiTypesService } from './epi-types.service';
import { EpiService } from './epi.service';
import { RiskFactorsQualitiesService } from './risk-factors-qualities.service';
import { RiskFactorsEpiService } from './risk-factors-epi.service';
import { RiskFactorsCbosService } from './risk-factors-cbos.service';
import { RiskService } from './risks.service';
import { ConesWorkersService } from './cones-workers.service';
import { ConesAlertService } from './cones-alert.service';
import { ConeService } from './cone.service';
import { EquipmentCategoriesService } from './equipment-categories.service';
import { EquipmentTypesService } from './equipment-types.service';
import { RiskFactorsService } from './risk-factors.service';
import { RiskTypesService } from './risk-types.service';
import { EquipmentsService } from './equipments.service';
import { WorkerService } from './worker.service';
import { ConstructionsService } from './constructions.service';
import { TasksService } from './task.service';
import { UserService } from './user.service';
import { SensorCompanyService } from './sensorcompany.service';
import { OccurrenceService } from './occurrence.service';
import { CnaeService } from './cnae.service';
import { PasswordService } from './password.service';
import { SessionsService } from './sessions.service';
import { QualitiesService } from './qualities.service';
import { QualificationsService } from './qualifications.service';
import { AsoService } from './aso.service';
import { SectorsService } from './sector.service';
import { ConeWsService } from './cone-ws.service';
import { AuthGuard } from 'app/shared/guards';
import { ChecklistService } from './checklist.service';
import { ChecklistPossibleAnswersService } from 'app/shared/services/checklist-possible-answers.service';
import { ManagementsService } from './managements.service';
import { FilesService } from './files.service';
import { ChecklistQuestionAnswerService } from './checklist-question-answer.service';
import { ActionPlanReportService } from './action-plan-report.service';
import { UserProfileService } from './user-profile.service';
import { ConstructionUserProfileService } from './construction-user-profile.service';
import { PermissionService } from './permission.service';
import { TrainingScheduleService } from 'app/shared/services/training-schedule.service';
import { ServicesService } from './services.service';
import { TrainingKeywordService } from './training-keyword.service';
import { TotemDeactiveGuard } from '../guards/totem-deactive-guard';
import { DashboardService } from './dashboard.service';
import { VideoService } from './video.service';
import { IndividualEquipmentService } from './individual-equipment.service';
import { LoadingStackService } from './loading-stack.service';
import { IndividualEquipmentWorkerService } from './individual-equipment-worker.service';
import { BusinessUnitService } from './business-unit.service';
import { ConnectionsService } from './connections.service';
import { ReportsService } from './reports.service';
import { TicketGateService } from './ticket-gate.service';
import { DegreeService } from './degree.service';

/**
 * @author bhfreitas
 * @description use to provide all services from here
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  entryComponents: [
  ],
  providers: [
    AuthGuard,
    TotemDeactiveGuard,
    ActionPlanService,
    AsoService,
    BusinessUnitService,
    CaEpiService,
    CnaeService,
    CompanyService,
    ConnectionsService,
    ConeService,
    ConesWorkersService,
    ConesAlertService,
    ConstructionsService,
    ConstructionUserProfileService,
    DegreeService,
    EmotionService,
    EpiService,
    EpiTypesService,
    EpiWorkersService,
    EquipmentCategoriesService,
    EquipmentTypesService,
    EquipmentsService,
    ExternalImportEpiService,
    FloorService,
    HttpClientService,
    IconService,
    MarkerService,
    NotificationSidenavService,
    NotificationTypesService,
    NotificationsService,
    OccurrenceService,
    TrainingScheduleService,
    PasswordService,
    PermissionService,
    QualificationsService,
    QualitiesService,
    RiskFactorsCbosService,
    RiskFactorsEpiService,
    RiskFactorsQualitiesService,
    RiskFactorsService,
    RiskService,
    RiskTypesService,
    SessionsService,
    SupplierService,
    TasksService,
    TrainingService,
    UserService,
    SensorCompanyService,
    WebSocketService,
    WorkerService,
    WorkerWearableService,
    SectorsService,
    ConeWsService,
    ChecklistService,
    FilesService,
    AssessmentService,
    ChecklistPossibleAnswersService,
    ManagementsService,
    ChecklistAnswerService,
    ChecklistQuestionAnswerService,
    AssessmentPenaltyService,
    ChecklistResultService,
    ActionPlanReportService,
    ActionPlanItemService,
    UserProfileService,
    ServicesService,
    TrainingKeywordService,
    DashboardService,
    VideoService,
    IndividualEquipmentService,
    LoadingStackService,
    IndividualEquipmentWorkerService,
    ReportsService,
    TicketGateService,
  ]
})
export class ServicesModule { }
