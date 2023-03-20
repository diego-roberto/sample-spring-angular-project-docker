import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SampleListComponent } from '../sample/list/list.component'
import { OverviewComponent } from './overview/overview.component';
import { SampleFormComponent } from './form/form.component';

const SAMPLE_ROUTER: Routes = [
    {
        path: '', component: OverviewComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: SampleListComponent },
            { path: 'new', component: SampleFormComponent },
            { path: ':id/edit', component: SampleFormComponent },
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(SAMPLE_ROUTER)
    ],
    exports: [
        RouterModule
    ]
})
export class SampleRoutingModule { }

