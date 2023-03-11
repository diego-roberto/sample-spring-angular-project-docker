import { ConstructionWorkersFormComponent } from './construction-workers-form/construction-workers-form.component';
import { NgModule } from '@angular/core';
import { SummaryComponent } from 'app/views/constructions/_common/summary/summary.component';
import { FloorsSummaryComponent } from 'app/views/constructions/_common/floors-summary/floors-summary.component';
import { SharedModule } from 'app/shared/shared.module';
import { RiskGraphComponent } from 'app/views/constructions/_common/floors-summary/risk-graph/risk-graph.component';


@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        SummaryComponent,
        FloorsSummaryComponent,
        RiskGraphComponent,
        ConstructionWorkersFormComponent
    ],
    declarations: [
        SummaryComponent,
        FloorsSummaryComponent,
        RiskGraphComponent,
        ConstructionWorkersFormComponent
    ]
})
export class ConstructionsCommonModule { }
