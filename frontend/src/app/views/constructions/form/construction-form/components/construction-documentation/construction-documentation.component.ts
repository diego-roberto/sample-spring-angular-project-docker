import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, DoCheck } from '@angular/core';

import { isNullOrUndefined } from 'util';
import { ConstructionFormBase } from 'app/views/constructions/form/construction-form/components/construction-generic/construction-form-base';
import { ConstructionItemResolver } from 'app/resolves/construction.item.resolver';

import { ConstructionDocumentationModel } from 'app/views/constructions/form/construction-form/components/construction-documentation/construction-documentation.model';
import { ConstructionDocumentation } from 'app/shared/models/construction-documentation.model';

@Component({
  selector: 'construction-documentation',
  templateUrl: './construction-documentation.component.html',
  styleUrls: ['./construction-documentation.component.scss']
})
export class ConstructionDocumentationComponent extends ConstructionFormBase<ConstructionDocumentationModel> {

  @Output() doSave: EventEmitter<{ modelToSave: ConstructionDocumentationModel }> = new EventEmitter<{ modelToSave: ConstructionDocumentationModel }>();

  @Input() constructionDocumentationList: ConstructionDocumentation[];

  constructionDocumentationForm: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    public constructionItemResolver: ConstructionItemResolver
  ) {
    super(constructionItemResolver);
    if (this.model.constructionDocumentationList === undefined) { this.model.constructionDocumentationList = []; }
    // this.constructionDocumentationList = this.model.constructionDocumentationList;
    this.constructionDocumentationForm = this.formBuilder.array([]);
  }

  protected create(): ConstructionDocumentationModel {
    return new ConstructionDocumentationModel();
  }

  doAddFormToFormArray(event: FormGroup) {
    this.constructionDocumentationForm.push(event);
    this.changeDetector.detectChanges();
  }

  doRemoveFormFromFormArray(event: FormGroup) {
    this.constructionDocumentationForm.removeAt(this.constructionDocumentationForm.getRawValue().indexOf(event));
  }

  doAddNewConstructionDocumentation() {
    this.constructionDocumentationList.push(new ConstructionDocumentation());
  }

  doRenewConstructionDocumentation(event: ConstructionDocumentation) {
    const constructionDocumentation = new ConstructionDocumentation();
    constructionDocumentation.description = event.description;
    if (isNullOrUndefined(event.originRenew)) {
      constructionDocumentation.originRenew = event;
    } else {
      constructionDocumentation.originRenew = event.originRenew;
    }
    this.constructionDocumentationList.push(constructionDocumentation);
    this.changeDetector.detectChanges();
  }

  doRemoveConstructionDocumentation(event: ConstructionDocumentation) {
    this.constructionDocumentationList = this.constructionDocumentationList.filter(constructionDocumentation => constructionDocumentation !== event);
  }

  save() {
    this.model.constructionDocumentationList = this.constructionDocumentationList;
    this.doSave.emit({ modelToSave: this.model });
  }

}
