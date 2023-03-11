import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdSlideToggleChange, MdRadioChange } from '@angular/material';

import { isNullOrUndefined } from 'util';
import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';
import { UtilValidators } from 'app/shared/util/validators.util';

import { CompanyDocumentation } from 'app/shared/models/company-documentation.model';

import { ClientType } from 'app/shared/services/http-client.service';

@Component({
  selector: 'company-documentation-item',
  templateUrl: './company-documentation-item.component.html',
  styleUrls: ['./company-documentation-item.component.scss']
})
export class CompanyDocumentationItemComponent implements OnInit {

  @Input() companyDocumentation: CompanyDocumentation;

  @Output() addFormToFormArrayOfParent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() removeFormFromFormArrayOfParent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() renewCompanyDocumentationEvent: EventEmitter<CompanyDocumentation> = new EventEmitter<CompanyDocumentation>();
  @Output() removeCompanyDocumentationEvent: EventEmitter<CompanyDocumentation> = new EventEmitter<CompanyDocumentation>();

  companyDocumentationForm: FormGroup;

  clientType = ClientType.auth;
  descriptionMaxLength = 150;

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private confirmDialogHandler: ConfirmDialogHandler
  ) {
    this.companyDocumentationForm = this.formBuilder.group({
      description: new FormControl(undefined, Validators.compose([Validators.required, Validators.maxLength(this.descriptionMaxLength)])),
      dueDate: new FormControl(undefined, [Validators.required,this.validateDueDate()]),
      accessBlocked: undefined
    });
  }

  ngOnInit() {
    this.companyDocumentationForm.controls.accessBlocked = new FormControl(this.companyDocumentation.accessBlocked, []);
    this.addFormToFormArrayOfParent.emit(this.companyDocumentationForm);
  }

  showLateIcon(): boolean {
    return this.doCompareWithToday(this.companyDocumentation.dueDate) === -1 &&
      isNullOrUndefined(this.companyDocumentation.shelved) &&
      isNullOrUndefined(this.companyDocumentation.shelvedAt) &&
      ! isNullOrUndefined(this.companyDocumentation.id);
  }

  isFormDisabled(): boolean {
    return ! isNullOrUndefined(this.companyDocumentation.shelved);
  }

  isDescriptionDisabled(): boolean {
    return ! isNullOrUndefined(this.companyDocumentation.originRenew) && ! isNullOrUndefined(this.companyDocumentation.originRenew.id);
  }

  accessBlockedSlideToggleChangeHandler(event: MdSlideToggleChange) {
    this.companyDocumentation.accessBlocked = event.checked;
  }

  isRenewDisabled(): boolean {
    return isNullOrUndefined(this.companyDocumentation.id);
  }

  canEditShelved():boolean{
    return isNullOrUndefined(this.companyDocumentation.id);
  }

  shelvedRadioGroupChangeHandler(event: MdRadioChange) {
    const action = event.value ? 'Arquivar' : 'Renovar';

    this.confirmDialogHandler.call(action + ' Documentação', 'ATENÇÃO! Após concluir está ação, não será mais possível editar este registro. Deseja continuar?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.companyDocumentation.shelved = event.value;
        this.companyDocumentation.shelvedAt = new Date();
        if (!this.companyDocumentation.shelved) {
          this.renewCompanyDocumentationEvent.emit(this.companyDocumentation);
        }
      } else {
        event.source.checked = false;
      }
    });
  }

  isShelvedRadioGroupDisabled(): boolean {
    return !this.companyDocumentationForm.valid;
  }

  inputFileSelectHandler(event: File) {
    const fileReader = new FileReader();
    fileReader.onload = ((readFile: File) => {
      return (e) => {
        this.companyDocumentation.file = readFile;
        this.companyDocumentation.fileName = readFile.name;
      };
    })(event);
    fileReader.readAsDataURL(event);
  }

  inputFileUndoClearHandler(event: any) {
    this.companyDocumentation.file = event.file;
    this.companyDocumentation.fileName = event.fileName;
    this.companyDocumentation.fileUrl = event.fileUrl;
  }

  inputFileClearHandler() {
    this.companyDocumentation.file = undefined;
    this.companyDocumentation.fileName = undefined;
    this.companyDocumentation.fileUrl = undefined;
  }

  doRemove() {
    this.confirmDialogHandler.call('Excluir Documentação', 'ATENÇÃO! Deseja realmente excluir este registro?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
      if (confirm) {
        this.removeCompanyDocumentationEvent.emit(this.companyDocumentation);
        this.removeFormFromFormArrayOfParent.emit(this.companyDocumentationForm);
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

      if (isNullOrUndefined(this.companyDocumentation.id) && this.doCompareWithToday(control.value) === -1) {
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
