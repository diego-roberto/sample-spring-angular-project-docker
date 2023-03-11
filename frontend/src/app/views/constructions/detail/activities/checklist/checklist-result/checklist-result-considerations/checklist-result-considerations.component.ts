import { Component, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { ChecklistInfo } from 'app/shared/models/checklist-info';

@Component({
    selector: 'checklist-result-considerations',
    templateUrl: './checklist-result-considerations.component.html',
    styleUrls: ['./checklist-result-considerations.component.scss']
})
export class ChecklistResultConsiderationsComponent {

    @Input() checklistInfos: ChecklistInfo;

    @ViewChild('checklistResultConsiderationsCard') checklistResultConsiderationsCard: SafetyCardComponent;

    readonly title = 'CONSIDERAÇÕES';

    considerationsForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.considerationsForm = this.fb.group({
            considerations: new FormControl({ value: '' }),
        });
    }

}
