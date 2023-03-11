import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, EventEmitter, Output, DoCheck } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { isNullOrUndefined } from 'util';

import { SupplierDocumentation } from 'app/shared/models/supplier-documentation.model';

import { SupplierDocumentationItemComponent } from './supplier-documentation-item/supplier-documentation-item.component';

@Component({
  selector: 'supplier-documentation',
  templateUrl: './supplier-documentation.component.html',
  styleUrls: ['./supplier-documentation.component.scss']
})
export class SupplierDocumentationComponent implements OnInit, DoCheck {

  @Input() supplierDocumentationList: SupplierDocumentation[];

  @Output() doSave: EventEmitter<void> = new EventEmitter<void>();
  @Output() supplierDocumentationListChange = new EventEmitter<SupplierDocumentation[]>();

  supplierDocumentationForm: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {
    this.supplierDocumentationForm = this.formBuilder.array([]);
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    this.supplierDocumentationListChange.emit(this.supplierDocumentationList);
  }

  doAddFormToFormArray(event: FormGroup) {
    this.supplierDocumentationForm.push(event);
    this.changeDetector.detectChanges();
  }

  doRemoveFormFromFormArray(event: FormGroup) {
    this.supplierDocumentationForm.removeAt(this.supplierDocumentationForm.getRawValue().indexOf(event));
  }

  doAddNewSupplierDocumentation() {
    this.supplierDocumentationList.push(new SupplierDocumentation());
  }

  doRenewSupplierDocumentation(event: SupplierDocumentation) {
    const supplierDocumentation = new SupplierDocumentation();
    supplierDocumentation.description = event.description;
    if (isNullOrUndefined(event.originRenew)) {
      supplierDocumentation.originRenew = event;
    } else {
      supplierDocumentation.originRenew = event.originRenew;
    }
    this.supplierDocumentationList.push(supplierDocumentation);
    this.changeDetector.detectChanges();
  }

  doRemoveSupplierDocumentation(event: SupplierDocumentation) {
    this.supplierDocumentationList = this.supplierDocumentationList.filter(supplierDocumentation => supplierDocumentation !== event);
  }

  save() {
    this.doSave.emit();
  }

}
