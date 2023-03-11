import { ChecklistFormComponent } from './activities/checklist/checklist-form/checklist-form.component';
import { ScheduledTrainingsListComponent } from './activities/trainings/scheduled-trainings-list/scheduled-trainings-list.component';
import { AuthGuard } from 'app/shared/guards';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConstructionDetailComponent } from 'app/views/constructions/detail/construction-detail.component';
import { OverviewComponent } from 'app/views/constructions/detail/overview/overview.component';
import { MonitoringComponent } from 'app/views/constructions/detail/monitoring/monitoring.component';
import { EmotionalPanelComponent } from 'app/views/constructions/detail/emotional/emotional-panel/emotional-panel.component';
import { ActivitiesComponent } from 'app/views/constructions/detail/activities/activities.component';
import { ReportsComponent } from 'app/views/constructions/detail/reports/reports.component';
import { RepositoriesComponent } from 'app/views/constructions/detail/repositories/repositories.component';
import { EnumPermission } from '../../../shared/models/permission/enum-permission';
import { TasksListComponent } from './activities/tasks/tasks-list/tasks-list.component';
import { OccurrencesListComponent } from './activities/occurrences/occurrences-list/occurrences-list.component';
import { ChecklistListComponent } from './activities/checklist/checklist-list/checklist-list.component';
import { ActionPlanListComponent } from './activities/action-plan/action-plan-list/action-plan-list.component';
import { ActionPlanListLineDetailComponent } from './activities/action-plan/action-plan-list/action-plan-list-line-detail/action-plan-list-line-detail.component';
import { ActionViewComponent } from './activities/action-plan/action/action-view/action-view.component';
import { ActionPlanComponent } from './activities/action-plan/action-plan.component';
import { ChecklistComponent } from './activities/checklist/checklist.component';
import { ChecklistReplicateStatusComponent } from './activities/checklist/checklist-replicate-status/checklist-replicate-status.component';
import { BasicComponent } from '../../../shared/components/basic/basic.component';


const CONSTRUCTION_DETAIL_ROUTING: Routes = [
    {
        path: '', component: ConstructionDetailComponent, canActivateChild: [AuthGuard],
        children: [
            { path: '', pathMatch: 'prefix', redirectTo: 'activities' },
            { path: 'overview', canActivateChild: [AuthGuard], component: OverviewComponent ,
                    data: { 
                        expectedPermissions: [
                        
                            
                            EnumPermission.CONSTRUCTION_OVERVIEW_SHOW_CARD_MONITORING,
                            EnumPermission.CONSTRUCTION_OVERVIEW_SHOW_CARD_WORKERS,
                            EnumPermission.CONSTRUCTION_OVERVIEW_SHOW_CARD_FORTHCOMINGMATURITIES,
                            EnumPermission.CONSTRUCTION_OVERVIEW_SHOW_CARD_TRAININGS,
                            EnumPermission. CONSTRUCTION_OVERVIEW_SHOW_CARD_LAST_ALERTS_MONITORING,
                            EnumPermission. CONSTRUCTION_OVERVIEW_SHOW_CARD_STATUS,
                            EnumPermission. CONSTRUCTION_OVERVIEW_SHOW_CARD_TASKS,
                        ]
                    },
        
            },
            { path: 'monitoring', canActivateChild: [AuthGuard], component: MonitoringComponent },
            { path: 'emotional-profile', canActivateChild: [AuthGuard], component: EmotionalPanelComponent },
            { path: 'activities', canActivateChild: [AuthGuard], component: ActivitiesComponent , 
                data: { 
                        expectedPermissions: [
                        
                            EnumPermission.CONSTRUCTION_ACTIVITIES_CHECKLIST_LIST,
                            EnumPermission.CONSTRUCTION_ACTIVITIES_OCURRENCE_LIST,
                            EnumPermission.CONSTRUCTION_ACTIVITIES_TASK_LIST
                        ]
                },
                children: [
                    {path: '' , redirectTo: 'tasks', pathMatch: 'full'},
                    {path: 'tasks', component: TasksListComponent},
                    {path: 'occurrences', component: OccurrencesListComponent},
                    {path: 'checklist', component: ChecklistComponent},
                    { path: 'checklist/new', component: ChecklistFormComponent, data: { expectedPermissions: [ EnumPermission.CONSTRUCTION_ACTIVITIES_CHECKLIST_INSERT ] } },
                    { path: 'checklist/:id/edit', component: ChecklistFormComponent, data: { expectedPermissions: [ EnumPermission.CONSTRUCTION_ACTIVITIES_CHECKLIST_EDIT ] } },
                    { path: 'checklist/:id/replicate', component: ChecklistReplicateStatusComponent, data: { expectedPermissions: [ EnumPermission.CONSTRUCTION_ACTIVITIES_CHECKLIST_EDIT ] } },       
                    {path: 'actionPlan', component: ActionPlanComponent},
                    {path: 'trainings', component: ScheduledTrainingsListComponent},
                  ]
           },
            { path: 'reports', canActivateChild: [AuthGuard], component: ReportsComponent },
            { path: 'repositories', canActivateChild: [AuthGuard], component: RepositoriesComponent },
          
        ]
    },
   
];

@NgModule({
    imports: [
        RouterModule.forChild(CONSTRUCTION_DETAIL_ROUTING)
    ],
    exports: [
        RouterModule
    ]
})
export class ConstructionDetailRoutingModule { }
