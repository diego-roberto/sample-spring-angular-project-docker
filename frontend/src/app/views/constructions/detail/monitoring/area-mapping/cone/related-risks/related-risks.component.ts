import { Component, Input, Output, OnDestroy, EventEmitter, SimpleChange, SimpleChanges, Optional, OnChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Risk } from 'app/shared/models/risk.model';
import { RiskTypes } from 'app/shared/models/risk-types.model';
import { RiskFactors } from 'app/shared/models/risk-factors.model';
import { RiskFactorsService } from 'app/shared/services/risk-factors.service';
import { RiskTypesService } from 'app/shared/services/risk-types.service';

@Component({
    selector: 'related-risks',
    styleUrls: ['related-risks.component.scss'],
    templateUrl: 'related-risks.component.html'
})

export class RelatedRisksComponent implements OnInit, OnChanges, OnDestroy {

    readonly formRisks: FormGroup;

    @Input() viewMode = false;

    @Input() riskTypes: RiskTypes[] = [];

    @Input() riskFactors: RiskFactors[] = [];

    @Input()
    get risks(): Risk[] {
        return this.risksValue;
    }
    set risks(risks: Risk[]) {
        this.risksValue = !risks ? [] : risks;
        this.risksChange.emit(this.risksValue);
    }

    @Output() readonly validChange = new EventEmitter<boolean>();

    @Output() readonly risksChange = new EventEmitter<Risk[]>();

    private readonly ngUnsubscribe = new Subject();

    private risksValue: Risk[] = [];

    constructor(private fb: FormBuilder) {
        this.formRisks = this.fb.group({
            risks: this.fb.array([], this.hasAtLeastOneRisk.bind(this))
        });

        this.formRisks.statusChanges.takeUntil(this.ngUnsubscribe).subscribe((status) => {
            this.validChange.emit(this.formRisks.valid || this.formRisks.disabled);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.risks && changes.risks.isFirstChange()) {
            this.risks.forEach(risk => this.getFormArray().push(this.initForm()));
        }

        if (changes.viewMode) {
            if (this.viewMode) {
                this.formRisks.disable();
            } else {
                this.formRisks.enable();
            }
        }
    }

    ngOnInit() { }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
    }

    filterItemsByType(risk: Risk) {
        if (risk.riskType) {
            return this.riskFactors.filter(x => x.riskType.id === risk.riskType.id);
        }
        return null;
    }

    riskTypeChange(riskTypeId, index) {
        if (riskTypeId && this.riskTypes.length > 0) {
            const localRisk = this.risks[index];
            if (localRisk.riskType && localRisk.riskType.id !== riskTypeId) {
                localRisk.riskFactor = new RiskFactors();
            }
            localRisk.riskType = this.riskTypes.find(x => x.id === riskTypeId);
        }
    }

    riskFactorChange(riskFactorId, index) {
        if (riskFactorId && this.riskFactors.length > 0) {
            this.risks[index].riskFactor = this.riskFactors.find(x => x.id === riskFactorId);
        }
    }

    levelDescription(level: number) {
        const typeLevel = this.levelTypes.find(levelType => levelType.id === level);
        return typeLevel ? typeLevel.value : null;
    }

    get levelTypes() {
        return Risk.levelTypes;
    }

    riskForm(index: number): FormGroup {
        return <FormGroup>this.getFormArray().controls[index];
    }

    addRisk(risk: Risk = new Risk()) {
        this.getFormArray().push(this.initForm());
        const toAdd = risk;
        this.risks.push(toAdd);
    }

    removeRisk(index) {
        this.risks.splice(index, 1);
        this.removeForm(index);
    }

    private initForm(): FormGroup {
        return this.fb.group({
            riskType: new FormControl('', [Validators.required]),
            levelType: new FormControl('', [Validators.required]),
            riskFactor: new FormControl('', [Validators.required])
        });
    }

    private removeForm(i: number) {
        this.getFormArray().removeAt(i);
    }

    private getFormArray(): FormArray {
        return <FormArray>this.formRisks.controls.risks;
    }

    hasAtLeastOneRisk(control: AbstractControl) {
        return this.risks && this.risks.length > 0 ? null : { error: 'No risk found' };
    }
}
