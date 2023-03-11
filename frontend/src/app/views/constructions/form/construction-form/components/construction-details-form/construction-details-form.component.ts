import { Component, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { EventSave } from 'app/shared/util/generic/form/event-save';
import { MaskUtil } from 'app/shared/util/mask.util';
import { Construction } from 'app/shared/models/construction.model';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';
import { UtilValidators } from 'app/shared/util/validators.util';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { ConstructionDetails } from 'app/views/constructions/form/construction-form/components/construction-details-form/construction-details-form.model';
import { ConstructionFormBase } from 'app/views/constructions/form/construction-form/components/construction-generic/construction-form-base';
import { environment } from 'environments/environment';

@Component({
    selector: 'construction-details-form',
    templateUrl: './construction-details-form.component.html',
    styleUrls: ['./construction-details-form.component.scss']
})
export class ConstructionDetailsFormComponent extends ConstructionFormBase<ConstructionDetails> {

    supportedFileTypes: string[] = ['image/png', 'image/jpeg', 'application/pdf'];
    constructionForm: FormGroup;
    touched = false;
    ceiMask = MaskUtil.ceiMask;
    number = MaskUtil.variableLengthMask(MaskUtil.NUMBER, 10);
    isSaving = false;
    constructionDescMaxLength = 1200;

    @ViewChild('fileInput') private fileInput: ElementRef;

    @Output() saved: EventEmitter<EventSave<Construction>> = new EventEmitter();

    availableStatuses = [
        { label: 'em andamento', value: 0, icon: 'andamento', statusClass: 'warn' },
        { label: 'paralisada', value: 1, icon: 'paralisadas', statusClass: 'danger' },
        { label: 'finalizada', value: 2, icon: 'finalizadas', statusClass: 'success' }
    ];

    constructor(
        private fb: FormBuilder,
        public constructionItemResolver: ConstructionItemResolver,
        public confirmDialogHandler: ConfirmDialogHandler,
        public snackBar: MdSnackBar
    ) {
        super(constructionItemResolver);

        this.constructionForm = this.fb.group({
            name: new FormControl('', [Validators.required]),
            cep: new FormControl(this.model.cep, UtilValidators.cep),
            address: new FormControl('', []),
            number: new FormControl('', []),
            complement: new FormControl('', []),
            cei: new FormControl('', []),
            status: new FormControl('', [Validators.required]),
            descripton: new FormControl('', [])
        });
    }

    protected create(): ConstructionDetails {
        return new ConstructionDetails();
    }

    processFile(file: File) {
        if (file.size < 52428800) {
            const fileReader = new FileReader();
            this.model.ceiFile = file;
            fileReader.onload = ((theFile) => {
                return (e) => {
                    this.model.ceiFileName = theFile.name;
                    this.fileInput.nativeElement.value = '';
                };
            })(file);
            fileReader.readAsDataURL(file);
        } else {
            this.handleError('arquivo excede o limite de tamanho!');
            this.fileInput.nativeElement.value = '';
        }
    }

    onStatusChanged(value: number) {
        this.model.status = value;
    }

    onCepSearch(data) {
        this.model.cep = data.cep;
        this.model.addressStreet = data.completeAdress;
    }

    onLogoChange(file: File) {
        this.model.logoFile = file;
    }

    onLogoRemoved() {
        this.model.logoFileName = null;
        this.model.logoFile = null;
        this.model.logoUrl = null;
    }
    
    getLogoUrl() {
        if (this.model.logoUrl) {
          return environment.backendUrl + this.model.logoUrl + '?t=' + this.model.logoFileName;
        } else {
          return '';
        }
    }

    removeCei() {
        this.confirmDialogHandler.call('excluir', 'Deseja realmente excluir cei?').subscribe((confirm) => {
            if (confirm) {
                this.model.ceiFile = null;
                this.model.ceiFileName = null;
                this.model.ceiUrl = null;
            }
        });
    }

    save() {
        this.isSaving = !this.isSaving;
        this.saved.emit({
            modelToSave: this.model,
            onSaved: () => {
                this.isSaving = !this.isSaving;
            },
            onError: () => {
                this.isSaving = !this.isSaving;
            }
        });
    }

    dropDownValidator() {
        if (!this.touched) {
            return false;
        } else if (this.constructionForm.controls.status.errors) {
            return true;
        } else {
            return false;
        }
    }

    touch() {
        this.touched = true;
    }

    private handleError(msg) {
        this.snackBar.open(msg, null, { duration: 3000 });
    }
}
