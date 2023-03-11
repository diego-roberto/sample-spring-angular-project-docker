import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, Input, EventEmitter, Output, ViewChild, SimpleChanges } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { isNullOrUndefined } from 'util';

import { Worker } from 'app/shared/models/worker.model';
import { MaskUtil } from 'app/shared/util/mask.util';
import { Security } from 'app/shared/models/security.model';
import { FormBase } from 'app/shared/util/generic/form/form-base';
import { EventSave } from 'app/shared/util/generic/form/event-save';
import { UtilValidators } from 'app/shared/util/validators.util';
import { WorkerItemResolver } from 'app/resolves/worker-item.resolver';
import { WorkerFormBase } from '../worker-generic/worker-form-base';

@Component({
    selector: 'security-works-form',
    templateUrl: './worker-security-form.component.html',
    styleUrls: ['./worker-security-form.component.scss']
})

export class SecurityWorksComponent extends WorkerFormBase<Security> {

    securityForm: FormGroup;

    readonly brigadistas = [
        { value: true, viewValue: 'Sim' },
        { value: false, viewValue: 'Não' },
    ];

    readonly cipeiros = [
        { value: true, viewValue: 'Sim' },
        { value: false, viewValue: 'Não' },
    ];

    readonly laborsInCipa = [
        { value: '1', viewValue: 'Membro Suplente' },
        { value: '2', viewValue: 'Membro Efetivo' },
        { value: '3', viewValue: 'Presidente' },
        { value: '4', viewValue: 'Vice Presidente' },
        { value: '5', viewValue: 'Secretário' },
    ];

    datePickerMandateBeginDisable = false;
    datePickerMandateEndDisable = false;

    @Output() savedWorkerSecurity: EventEmitter<EventSave<Worker>> = new EventEmitter();

    constructor(protected workerItemResolver: WorkerItemResolver, private fb: FormBuilder) {
        super(workerItemResolver);

        const defaultCipeiro = isNullOrUndefined(this.model.cipeiro) ? false : this.model.cipeiro;
        const defaultBrigadista = isNullOrUndefined(this.model.brigade) ? false : this.model.brigade;

        this.securityForm = this.fb.group({
            cipeiro: new FormControl({ value: defaultCipeiro }, Validators.required),
            brigadistas: new FormControl({ value: defaultBrigadista }, Validators.required),
            laborsInCipa: new FormControl({ value: '', disabled: !this.model.cipeiro }, Validators.required),
            mandateBegin: new FormControl({ value: '', disabled: !this.model.cipeiro }, [UtilValidators.date, this.validateRange]),
            mandateEnd: new FormControl({ value: '', disabled: !this.model.cipeiro }, [UtilValidators.date, this.validateRange])
        });

        this.synchronizeRangeValidation();
    }

    synchronizeRangeValidation(): void {
        this.securityForm.controls.mandateEnd.statusChanges.subscribe((status) => {
            this.securityForm.controls.mandateBegin.updateValueAndValidity({ emitEvent: false });
        });

        this.securityForm.controls.mandateBegin.statusChanges.subscribe((status) => {
            this.securityForm.controls.mandateEnd.updateValueAndValidity({ emitEvent: false });
        });
    }

    // CalledOnTemplate
    save() {
        this.savedWorkerSecurity.emit({
            modelToSave: this.model, onSaved: (savedWorker: Worker) => {
                this.securityForm.updateValueAndValidity();
            }
        });
    }

    // CalledOnTemplate
    disableCipeiroDependencies() {
        this.securityForm.controls.laborsInCipa.reset({ value: '', disabled: !this.model.cipeiro });
        this.securityForm.controls.mandateBegin.reset({ value: '', disabled: !this.model.cipeiro });
        this.securityForm.controls.mandateEnd.reset({ value: '', disabled: !this.model.cipeiro });
    }

    // CalledByForm
    validateRange(control: AbstractControl): any {
        // Essa validação existe para cenários onde o form chama o método de validação
        // quando ainda não instanciou todos os componentes.
        if (isNullOrUndefined(control) || isNullOrUndefined(control.parent) ||
            isNullOrUndefined(control.parent.controls['mandateBegin']) ||
            isNullOrUndefined(control.parent.controls['mandateEnd'])) {
            return null;
        }

        let dateBegin = control.parent.controls['mandateBegin'].value;
        let dateEnd = control.parent.controls['mandateEnd'].value;
        dateBegin = (dateBegin === '' ? null : dateBegin);
        dateEnd = (dateEnd === '' ? null : dateEnd);

        if (!isNullOrUndefined(dateBegin) && !isNullOrUndefined(dateEnd) && dateBegin >= dateEnd) {
            return { invalidRange: true };
        }

        return null;
    }

    // Override
    protected create(): Security {
        return new Security();
    }
}
