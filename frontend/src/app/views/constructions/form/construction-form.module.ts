import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ConstructionFormRoutingModule } from 'app/views/constructions/form/construction-form.routing.module';
import { ConstructionFormSmartComponent } from 'app/views/constructions/form/construction-form.component';
import { ConstructionFormComponent } from 'app/views/constructions/form/construction-form/construction-form.component';
import { ConstructionWorkersFormComponent } from 'app/views/constructions/form/construction-form/components/construction-workers-form/construction-workers-form.component';
import { ConstructionManagersFormComponent } from 'app/views/constructions/form/construction-form/components/construction-managers-form/construction-managers-form.component';
import { ConstructionMaintenancesFormComponent } from 'app/views/constructions/form/construction-form/components/construction-maintenances-form/construction-maintenances-form.component';
import { ConstructionDetailsFormComponent } from 'app/views/constructions/form/construction-form/components/construction-details-form/construction-details-form.component';
import { ConstructionBlueprintsFormComponent } from 'app/views/constructions/form/construction-form/components/construction-blueprints-form/construction-blueprints-form.component';
import { ConstructionModulesFormComponent } from './construction-form/components/construction-modules-form/construction-modules-form.component';
import { ConstructionDocumentationComponent } from './construction-form/components/construction-documentation/construction-documentation.component';
import { ConstructionDocumentationItemComponent } from './construction-form/components/construction-documentation/construction-documentation-item/construction-documentation-item.component';

@NgModule({
    imports: [
        SharedModule,
        ConstructionFormRoutingModule
    ],
    declarations: [
        ConstructionFormSmartComponent,
        ConstructionFormComponent,
        ConstructionWorkersFormComponent,
        ConstructionManagersFormComponent,
        ConstructionMaintenancesFormComponent,
        ConstructionDetailsFormComponent,
        ConstructionBlueprintsFormComponent,

        ConstructionModulesFormComponent,
        ConstructionDocumentationComponent,
        ConstructionDocumentationItemComponent
    ]
})
export class ConstructionFormModule { }
