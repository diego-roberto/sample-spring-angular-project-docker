import { Component, EventEmitter, Output, Input, OnInit, OnChanges } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators } from '@angular/forms';

import { UtilValidators } from 'app/shared/util/validators.util';
import { MaskUtil } from 'app/shared/util/mask.util';
import { CepService } from 'app/shared/services/cep.service';

@Component({
    selector: 'cep-picker',
    templateUrl: './cep-picker.component.html',
    styleUrls: ['./cep-picker.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: CepPickerComponent, multi: true }
    ]
})
export class CepPickerComponent implements ControlValueAccessor, OnInit, OnChanges {

    @Output() onSearch = new EventEmitter();
    @Input('required') set requiredFlag(required: boolean) {
        if (required) {
            this.control.setValidators([Validators.required, UtilValidators.cep]);
        }
        this.required = required;
    }
    @Input() isDisabled: boolean;
    @Input() cep: string;
    
    cepModel: string;

    loadingCep = false;
    required = false;

    cepMask = MaskUtil.cepMask;
    control: FormControl = new FormControl();

    constructor(public snackBar: MdSnackBar,
                private serviceCep: CepService) { }

    ngOnChanges(){
      this.cepModel = this.cep;
      if(this.isDisabled){
        this.control.disable();
      }else{
        this.control.enable();
      }
    }

    ngOnInit() {
        this.cepModel = this.cep;
            this.control.setValidators(UtilValidators.cep);
            this.control.valueChanges.subscribe(value => {
                if (!value || value.replace(/[^\d]+/g, '').length < 8) {
                    this.onSearch.emit({
                        completeAdress: '',
                        street: '',
                        neighborhood: '',
                        city: '',
                        state: '',
                        cep: this.control.value
                    });
                }
            });
    }

    writeValue(value: any) {
        this.control.setValue(value);
    }

    registerOnChange(fn: (value: any) => void) {
        this.control.valueChanges.subscribe(fn);
    }

    registerOnTouched() { 
        //
    }

    searchCep() {
        this.loadingCep = true;
        this.serviceCep.cep(this.control.value)
            .then(data => 
                this.onSearch.emit({
                    completeAdress: String(
                        (data.street ? data.street + ' , ' : '') +
                        (data.neighborhood ? data.neighborhood + ' - ' : '') +
                        data.city + ' / ' +
                        data.state
                    ),
                    street: data.street,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    state: data.state,
                    cep: data.cep.replace("-", "")
                })
            ).catch(() => {
                this.snackBar.open('CEP não encontrado!', null, { duration: 3000 });
            }
            ).then(() => {
                this.loadingCep = false;
            });
    }

    onBlur() {
        if (this.control.value && this.control.value.replace(/[^\d]+/g, '').length === 8) {
            this.searchCep();
        }
    }

}
