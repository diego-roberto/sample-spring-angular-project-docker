import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from 'app/views/dashboard/dashboard.component';
import { OcurrencesChartComponent } from 'app/views/dashboard/ocurrences-chart/ocurrences-chart.component';
import { DashboardRoutingModule } from 'app/views/dashboard/dashboard.routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChecklistChartComponent } from './checklist-chart/checklist-chart.component';
import { ActionPlanChartComponent } from './actionplan-chart/actionplan-chart.component';
import { TaskChartComponent } from './task-chart/task-chart.component';
import { PotentialEmbargoChartComponent } from './potential-embargo-chart/potential-embargo-chart.component';
import { PotentialPenaltyChartComponent } from './potential-penalty-chart/potential-penalty-chart.component';
import { PotentialEmbargoDetailsChartComponent } from './potential-embargo-details-chart/potential-embargo-details-chart.component';
import { PotentialPenaltyDetailsChartComponent } from './potential-penalty-details-chart/potential-penalty-details-chart.component';
import { ConstructionCounterWidgetComponent } from './construction-counter-widget/construction-counter-widget.component';
import { ActionPlanDetailsChartComponent } from './actionplan-details-chart/actionplan-details-chart.component';
import { ChecklistDetailsChartComponent } from './checklist-details-chart/checklist-details-chart.component';
import { WorkerAsoChartComponent } from './worker-aso-chart/worker-aso-chart.component';
import { WorkerQualificationChartComponent } from './worker-qualification-chart/worker-qualification-chart.component';
import { EpiDeliveryChartComponent } from './epi-delivery-chart/epi-delivery-chart.component';
import { EpiDeliveryDetailsChartComponent } from './epi-delivery-details-chart/epi-delivery-details-chart.component';
import { EquipmentMaintenanceChartComponent } from './equipment-maintenance-chart/equipment-maintenance-chart.component';
import { TrainingScheduleChartComponent } from './training-schedule-chart/training-schedule-chart.component';
import { StrategicFactorsDashboardComponent } from './strategic-factors-dashboard/strategic-factors-dashboard.component';
import { HumanFactorsDashboardComponent } from './human-factors-dashboard/human-factors-dashboard.component';
import { WorkersChartComponent } from './workers-chart/workers-chart.component';


@NgModule({
    imports: [
        SharedModule,
        DashboardRoutingModule,
        NgxEchartsModule,
    ],
    declarations: [
        DashboardComponent,
        OcurrencesChartComponent,
        ChecklistChartComponent,
        ActionPlanChartComponent,
        ActionPlanDetailsChartComponent,
        TaskChartComponent,
        PotentialEmbargoChartComponent,
        PotentialPenaltyChartComponent,
        PotentialEmbargoDetailsChartComponent,
        PotentialPenaltyDetailsChartComponent,
        WorkersChartComponent,
        ConstructionCounterWidgetComponent,
        ChecklistDetailsChartComponent,
        WorkerAsoChartComponent,
        WorkerQualificationChartComponent,
        EpiDeliveryChartComponent,
        EpiDeliveryDetailsChartComponent,
        WorkerQualificationChartComponent,
        EquipmentMaintenanceChartComponent,
        TrainingScheduleChartComponent,
        StrategicFactorsDashboardComponent,
        HumanFactorsDashboardComponent,
        
    ],
    entryComponents: [
        ActionPlanDetailsChartComponent,
        PotentialEmbargoDetailsChartComponent,
        PotentialPenaltyDetailsChartComponent,
        ChecklistDetailsChartComponent,
        EpiDeliveryDetailsChartComponent
    ]
})
export class DashboardModule { }
