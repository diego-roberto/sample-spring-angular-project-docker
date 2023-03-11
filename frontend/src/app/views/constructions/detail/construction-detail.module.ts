import { Ng2ImgMaxModule } from 'ng2-img-max';
import { OccurrenceCreatorService } from './_common/occurrence-creator.service';
import { OccurrencesDataFormComponent } from './activities/occurrences/occurrences-data-form/occurrences-data-form.component';
import { TasksDataFormComponent } from './activities/tasks/tasks-data-form/tasks-data-form.component';
import { OccurrencesDialogTitleComponent } from './activities/occurrences/title-dialog-conte/title-dialog-content.component';
import { ChecklistAttachmentFilesComponent } from './activities/checklist/checklist-question/checklist-attachment-files/checklist-attachment-files.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ConstructionDetailRoutingModule } from 'app/views/constructions/detail/construction-detail.routing.module';
import { ConstructionDetailComponent } from 'app/views/constructions/detail/construction-detail.component';
import { OccurrencesListComponent, OccurrenceDetailDialogOverviewComponent } from 'app/views/constructions/detail/activities/occurrences/occurrences-list/occurrences-list.component';
import { ActivitiesComponent } from 'app/views/constructions/detail/activities/activities.component';
import { TasksListComponent } from 'app/views/constructions/detail/activities/tasks/tasks-list/tasks-list.component';
import { TasksDialogComponent } from 'app/views/constructions/detail/activities/tasks/tasks-dialog/tasks-dialog.component';
import { TasksCompleteDialogComponent } from 'app/views/constructions/detail/activities/tasks/tasks-complete-dialog/tasks-complete-dialog.component';
import { TasksAttachmentFilesComponent } from 'app/views/constructions/detail/activities/tasks/tasks-attachment-files/tasks-attachment-files.component';
import { TaskViewComponent } from 'app/views/constructions/detail/activities/tasks/task-view/task-view.component';
import { EmotionalPanelComponent } from 'app/views/constructions/detail/emotional/emotional-panel/emotional-panel.component';
import { EmotionsGraphComponent } from 'app/views/constructions/detail/emotional/emotional-panel/emotions-graph/emotions-graph.component';
import { EmotionsChartComponent } from 'app/views/constructions/detail/emotional/emotional-panel/emotions-chart/emotions-chart.component';
import { DayStatusComponent } from 'app/views/constructions/detail/emotional/emotional-panel/day-status/day-status.component';
import { BaseDayStatusComponent } from 'app/views/constructions/detail/emotional/emotional-panel/day-status/base-day-status/base-day-status.component';
import { MonitoringComponent } from 'app/views/constructions/detail/monitoring/monitoring.component';
import { AreaMappingComponent } from 'app/views/constructions/detail/monitoring/area-mapping/area-mapping.component';
import { ToolboxComponent } from 'app/views/constructions/detail/monitoring/area-mapping/toolbox/toolbox.component';
import { MappingDialogComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/mapping-dialog/mapping-dialog.component';
import { MappingDialogGuardComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/mapping-dialog-guard/mapping-dialog-guard.component';
import { MappingStagesComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/mapping-stages/mapping-stages.component';
import { PermissionsComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/permissions/permissions.component';
import { RelatedRisksComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/related-risks/related-risks.component';
import { SensorIdentificationComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/sensor-identification/sensor-identification.component';
import { ConeIdFormatterDirective } from 'app/views/constructions/detail/monitoring/area-mapping/cone/sensor-identification/cone-id.directive';
import { AreaMonitoringComponent } from 'app/views/constructions/detail/monitoring/area-monitoring/area-monitoring.component';
import { AlertsTabComponent } from 'app/views/constructions/detail/monitoring/area-monitoring/alerts-tab/alerts-tab.component';
import { AlertsTabItemComponent } from 'app/views/constructions/detail/monitoring/area-monitoring/alerts-tab-item/alerts-tab-item.component';
import { FiltersComponent } from 'app/views/constructions/detail/monitoring/area-monitoring/filters/filters.component';
import { BlueprintMappingComponent } from 'app/views/constructions/detail/monitoring/blueprint/blueprint-mapping/blueprint-mapping.component';
import { BlueprintMonitoringComponent } from 'app/views/constructions/detail/monitoring/blueprint/blueprint-monitoring/blueprint-monitoring.component';
import { ConeManagementListComponent } from 'app/views/constructions/detail/monitoring/cone-management-list/cone-management-list.component';
import { ConeManagementLineDetailComponent } from 'app/views/constructions/detail/monitoring/cone-management-list/cone-management-line-detail/cone-management-line-detail.component';
import { MappingResultAlertsComponent } from 'app/views/constructions/detail/monitoring/cone-management-list/mapping-result-alerts/mapping-result-alerts.component';
import { OverviewComponent } from 'app/views/constructions/detail/overview/overview.component';
import { ListCellComponent } from 'app/views/constructions/detail/overview/_common/list-cell/list-cell.component';
import { ChecklistCellComponent } from 'app/views/constructions/detail/overview/checklist-cell/checklist-cell.component';
import { ConstructionsStatusComponent } from 'app/views/constructions/detail/overview/constructions-status/constructions-status.component';
import { FilteredSectionListComponent } from 'app/views/constructions/detail/overview/filtered-section-list/filtered-section-list.component';
import { SectionListComponent } from 'app/views/constructions/detail/overview/section-list/section-list.component';
import { WorkersOverviewComponent } from 'app/views/constructions/detail/overview/workers-overview/workers-overview.component';
import { ReportsComponent } from 'app/views/constructions/detail/reports/reports.component';
import { RepositoriesComponent } from 'app/views/constructions/detail/repositories/repositories.component';
import { FabMonitoringComponent } from 'app/views/constructions/detail/_common/fab-monitoring/fab-monitoring.component';
import { ConeFiltersModule } from 'app/views/constructions/detail/monitoring/cone-management-list/cone-filters/cone-filters.module';
import { ConstructionsDropdownComponent } from 'app/views/constructions/detail/_common/constructions-dropdown/constructions-dropdown.component';
import { ChecklistPossibleAnswerComponent } from './activities/checklist/checklist-question/checklist-possible-answer/checklist-possible-answer.component';
import { ConstructionsCommonModule } from 'app/views/constructions/_common/constructions-common.module';
import { EpiFiltersComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/permissions/epi-filters/epi-filters.component';
import { QualityFiltersComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/permissions/quality-filters/quality-filters.component';
import { SelectingWorkersComponent } from 'app/views/constructions/detail/monitoring/area-mapping/cone/permissions/selecting-workers/selecting-workers.component';
import { TaskCreatorService } from 'app/views/constructions/detail/_common/task-creator.service';

// Checklist
import { ChecklistComponent } from './activities/checklist/checklist.component';
import { ChecklistListComponent } from './activities/checklist/checklist-list/checklist-list.component';
import { ChecklistAnswersComponent } from './activities/checklist/checklist-answers/checklist-answers.component';
import { ChecklistLineAnswerComponent } from './activities/checklist/checklist-answers/checklist-line-answer/checklist-line-answer.component';
import { ChecklistsLandingPageComponent } from './activities/checklist/checklists-landing-page/checklists-landing-page.component';
import { ChecklistsLineDetailComponent } from './activities/checklist/checklist-list/checklists-line-detail/checklists-line-detail.component';
import { ChecklistQuestionComponent } from './activities/checklist/checklist-question/checklist-question.component';
import { ChecklistAnswerComponent } from './activities/checklist/checklist-question/checklist-answer/checklist-answer.component';
import { ChecklistSectionComponent } from './activities/checklist/checklist-question/checklist-section/checklist-section.component';
import { ChecklistSectionQuestionComponent } from './activities/checklist/checklist-question/checklist-section-question/checklist-section-question.component';
import { ChecklistResultComponent } from './activities/checklist/checklist-result/checklist-result.component';
import { ChecklistResultConstructionComponent } from './activities/checklist/checklist-result/checklist-result-construction/checklist-result-construction.component';
import { ChecklistResultEvaluationComponent } from './activities/checklist/checklist-result/checklist-result-evaluation/checklist-result-evaluation.component';
import { ChecklistResultGeneralComponent } from './activities/checklist/checklist-result/checklist-result-general/checklist-result-general.component';
import { ChecklistResultDetailedEvaluationComponent } from './activities/checklist/checklist-result/checklist-result-detailed-evaluation/checklist-result-detailed-evaluation.component';
import { ChecklistResultListComponent } from './activities/checklist/checklist-result-list/checklist-result-list.component';
import { ChecklistsResultLineDetailComponent } from './activities/checklist/checklist-result-list/checklists-result-line-detail/checklists-result-line-detail.component';
import { ChecklistResultConsiderationsComponent } from './activities/checklist/checklist-result/checklist-result-considerations/checklist-result-considerations.component';
import { ChecklistFormComponent } from './activities/checklist/checklist-form/checklist-form.component';
// Action Plan
import { ActionPlanListComponent } from './activities/action-plan/action-plan-list/action-plan-list.component';
import { ActionPlanComponent } from './activities/action-plan/action-plan.component';
import { ActionPlanListLineDetailComponent } from './activities/action-plan/action-plan-list/action-plan-list-line-detail/action-plan-list-line-detail.component';
import { ActionPlanDialogService } from './activities/action-plan/service/action-plan-dialog.service';
// ActionPlanItem
import { ActionBasiComponent } from './activities/action-plan/action/action-basic/action-basic.component';
import { ActionViewComponent } from './activities/action-plan/action/action-view/action-view.component';
import { ActionListLineDetailComponent } from './activities/action-plan/action/action-list-line-detail/action-list-line-detail.component';
import { ActionPlanItemFormComponent } from './activities/action-plan/action/action-form/action-plan-item-form.component';

import { OccurrencesDialogComponent } from './activities/occurrences/occurrences-dialog/occurrences-dialog.component';
import { OccurrencesAttachmentFilesComponent } from './activities/occurrences/occurrences-dialog/occurrences-attachment-files/occurrences-attachment-files.component';
import { OccurrencesWorkersComponent } from './activities/occurrences/occurrences-dialog/occurrences-workers/occurrences-workers.component';
import { ScheduledTrainingsListComponent } from './activities/trainings/scheduled-trainings-list/scheduled-trainings-list.component';
import { UpdateActionPlanDialogComponent } from './activities/action-plan/update-action-plan-dialog/update-action-plan-dialog.component';
import { UpdateActionPlanDialogService } from './_common/update-action-plan-dialog.service';
import { ScheduledTrainingsListItemComponent } from './activities/trainings/scheduled-trainings-list/scheduled-trainings-list-item/scheduled-trainings-list-item.component';
import { TrainingScheduleDialogComponent } from './activities/trainings/training-schedule-dialog/training-schedule-dialog.component';
import { TitleTrainingScheduleDialogComponent} from './activities/trainings/training-schedule-dialog/title-training-schedule-dialog/title-training-schedule-dialog.component';
import { TrainingLineDetailComponent } from 'app/views/constructions/detail/activities/trainings/training-schedule-dialog/training-line-detail/training-line-detail.component';
import { TrainingSchedulerService } from '../../../shared/services/training-scheduler.service';
import { ScheduledTrainingDetailsComponent } from './overview/scheduled-training-details/scheduled-training-details.component';
import { AttendanceListDialogComponent } from './activities/trainings/scheduled-trainings-list/scheduled-trainings-list-item/attendance-list-dialog/attendance-list-dialog.component';
import { EmbedVideo } from 'ngx-embed-video';
import { MinistersComponent } from 'app/views/constructions/detail/activities/trainings/training-schedule-dialog/ministers/ministers.component';
import { TrainingScheduleEditDialogComponent } from 'app/views/constructions/detail/activities/trainings/training-schedule-edit-dialog/training-schedule-edit-dialog.component';

import { RemoveScheduledTrainingDialogComponent } from './activities/trainings/scheduled-trainings-list/scheduled-trainings-list-item/remove-scheduled-training-dialog/remove-scheduled-training-dialog.component';
import { RemoveScheduledTrainingsDialogService } from './activities/trainings/scheduled-trainings-list/scheduled-trainings-list-item/remove-scheduled-training-dialog/remove-scheduled-training-dialog.service';
import { ChecklistReplicateStatusComponent } from './activities/checklist/checklist-replicate-status/checklist-replicate-status.component';
import { ChecklistSessionFormComponent } from './activities/checklist/checklist-form/checklist-session-form/checklist-session-form.component';
import { ChecklistQuestionFormComponent } from './activities/checklist/checklist-form/checklist-session-form/checklist-question-form/checklist-question-form.component';
import { TrainingScheduleAttendanceListUploadDialogComponent } from './activities/trainings/training-schedule-attendance-list-upload-dialog/training-schedule-attendance-list-upload-dialog.component';


@NgModule({
    imports: [
        SharedModule,
        ConstructionDetailRoutingModule,
        ConeFiltersModule,
        ConstructionsCommonModule,
        Ng2ImgMaxModule,
        EmbedVideo.forRoot(),
    ],
    declarations: [
        ConstructionDetailComponent,
        OccurrencesListComponent,
        OccurrenceDetailDialogOverviewComponent,
        ActivitiesComponent,
        TasksListComponent,
        TasksDialogComponent,
        TasksCompleteDialogComponent,
        TasksAttachmentFilesComponent,
        TaskViewComponent,
        EmotionalPanelComponent,
        EmotionsGraphComponent,
        EmotionsChartComponent,
        DayStatusComponent,
        BaseDayStatusComponent,
        MonitoringComponent,
        AreaMappingComponent,
        ToolboxComponent,
        MappingDialogComponent,
        MappingDialogGuardComponent,
        MappingStagesComponent,
        PermissionsComponent,
        RelatedRisksComponent,
        SensorIdentificationComponent,
        ConeIdFormatterDirective,
        AreaMonitoringComponent,
        AlertsTabComponent,
        AlertsTabItemComponent,
        FiltersComponent,
        BlueprintMappingComponent,
        BlueprintMonitoringComponent,
        ConeManagementListComponent,
        ConeManagementLineDetailComponent,
        MappingResultAlertsComponent,
        OverviewComponent,
        ListCellComponent,
        ChecklistCellComponent,
        ConstructionsStatusComponent,
        FilteredSectionListComponent,
        SectionListComponent,
        WorkersOverviewComponent,
        ReportsComponent,
        RepositoriesComponent,
        FabMonitoringComponent,
        ConstructionsDropdownComponent,
        EpiFiltersComponent,
        QualityFiltersComponent,
        SelectingWorkersComponent,
        ChecklistComponent,
        ChecklistListComponent,
        ChecklistAnswersComponent,
        ChecklistLineAnswerComponent,
        ChecklistsLineDetailComponent,
        ChecklistsLandingPageComponent,
        ChecklistQuestionComponent,
        ChecklistAnswerComponent,
        ChecklistSectionComponent,
        ChecklistSectionQuestionComponent,
        ChecklistResultComponent,
        ChecklistResultConstructionComponent,
        ChecklistResultEvaluationComponent,
        ChecklistResultGeneralComponent,
        ChecklistResultDetailedEvaluationComponent,
        ChecklistResultListComponent,
        ChecklistsResultLineDetailComponent,
        ChecklistPossibleAnswerComponent,
        ChecklistResultConsiderationsComponent,
        ChecklistAttachmentFilesComponent,
        ChecklistFormComponent,
        ChecklistReplicateStatusComponent,
        ActionPlanListComponent,
        ActionPlanComponent,
        ActionPlanListLineDetailComponent,
        ChecklistAttachmentFilesComponent,
        ActionBasiComponent,
        ActionListLineDetailComponent,
        ActionViewComponent,
        ActionPlanItemFormComponent,
        OccurrencesDataFormComponent,
        TasksDataFormComponent,
        OccurrencesDialogTitleComponent,
        OccurrencesDialogComponent,
        OccurrencesAttachmentFilesComponent,
        OccurrencesWorkersComponent,
        ScheduledTrainingsListComponent,
        UpdateActionPlanDialogComponent,
        TrainingScheduleEditDialogComponent,
        TrainingScheduleDialogComponent,
        TitleTrainingScheduleDialogComponent,
        TrainingLineDetailComponent,
        ScheduledTrainingsListItemComponent,
        ScheduledTrainingDetailsComponent,
        AttendanceListDialogComponent,
        MinistersComponent,
        RemoveScheduledTrainingDialogComponent,
        ChecklistSessionFormComponent,
        ChecklistQuestionFormComponent,
        TrainingScheduleAttendanceListUploadDialogComponent,
    ],
    entryComponents: [
        TasksDialogComponent,
        TasksCompleteDialogComponent,
        TaskViewComponent,
        MappingDialogComponent,
        MappingDialogGuardComponent,
        MappingResultAlertsComponent,
        ActionViewComponent,
        OccurrencesDialogComponent,
        OccurrenceDetailDialogOverviewComponent,
        UpdateActionPlanDialogComponent,
        TrainingScheduleEditDialogComponent,
        ScheduledTrainingDetailsComponent,
        TrainingScheduleDialogComponent,
        AttendanceListDialogComponent,
        RemoveScheduledTrainingDialogComponent,
        TrainingScheduleAttendanceListUploadDialogComponent
    ],
    providers: [
        TaskCreatorService,
        OccurrenceCreatorService,
        ActionPlanDialogService,
        UpdateActionPlanDialogService,
        TrainingSchedulerService,
        RemoveScheduledTrainingsDialogService
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ConstructionDetailModule { }
