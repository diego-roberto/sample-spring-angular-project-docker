import { isNullOrUndefined } from 'util';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, DoCheck } from '@angular/core';

import { CompanyDocumentation } from 'app/shared/models/company-documentation.model';

@Component({
  selector: 'company-documentation',
  templateUrl: './company-documentation.component.html',
  styleUrls: ['./company-documentation.component.scss']
})
export class CompanyDocumentationComponent implements OnInit, DoCheck {

  @Input() companyDocumentationList: CompanyDocumentation[];

  @Output() doSave: EventEmitter<void> = new EventEmitter<void>();
  @Output() companyDocumentationListChange = new EventEmitter<CompanyDocumentation[]>();

  companyDocumentationForm: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {
    this.companyDocumentationForm = this.formBuilder.array([]);
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    this.companyDocumentationListChange.emit(this.companyDocumentationList);
  }

  doAddFormToFormArray(event: FormGroup) {
    this.companyDocumentationForm.push(event);
    this.changeDetector.detectChanges();
  }

  doRemoveFormFromFormArray(event: FormGroup) {
    this.companyDocumentationForm.removeAt(this.companyDocumentationForm.getRawValue().indexOf(event));
  }

  doAddNewCompanyDocumentation() {
    this.companyDocumentationList.push(new CompanyDocumentation());
  }

  doRenewCompanyDocumentation(event: CompanyDocumentation) {
    const companyDocumentation = new CompanyDocumentation();
    companyDocumentation.description = event.description;
    if (isNullOrUndefined(event.originRenew)) {
      companyDocumentation.originRenew = event;
    } else {
      companyDocumentation.originRenew = event.originRenew;
    }
    this.companyDocumentationList.push(companyDocumentation);
    this.changeDetector.detectChanges();
  }

  doRemoveCompanyDocumentation(event: CompanyDocumentation) {
    this.companyDocumentationList = this.companyDocumentationList.filter(companyDocumentation => companyDocumentation !== event);
  }

  save() {
    this.doSave.emit();
  }

}
