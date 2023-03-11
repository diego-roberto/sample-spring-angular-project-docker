import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { NotificationMenuComponent } from './notification-menu/notification-menu.component';
import { NotificationComponent } from './notification/notification.component';
import {
    NotificationSidenavContainerComponent,
    ContentToolbarComponent,
    MainContentComponent
} from './notification-content-container/notification-content-container.component';

import { VirtualScrollModule } from 'angular2-virtual-scroll';

@NgModule({
    imports: [
        FlexLayoutModule,
        CommonModule,
        FormsModule,
        InfiniteScrollModule,
        MaterialModule,
        VirtualScrollModule
    ],
    exports: [
        NotificationSidenavContainerComponent,
        ContentToolbarComponent,
        MainContentComponent
    ],
    declarations: [
        NotificationSidenavContainerComponent,
        ContentToolbarComponent,
        MainContentComponent,
        NotificationMenuComponent,
        NotificationComponent
    ]
})
export class NotificationSidenavContainerModule { }

export * from './notification-content-container/notification-content-container.component';
