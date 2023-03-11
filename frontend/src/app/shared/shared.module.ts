import { UpperCaseDirective } from './util/directive/uppercase.directive';
import { LowerCaseDirective } from './util/directive/lowercase.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule, MdNativeDateModule, DateAdapter } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ChartsModule } from 'ng2-charts';

import { CpfPipe, PhonePipe, ConeIdPipe, LimitPipe, BackendPathPipe, IdWearablePipe, AuthPathPipe, CnpjPipe, CbosRemoveSynonymLetterPipe, MyFilterPipe, MyFilterQualityPipe } from 'app/shared/pipes/common.pipe';
import { FabComponent } from 'app/shared/components/floating-action-button/fab.component';
import { BlankComponent } from 'app/shared/components/blank/blank.component';
import { SearchComponent } from 'app/shared/components/search/search.component';
import { SafetyCardModule } from 'app/shared/components/safety-card';
import { BasicComponent } from 'app/shared/components/basic/basic.component';
import { BasicTopNavBarLayoutComponent } from 'app/shared/components/basic-topnavbar/basic-topnavbar.component';
import { TopnavbarComponent } from 'app/shared/components/topnavbar/topnavbar.component';
import { NavigationComponent } from 'app/shared/components/navigation/navigation.component';
import { ProfileDropdownComponent } from 'app/shared/components/topnavbar/profile-dropdown/profile-dropdown.component';
import { ListItemComponent } from 'app/shared/components/list-item/list-item.component';
import { DropFileComponent } from 'app/shared/components/drop-file/drop-file.component';
import { CepPickerComponent } from 'app/shared/components/cep-picker/cep-picker.component';
import { CnaePickerComponent } from 'app/shared/components/cnae-picker/cnae-picker.component';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { ConfirmDialogComponent } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.component';
import { InfoDialogHandler } from 'app/shared/util/generic/info-dialog/info-dialog.handler';
import { InfoDialogComponent } from 'app/shared/util/generic/info-dialog/info-dialog.component';
import { FabSpeedDialActionsComponent, FabSpeedDialComponent, FabSpeedDialTriggerComponent } from 'app/shared/components/fab-speed-dial/fab-speed-dial.component';
import { NotificationSidenavContainerModule } from 'app/shared/components/notifications';
import { DateMaskDirective } from 'app/shared/util/directive/dateMask.directive';
import { AutofocusDirective } from 'app/shared/util/directive/autofocus.directive';
import { ValidateOnBlurDirective } from 'app/shared/util/directive/validateOnBlur.directive';
import { FocusDirective } from 'app/shared/util/directive/focus.directive';
import { SafetyDialogModule } from 'app/shared/components/dialog';

import { CategoryDividerModule } from './components/category-divider';
import { HelpDialogComponent } from './components/help/help.component';
import { InputFileComponent } from './components/input-file/input-file.component';
import { ListActionBarComponent } from './components/list-action-bar/list-action-bar.component';
import { WorkersManagementComponent } from './components/workers-management/workers-management.component';
import { CompanyComponent } from './components/company/company.component';
import { CategorizedListItemComponent } from 'app/shared/components/category-list/categorized-list-item/categorized-list-item.component';
import { CategorizedListComponent } from 'app/shared/components/category-list/categorized-list/categorized-list.component';
import { AddNewCategoryComponent } from 'app/shared/components/category-list/add-category/add-category.component';
import { CustomDateAdapter } from './util/CustomDateAdapter';
import { BoundSensorModule } from 'angular-bound-sensor';
import { AppMessageService } from 'app/shared/util/app-message.service';
import { ReactiveFormControlDisabledDirective } from 'app/shared/directives/reactive-form-control-disabled/reactive-form-control-disabled.directive';
import { TrimTextDirective } from 'app/shared/util/directive/trimText.directive';
import { DashboardHeaderComponent } from '../views/dashboard/dashboard-header/dashboard-header.component';
import { ProfileUserComponent } from './components/topnavbar/profile-user/profile-user.component';
import { TreeModule } from 'angular-tree-component';
import { TreeWraperComponent } from './components/tree-wraper/tree-wraper.component';
import { ChangeCompanyComponent } from 'app/shared/components/change-company/change-company.component';
import { CepService } from 'app/shared/services/cep.service';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MdNativeDateModule,
        Ng2FileDropModule,
        ModalGalleryModule.forRoot(),
        TextMaskModule,
        SafetyDialogModule,
        VirtualScrollModule,
        NotificationSidenavContainerModule,
        InfiniteScrollModule,
        ChartsModule,
        CategoryDividerModule,
        TreeModule,
    ],
    exports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        SafetyCardModule,
        TextMaskModule,
        SafetyDialogModule,
        VirtualScrollModule,
        NotificationSidenavContainerModule,
        InfiniteScrollModule,
        ChartsModule,
        CategoryDividerModule,

        CpfPipe,
        CnpjPipe,
        PhonePipe,
        BackendPathPipe,
        AuthPathPipe,
        ConeIdPipe,
        LimitPipe,
        IdWearablePipe,
        CbosRemoveSynonymLetterPipe,
        MyFilterPipe,
        MyFilterQualityPipe,
        FabComponent,
        TopnavbarComponent,
        ProfileDropdownComponent,
        NavigationComponent,
        BasicComponent,
        BasicTopNavBarLayoutComponent,
        SearchComponent,
        BlankComponent,
        ListItemComponent,
        DropFileComponent,
        CepPickerComponent,
        CnaePickerComponent,
        FabSpeedDialActionsComponent,
        FabSpeedDialComponent,
        FabSpeedDialTriggerComponent,
        DateMaskDirective,
        AutofocusDirective,
        FocusDirective,
        ValidateOnBlurDirective,
        TrimTextDirective,
        UpperCaseDirective,
        LowerCaseDirective,
        HelpDialogComponent,
        ChangeCompanyComponent,
        InputFileComponent,
        ListActionBarComponent,
        WorkersManagementComponent,
        CompanyComponent,
        AddNewCategoryComponent,
        CategorizedListComponent,
        CategorizedListItemComponent,
        BoundSensorModule,
        ReactiveFormControlDisabledDirective,
        TreeWraperComponent
    ],
    declarations: [
        CpfPipe,
        CnpjPipe,
        PhonePipe,
        BackendPathPipe,
        AuthPathPipe,
        ConeIdPipe,
        LimitPipe,
        IdWearablePipe,
        CbosRemoveSynonymLetterPipe,
        MyFilterPipe,
        MyFilterQualityPipe,
        FabComponent,
        TopnavbarComponent,
        ProfileDropdownComponent,
        NavigationComponent,
        BasicComponent,
        BasicTopNavBarLayoutComponent,
        SearchComponent,
        BlankComponent,
        ListItemComponent,
        DropFileComponent,
        CepPickerComponent,
        CnaePickerComponent,
        ConfirmDialogComponent,
        InfoDialogComponent,
        FabSpeedDialActionsComponent,
        FabSpeedDialComponent,
        FabSpeedDialTriggerComponent,
        DateMaskDirective,
        AutofocusDirective,
        FocusDirective,
        HelpDialogComponent,
        ChangeCompanyComponent,
        InputFileComponent,
        ListActionBarComponent,
        WorkersManagementComponent,
        CompanyComponent,
        AddNewCategoryComponent,
        CategorizedListComponent,
        CategorizedListItemComponent,
        ValidateOnBlurDirective,
        TrimTextDirective,
        UpperCaseDirective,
        LowerCaseDirective,
        ReactiveFormControlDisabledDirective,
        DashboardHeaderComponent,
        ProfileUserComponent,
        TreeWraperComponent

    ],
    entryComponents: [
        ConfirmDialogComponent,
        InfoDialogComponent,
        HelpDialogComponent,
        ChangeCompanyComponent,
        ProfileUserComponent,
    ],
    providers: [
        ConfirmDialogHandler,
        InfoDialogHandler,
        AppMessageService,
        CnpjPipe,
        { provide: DateAdapter, useClass: CustomDateAdapter },
        CepService
    ]
})
export class SharedModule { }
