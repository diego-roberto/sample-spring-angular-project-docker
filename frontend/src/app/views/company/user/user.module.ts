import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserRoutingModule } from 'app/views/company/user/user.routing.module';
import { UserListComponent } from './list/user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserAddCompanyComponent } from './user-add-company/user-add-company.component';
import { UserLineDetailComponent} from './list/user-line-detail/user-line-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MdSlideToggleModule } from '@angular/material/';
@NgModule({
    imports: [
        SharedModule,
        UserRoutingModule,
        MdSlideToggleModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [
        UserListComponent,
        UserAddComponent,
        UserLineDetailComponent,
        UserAddCompanyComponent
    ],
    entryComponents: [
        UserAddComponent,
        UserAddCompanyComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA

    ]
})
export class UsersModule { }
