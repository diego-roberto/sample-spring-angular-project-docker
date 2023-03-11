import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { Module } from '../../../../../shared/models/module.model';

@Component({
  selector: 'settings-module-dialog',
  templateUrl: './settings-module-dialog.component.html',
  styleUrls: ['./settings-module-dialog.component.scss']
})
export class SettingsModuleDialogComponent implements OnInit {

  title: string = "Cadastro de Módulo";
  public moduleForm: FormGroup;
  module: Module;
  constructor(public dialogRef: MdDialogRef<SettingsModuleDialogComponent>,
    private fb: FormBuilder,
    private permissionService: PermissionService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.module = this.data.module;
    this.moduleForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
    });

    if (this.module) {
      this.moduleForm.patchValue(this.module);
    }
  }

  save() {
    if (this.moduleForm.valid) {
      let module = this.moduleForm.value;
      if (this.module) {
        module.id = this.module.id;
      }
      this.permissionService.saveModule(module).subscribe(result => {
        this.closeDialog();
      });

    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
