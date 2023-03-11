import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { SupplierContact } from 'app/shared/models/supplier-contact.model';
import { MaskUtil } from 'app/shared/util/mask.util';

@Component({
  selector: 'supplier-contact-form',
  templateUrl: './supplier-contact-form.component.html',
  styleUrls: ['./supplier-contact-form.component.scss']
})
export class SupplierContactFormComponent {

  @Input() supplierContact: SupplierContact;

  @Output() doSave: EventEmitter<SupplierContact> = new EventEmitter();

  supplierContactForm: FormGroup;

  nameMaxLength = 50;
  roleMaxLength = 30;
  emailMaxLength = 60;

  phoneFaxMask = MaskUtil.phoneMask;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.supplierContactForm = this.formBuilder.group({
            name: new FormControl('', [Validators.maxLength(this.nameMaxLength)]),
            role: new FormControl('', [Validators.maxLength(this.roleMaxLength)]),
            phone: new FormControl('', []),
            celphone: new FormControl('', []),
            email: new FormControl('', [Validators.maxLength(this.emailMaxLength)])
        });
    }

  save() {
    const supplierContact = Object.assign(
      new SupplierContact(),
      this.supplierContact
    );
    this.doSave.emit(supplierContact);
  }

}
