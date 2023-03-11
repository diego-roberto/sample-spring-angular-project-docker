import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MdSlideToggleChange, MdRadioChange } from '@angular/material';

import { isNullOrUndefined } from 'util';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';

import { ConstructionDocumentation } from 'app/shared/models/construction-documentation.model';

@Component({
  selector: 'construction-documentation-item',
  templateUrl: './construction-documentation-item.component.html',
  styleUrls: ['./construction-documentation-item.component.scss']
})
export class ConstructionDocumentationItemComponent implements OnInit {

  @Input() constructionDocumentation: ConstructionDocumentation;

  @Output() addFormToFormArrayOfParent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() removeFormFromFormArrayOfParent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() renewConstructionDocumentationEvent: EventEmitter<ConstructionDocumentation> = new EventEmitter<ConstructionDocumentation>();
  @Output() removeConstructionDocumentationEvent: EventEmitter<ConstructionDocumentation> = new EventEmitter<ConstructionDocumentation>();

  constructionDocumentationForm: FormGroup;

  descriptionMaxLength = 150;

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private confirmDialogHandler: ConfirmDialogHandler
  ) {
    this.constructionDocumentationForm = this.formBuilder.group({
      description: new FormControl(undefined, Validators.compose([Validators.required, Validators.maxLength(this.descriptionMaxLength)])),
      dueDate: new FormControl(undefined, [Validators.required, this.validateDueDate()]),
      accessBlocked: undefined
    });
  }

  ngOnInit() {
    this.constructionDocumentationForm.controls.accessBlocked = new FormControl(this.constructionDocumentation.accessBlocked, []);
    this.addFormToFormArrayOfParent.emit(this.constructionDocumentationForm);
  }

  showLateIcon(): boolean {
    return this.doCompareWithToday(this.constructionDocumentation.dueDate) === -1 &&
      isNullOrUndefined(this.constructionDocumentation.shelved) &&
      isNullOrUndefined(this.constructionDocumentation.shelvedAt) &&
      ! isNullOrUndefined(this.constructionDocumentation.id);
  }

  isFormDisabled(): boolean {
    return ! isNullOrUndefined(this.constructionDocumentation.shelved);
  }

  isDescriptionDisabled(): boolean {
    return ! isNullOrUndefined(this.constructionDocumentation.originRenew) && ! isNullOrUndefined(this.constructionDocumentation.originRenew.id);
  }

  accessBlockedSlideToggleChangeHandler(event: MdSlideToggleChange) {
    this.constructionDocumentation.accessBlocked = event.checked;
  }

  isRenewDisabled(): boolean {
    return isNullOrUndefined(this.constructionDocumentation.id);
  }

  canEditShelved(): boolean {
    return isNullOrUndefined(this.constructionDocumentation.id);
  }


  shelvedRadioGroupChangeHandler(event: MdRadioChange) {
    const action = event.value ? 'Arquivar' : 'Renovar';

    this.confirmDialogHandler.call(action + ' Documentação', 'ATENÇÃO! Após concluir está ação, não será mais possível editar este registro. Deseja continuar?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.constructionDocumentation.shelved = event.value;
        this.constructionDocumentation.shelvedAt = new Date();
        if (!this.constructionDocumentation.shelved) {
          this.renewConstructionDocumentationEvent.emit(this.constructionDocumentation);
        }
      } else {
        event.source.checked = false;
      }
    });
  }

  isShelvedRadioGroupDisabled(): boolean {
    return !this.constructionDocumentationForm.valid;
  }

  inputFileSelectHandler(event: File) {
    const fileReader = new FileReader();
    fileReader.onload = ((readFile: File) => {
      return (e) => {
        this.constructionDocumentation.file = readFile;
        this.constructionDocumentation.fileName = readFile.name;
      };
    })(event);
    fileReader.readAsDataURL(event);
  }

  inputFileUndoClearHandler(event: any) {
    this.constructionDocumentation.file = event.file;
    this.constructionDocumentation.fileName = event.fileName;
    this.constructionDocumentation.fileUrl = event.fileUrl;
  }

  inputFileClearHandler() {
    this.constructionDocumentation.file = undefined;
    this.constructionDocumentation.fileName = undefined;
    this.constructionDocumentation.fileUrl = undefined;
  }

  doRemove() {
    this.confirmDialogHandler.call('Excluir Documentação', 'ATENÇÃO! Deseja realmente excluir este registro?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.removeConstructionDocumentationEvent.emit(this.constructionDocumentation);
        this.removeFormFromFormArrayOfParent.emit(this.constructionDocumentationForm);
      }
    });
  }

  private validateDueDate() {
    return (control: FormControl) => {
      if (
        isNullOrUndefined(control) ||
        isNullOrUndefined(control.parent) ||
        isNullOrUndefined(control.value)
      ) {
        return null;
      }

      if (isNullOrUndefined(this.constructionDocumentation.id) && this.doCompareWithToday(control.value) === -1) {

        return { beforeToday: true };
      }

      return null;
    };
  }

  private doCompareWithToday(date: Date): number {
      if (isNullOrUndefined(date)) { return; }

      const today = new Date(this.datePipe.transform(new Date(), 'MM/dd/yyyy'));
      const dateToCompare = new Date(this.datePipe.transform(date, 'MM/dd/yyyy'));

      if (dateToCompare < today) { return -1; }
      if (dateToCompare > today) { return 1; }

      return 0;
  }

}
