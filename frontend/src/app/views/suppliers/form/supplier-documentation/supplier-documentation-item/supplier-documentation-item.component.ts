import { MdSlideToggleChange, MdRadioChange } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { isNullOrUndefined } from 'util';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { UtilValidators } from 'app/shared/util/validators.util';

import { SupplierDocumentation } from 'app/shared/models/supplier-documentation.model';

@Component({
  selector: 'supplier-documentation-item',
  templateUrl: './supplier-documentation-item.component.html',
  styleUrls: ['./supplier-documentation-item.component.scss']
})
export class SupplierDocumentationItemComponent implements OnInit {

  @Input() supplierDocumentation: SupplierDocumentation;

  @Output() addFormToFormArrayOfParent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() removeFormFromFormArrayOfParent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() renewSupplierDocumentationEvent: EventEmitter<SupplierDocumentation> = new EventEmitter<SupplierDocumentation>();
  @Output() removeSupplierDocumentationEvent: EventEmitter<SupplierDocumentation> = new EventEmitter<SupplierDocumentation>();

  supplierDocumentationForm: FormGroup;

  descriptionMaxLength = 150;

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private confirmDialogHandler: ConfirmDialogHandler
  ) {
    this.supplierDocumentationForm = this.formBuilder.group({
      description: new FormControl(undefined, Validators.compose([Validators.required, Validators.maxLength(this.descriptionMaxLength)])),
      dueDate: new FormControl(undefined, [Validators.required,this.validateDueDate()]),
      accessBlocked: undefined
    });
  }

  ngOnInit() {
    this.supplierDocumentationForm.controls.accessBlocked = new FormControl(this.supplierDocumentation.accessBlocked, []);
    this.addFormToFormArrayOfParent.emit(this.supplierDocumentationForm);
  }

  showLateIcon(): boolean {
    return this.doCompareWithToday(this.supplierDocumentation.dueDate) === -1 &&
      isNullOrUndefined(this.supplierDocumentation.shelved) &&
      isNullOrUndefined(this.supplierDocumentation.shelvedAt) &&
      ! isNullOrUndefined(this.supplierDocumentation.id);
  }

  isFormDisabled(): boolean {
    return ! isNullOrUndefined(this.supplierDocumentation.shelved);
  }

  isDescriptionDisabled(): boolean {
    return ! isNullOrUndefined(this.supplierDocumentation.originRenew) && ! isNullOrUndefined(this.supplierDocumentation.originRenew.id);
  }

  accessBlockedSlideToggleChangeHandler(event: MdSlideToggleChange) {
    this.supplierDocumentation.accessBlocked = event.checked;
  }

  isRenewDisabled(): boolean {
    return isNullOrUndefined(this.supplierDocumentation.id);
  }

  canEditShelved():boolean{
    return isNullOrUndefined(this.supplierDocumentation.id);
  }


  shelvedRadioGroupChangeHandler(event: MdRadioChange) {
    const action = event.value ? 'Arquivar' : 'Renovar';

    this.confirmDialogHandler.call(action + ' Documentação', 'ATENÇÃO! Após concluir está ação, não será mais possível editar este registro. Deseja continuar?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.supplierDocumentation.shelved = event.value;
        this.supplierDocumentation.shelvedAt = new Date();
        if (!this.supplierDocumentation.shelved) {
          this.renewSupplierDocumentationEvent.emit(this.supplierDocumentation);
        }
      } else {
        event.source.checked = false;
      }
    });
  }

  isShelvedRadioGroupDisabled(): boolean {
    return !this.supplierDocumentationForm.valid;
  }

  inputFileSelectHandler(event: File) {
    const fileReader = new FileReader();
    fileReader.onload = ((readFile: File) => {
      return (e) => {
        this.supplierDocumentation.file = readFile;
        this.supplierDocumentation.fileName = readFile.name;
      };
    })(event);
    fileReader.readAsDataURL(event);
  }

  inputFileUndoClearHandler(event: any) {
    this.supplierDocumentation.file = event.file;
    this.supplierDocumentation.fileName = event.fileName;
    this.supplierDocumentation.fileUrl = event.fileUrl;
  }

  inputFileClearHandler() {
    this.supplierDocumentation.file = undefined;
    this.supplierDocumentation.fileName = undefined;
    this.supplierDocumentation.fileUrl = undefined;
  }

  doRemove() {
    this.confirmDialogHandler.call('Excluir Documentação', 'ATENÇÃO! Deseja realmente excluir este registro?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.removeSupplierDocumentationEvent.emit(this.supplierDocumentation);
        this.removeFormFromFormArrayOfParent.emit(this.supplierDocumentationForm);
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

      if (isNullOrUndefined(this.supplierDocumentation.id) && this.doCompareWithToday(control.value) === -1) {

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
