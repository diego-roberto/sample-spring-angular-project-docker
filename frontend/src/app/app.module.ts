import { showOnDirtyErrorStateMatcher, MD_ERROR_GLOBAL_OPTIONS } from '@angular/material';
import { DatePipe } from '@angular/common';
import { QualitiesResolver } from './resolves/qualities.resolver';
import { StompService, StompConfig } from '@stomp/ng2-stompjs';
import { ConstructionResolver } from './resolves/construction.resolver';
import { ConstructionItemResolver } from './resolves/construction.item.resolver';
import { TaskListResolver } from './resolves/task.list.resolver';
import { WorkerEditableListResolver } from './resolves/worker-editable-list.resolver';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WorkerResolver } from 'app/resolves/worker.resolver';
import { WorkerItemResolver } from 'app/resolves/worker-item.resolver';
import { Http } from '@angular/http';
import { SharedModule } from 'app/shared/shared.module';
import { CustomStompConfig } from 'app/shared/util/stomp.config';
import { CustomHttpService } from 'app/shared/util/CustomHttpService';
import { ServicesModule } from 'app/shared/services/services.module';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { ConstructionDetailsResolver } from './resolves/construction-details-resolver';
import { TermService } from './shared/services/term.service';
import { TermUserService } from './shared/services/term-user.service';




@NgModule({
    declarations: [
        AppComponent,
        
    ],
    imports: [
        // ANGULAR MODULES
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        SharedModule,
        ServicesModule,
        Ng2ImgMaxModule,
        JsonpModule,
   
        // Routes
        AppRoutingModule,

    ],
    providers: [
        StompService,
        TermService,
        TermUserService,

        TaskListResolver,

        ConstructionResolver,
        ConstructionDetailsResolver,
        ConstructionItemResolver,
        WorkerItemResolver,
        WorkerEditableListResolver,
        WorkerResolver,
        QualitiesResolver,

        DatePipe,

        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: Http, useClass: CustomHttpService },
        { provide: StompConfig, useClass: CustomStompConfig },
        { provide: MD_ERROR_GLOBAL_OPTIONS, useValue: { errorStateMatcher: showOnDirtyErrorStateMatcher }}
    ],
    bootstrap: [
        AppComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class AppModule {

    static injector: Injector;

    constructor(injector: Injector) {
        AppModule.injector = injector;
    }
}
