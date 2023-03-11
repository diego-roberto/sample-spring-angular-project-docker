import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { UtilValidators } from 'app/shared/util/validators.util';
import { MaskUtil } from 'app/shared/util/mask.util';
import { isNullOrUndefined } from 'util';

import { CnaePickerComponent } from 'app/shared/components/cnae-picker/cnae-picker.component';

import { SupplierService } from 'app/shared/services/supplier.service';

import { Cnae } from 'app/shared/models/cnae.model';
import { Supplier } from 'app/shared/models/supplier.model';

@Component({
  selector: 'supplier-data-form',
  templateUrl: './supplier-data-form.component.html',
  styleUrls: ['./supplier-data-form.component.scss']
})
export class SupplierDataFormComponent {

    @Input() supplier: Supplier;

    @Output() doSave: EventEmitter<Supplier> = new EventEmitter();

    @ViewChild('cnaePicker') cnaePicker: CnaePickerComponent;

    supplierForm: FormGroup;

    corporateNameMaxLength = 50;
    traddingNameMaxLength = 50;
    addressStreetMaxLength = 255;
    addressNumberMaxLength = 10;
    addressComplementMaxLength = 20;
    urlDomainMaxLength = 30;

    supplierUrlDomainOnEdit = false;
    focusOnUrlInputField = false;
    httpProtocolRegex = /http[s]?:[/]{2}.*/g;

    cnaeMask = MaskUtil.cnaeMask;
    cnpjMask = MaskUtil.cnpjMask;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.supplierForm = this.formBuilder.group({
            cnpj: new FormControl('', Validators.compose([Validators.required, UtilValidators.cnpj])),
            corporateName: new FormControl('', [Validators.maxLength(this.corporateNameMaxLength)]),
            traddingName: new FormControl('', [Validators.required, Validators.maxLength(this.traddingNameMaxLength)]),
            cnaeDescription: new FormControl({value: '', disabled: true}, []),
            cep: new FormControl('', []),
            addressStreet: new FormControl({value: '', disabled: true}, [Validators.maxLength(this.addressStreetMaxLength)]),
            addressNumber: new FormControl('', [Validators.maxLength(this.addressNumberMaxLength)]),
            addressComplement: new FormControl('', [Validators.maxLength(this.addressComplementMaxLength)]),
            urlDomain: new FormControl('', [Validators.maxLength(this.urlDomainMaxLength)])
        });
    }

    save() {
        this.doRemoveCnpjMask(this.supplier);
        const supplier = Object.assign(
            new Supplier(),
            this.supplier
        );
        this.doSave.emit(supplier);
    }

    isEditionMode(): boolean {
        return this.supplier !== undefined && this.supplier.id !== undefined;
    }

    onSelectFile(file) {
        this.supplier.logoFile = file;
    }

    onRemoveFile() {
        this.supplier.logoUrl = undefined;
        this.supplier.logoFileName = undefined;
    }

    onCepSearch(data) {
      if (data) {
        this.supplier.cep = data.cep;
        this.supplier.addressStreet = data.completeAdress;
      }
    }

    onCnaeSearch(data) {
        if (data) {
            this.supplier.cnae = new Cnae().initializeWithJson(data);
        }
    }

    doRemoveCnpjMask(supplier: Supplier) {
        if (supplier && supplier.cnpj) {
            supplier.cnpj = supplier.cnpj.replace(/[^\d]+/g, '');
        }
    }

    onBlurCnpj() {
        if (this.supplierForm.controls.cnpj.hasError('cnpj')) {
            this.supplier.corporateName = null;
            this.supplier.traddingName = null;
        }
    }

    setSupplierUrlDomainOnEdit(onEdit: boolean) {
        this.supplierUrlDomainOnEdit = onEdit;
        if (this.supplierUrlDomainOnEdit) {
            this.focusOnUrlInputField = true;
        }
    }

    isSupplierUrlDomainOnEdit(): boolean {
        return this.supplierUrlDomainOnEdit || isNullOrUndefined(this.supplier.urlDomain) || this.supplier.urlDomain === '';
    }

    normalizeUrlDomainProtocol(urlDomain: string): string {
        if (isNullOrUndefined(urlDomain.match(this.httpProtocolRegex))) { return 'http://' + urlDomain; }
        return urlDomain;
    }
}
