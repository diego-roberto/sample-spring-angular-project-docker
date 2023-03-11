import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { ConstructionsRoutingModule } from "app/views/constructions/constructions.routing.module";
import { ConstructionsListComponent } from "app/views/constructions/list/constructions-list.component";
import { ConstructionListCardComponent } from "app/views/constructions/list/construction-list-card/construction-list-card.component";
import { ConstructionListItemComponent } from "app/views/constructions/list/construction-list-item/construction-list-item.component";
import { ConstructionsLandingPageComponent } from "app/views/constructions/list/landing-page/landing-page.component";
import { ConstructionsCommonModule } from "app/views/constructions/_common/constructions-common.module";
import { EquipmentReportModalComponent } from "app/views/constructions/list/equipment-report-modal/equipment-report-modal.component";
import { ConstructionReportDialogComponent } from "./list/construction-report-dialog/construction-report-dialog.component";
import { deleteConfirmDialog } from "./list/delete-confirm-dialog/delete-confirm-dialog.component";

@NgModule({
  imports: [
    SharedModule,
    ConstructionsRoutingModule,
    ConstructionsCommonModule
  ],
  declarations: [
    ConstructionsListComponent,
    ConstructionListCardComponent,
    ConstructionListItemComponent,
    ConstructionsLandingPageComponent,
    EquipmentReportModalComponent,
    ConstructionReportDialogComponent,
    deleteConfirmDialog
  ],
  entryComponents: [
    deleteConfirmDialog,
    EquipmentReportModalComponent,
    ConstructionReportDialogComponent
  ]
})
export class ConstructionsModule {}
