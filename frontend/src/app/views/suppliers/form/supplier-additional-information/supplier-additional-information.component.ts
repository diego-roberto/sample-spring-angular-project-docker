import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Supplier } from 'app/shared/models/supplier.model';

@Component({
  selector: 'supplier-additional-information',
  templateUrl: './supplier-additional-information.component.html',
  styleUrls: ['./supplier-additional-information.component.scss']
})
export class SupplierAdditionalInformationComponent {

  @Input() supplier: Supplier;

  @Output() doSave: EventEmitter<Supplier> = new EventEmitter();

  supplierAdditionalInformationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.supplierAdditionalInformationForm = this.formBuilder.group({
      hasSesmt: new FormControl(undefined, []),
      hasCipa: new FormControl(undefined, []),
      employerNumber: new FormControl({ value: undefined, disabled: true }, []),
      isDesignatedCipa: new FormControl({ value: undefined, disabled: true }, [])
    });
  }

  save() {
    const supplier = Object.assign(
      new Supplier(),
      this.supplier
    );
    this.doSave.emit(supplier);
  }

  onDesignatedCipaChange(value: any): void {
    this.supplier.isDesignatedCipa = value;
  }

  onSesmtChange(value: any): void {
    this.supplier.hasSesmt = value;
  }

  onCipaChange(value: any): void {
    this.supplier.hasCipa = value;
    if (this.supplier.hasCipa) {
      this.supplier.isDesignatedCipa = undefined;
    } else {
      this.supplier.employerNumber = undefined;
    }
  }

  isEmployerNumberDisabled(): boolean {
    return ! this.isSupplierHasCipa();
  }

  isDesignatedCipaDisabled(): boolean {
    return this.isSupplierHasCipa();
  }

  isSupplierHasCipa(): boolean {
    return this.supplier && this.supplier.hasCipa;
  }

}
