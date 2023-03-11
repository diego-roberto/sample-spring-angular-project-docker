import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { MaskUtil } from 'app/shared/util/mask.util';

import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { ChecklistInfo } from 'app/shared/models/checklist-info';

@Component({
    selector: 'checklist-result-construction',
    templateUrl: './checklist-result-construction.component.html',
    styleUrls: ['./checklist-result-construction.component.scss']
})
export class ChecklistResultConstructionComponent {

    @Input()
    set checklistInfos(checklistInfos: ChecklistInfo) { this._checklistInfos = checklistInfos; }
    get checklistInfos(): ChecklistInfo { return this._checklistInfos; }

    @ViewChild('checklistResultConstructionCard') checklistResultConstructionCard: SafetyCardComponent;

    _checklistInfos: ChecklistInfo;

    ceiMask = MaskUtil.ceiMask;
    phoneMask = MaskUtil.phoneMask;

    readonly title = 'DADOS DA OBRA';

    constructionForm: FormGroup;

    constructor(private fb: FormBuilder) {

        this.constructionForm = this.fb.group({
            name: new FormControl({ value: '', disabled: true }),
            cei: new FormControl({ value: '', disabled: true }),
            address: new FormControl({ value: '', disabled: true }),
            contact: new FormControl({ value: '', disabled: true }),
            phone: new FormControl({ value: '', disabled: true }),
            email: new FormControl({ value: '', disabled: true }),
            numWorkers: new FormControl({ value: '', disabled: true })
        });
    }

}
