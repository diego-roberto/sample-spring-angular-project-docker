import { OnInit, OnChanges, Component, EventEmitter, Output, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ConeIdPipe } from 'app/shared/pipes/common.pipe';
import { ConeService } from 'app/shared/services/cone.service';
import { UtilValidators } from 'app/shared/util/validators.util';
import { MaskUtil } from 'app/shared/util/mask.util';

@Component({
    selector: 'sensor-identification',
    styleUrls: ['sensor-identification.component.scss'],
    templateUrl: 'sensor-identification.component.html'
})

export class SensorIdentificationComponent implements OnChanges, OnDestroy {

    readonly sensorForm: FormGroup;

    @Input() viewMode = false;
    @Input() editMode = false;

    // Title two-way data bind
    @Input()
    get title(): string {
        return this.titleValue;
    }
    set title(title: string) {
        if (this.titleValue !== title) {
            this.titleChange.emit(title);
        }
        this.titleValue = title;
    }

    // Identification two-way data bind
    @Input()
    get identification(): string {
        return this.identificationValue;
    }
    set identification(identification: string) {
        identification = identification ? new ConeIdPipe().parse(identification) : identification;
        if (this.identificationValue !== identification) {
            this.identificationChange.emit(identification);
        }
        this.identificationValue = identification;
    }

    @Output() readonly identificationChange = new EventEmitter<string>();
    @Output() readonly titleChange = new EventEmitter<string>();
    @Output() readonly validChange = new EventEmitter<boolean>();

    private readonly ngUnsubscribe = new Subject();

    private titleValue: string;
    private identificationValue: string;

    constructor(
        private fb: FormBuilder,
        private coneService: ConeService
    ) {
        this.sensorForm = this.fb.group({
            title: this.fb.control('', [Validators.required]),
            identification: this.fb.control('',
                [Validators.required, UtilValidators.coneId],
                [this.existIdentification.bind(this)])
        });

        if (this.viewMode || this.editMode) {
            this.sensorForm.disable();
        }

        this.sensorForm.statusChanges.takeUntil(this.ngUnsubscribe).subscribe(status => {
            this.validChange.emit(this.sensorForm.valid || this.sensorForm.disabled);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.viewMode || changes.editMode) {
            if (this.viewMode || this.editMode) {
                this.sensorForm.disable();
            } else {
                this.sensorForm.enable();
            }
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.unsubscribe();
    }

    existIdentification() {
        return this.coneService.getConeByIdentification(this.identification.replace(/[^\d]+/g, '')).map((cone) => {
            return cone == null ? null : { existCone: cone };
        });
    }

    get coneIdMask() {
        return MaskUtil.coneIdMask;
    }
}
