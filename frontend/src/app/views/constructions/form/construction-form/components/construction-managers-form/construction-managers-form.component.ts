import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ResponsibleSafety } from 'app/shared/models/responsible-safety';
import { ResponsibleEngineer } from 'app/shared/models/responsible-engineer';
import { MaskUtil } from 'app/shared/util/mask.util';
import { UtilValidators } from 'app/shared/util/validators.util';
import { CompanyService } from 'app/shared/services/company.service';
import { Construction } from 'app/shared/models/construction.model';
import { EventSave } from 'app/shared/util/generic/form/event-save';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { ConstructionManagers } from 'app/views/constructions/form/construction-form/components/construction-managers-form/construction-managers-form.model';
import { ConstructionFormBase } from 'app/views/constructions/form/construction-form/components/construction-generic/construction-form-base';

@Component({
    selector: 'construction-managers-form',
    templateUrl: './construction-managers-form.component.html',
    styleUrls: ['./construction-managers-form.component.scss']
})
export class ConstructionManagersFormComponent extends ConstructionFormBase<ConstructionManagers> implements OnInit {

    managersForm: FormGroup;

    @Output() saved: EventEmitter<EventSave<Construction>> = new EventEmitter();

    phoneMask = MaskUtil.phoneMask;
    emailValidator = '';

    constructor(
        private fb: FormBuilder,
        public constructionItemResolver: ConstructionItemResolver
    ) {
        super(constructionItemResolver);

        this.managersForm = this.fb.group({
            engineerName: new FormControl('', [Validators.required]),
            engineerPhone: new FormControl('', [UtilValidators.phone]),
            engineerEmail: new FormControl('', [Validators.required, UtilValidators.email]),
            safetyName: null,
            safetyPhone: new FormControl('', [UtilValidators.phone]),
            safetyEmail: new FormControl('', [UtilValidators.email])
        });
    }

    protected create(): ConstructionManagers {
        return new ConstructionManagers();
    }

    ngOnInit(): void {
    }

    save() {
        if (this.model.responsibleEngineer) {
            this.model.responsibleEngineer.id = this.model.responsibleEngineer.id;
        }
        this.model.responsibleEngineer = this.model.responsibleEngineer;

        if (this.model.responsibleSafety) {
            this.model.responsibleSafety.id = this.model.responsibleSafety.id;
        }
        if (this.model.responsibleSafety.name && this.model.responsibleSafety.email) {
            this.model.responsibleSafety = this.model.responsibleSafety;
        }
        this.saved.emit({ modelToSave: this.model, onSaved: null });
    }

    requiredResponsibleSafety() {
        this.managersForm.updateValueAndValidity();
        if (this.model.responsibleSafety.email || this.model.responsibleSafety.name) {
            return true;
        } else {
            return false;
        }
    }

    safetyEmailValidator() {
        this.managersForm.updateValueAndValidity();
        if (!this.model.responsibleSafety.email &&
            this.model.responsibleSafety.name) {
            this.emailValidator = 'Campo Obrigatório.';
            return true;
        } else {
            if (this.managersForm.controls.safetyEmail.invalid) {
                if (!this.model.responsibleSafety.email) {
                    this.managersForm.controls.safetyEmail.setErrors(null);
                    return false;
                }
                this.emailValidator = 'E-mail Inválido.';
                return true;
            } else {
                return false;
            }
        }
    }

    disableEnableButton() {
        this.managersForm.updateValueAndValidity();
        return ((this.model.responsibleSafety.name !== '' && this.model.responsibleSafety.email === '') ||
            (this.model.responsibleSafety.name === '' && this.model.responsibleSafety.email !== '') ||
            (this.model.responsibleSafety.name !== '' && this.model.responsibleSafety.email === '') ||
            (this.model.responsibleSafety.name === '' && this.model.responsibleSafety.email !== ''));
    }

}
