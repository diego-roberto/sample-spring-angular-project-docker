import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module'
import { OverviewComponent } from './overview/overview.component';
import { SampleListComponent } from './list/list.component';
import { SampleFormComponent } from './form/form.component';
import { SampleRoutingModule } from './sample.routing.module';

@NgModule({
  imports: [
    SharedModule,
    SampleRoutingModule,
  ],
  declarations: [
    SampleListComponent,
    SampleFormComponent,
    OverviewComponent,
  ],
  entryComponents: [
    OverviewComponent,
  ]
})
export class SampleModule { }
