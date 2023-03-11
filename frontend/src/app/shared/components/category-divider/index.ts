import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
    CategoryDividerComponent,
    CategoryDividerLeftComponent,
    CategoryDividerCenterComponent,
    CategoryDividerRightComponent
} from './category-divider.component';

@NgModule({
    imports: [
        FlexLayoutModule,
    ],
    exports: [
        CategoryDividerComponent,
        CategoryDividerLeftComponent,
        CategoryDividerCenterComponent,
        CategoryDividerRightComponent
    ],
    declarations: [
        CategoryDividerComponent,
        CategoryDividerLeftComponent,
        CategoryDividerCenterComponent,
        CategoryDividerRightComponent
    ]
})
export class CategoryDividerModule { }

export * from './category-divider.component';
