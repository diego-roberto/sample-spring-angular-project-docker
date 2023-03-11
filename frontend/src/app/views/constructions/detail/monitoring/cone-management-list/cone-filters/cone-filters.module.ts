import { ConeFilterTextSearch } from './cone-filter-text-search';
import { ConeFilterBattery } from './cone-filter-battery';
import { ConeFilterOption } from './cone-filter-option';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        ConeFilterBattery,
        ConeFilterOption,
        ConeFilterTextSearch
    ]
})
export class ConeFiltersModule { }
