import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import { AppMessageService } from '../../../../../shared/util/app-message.service';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { UserProfile } from '../../../../../shared/models/user-profile.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Module } from '../../../../../shared/models/module.model';

@Component({
  selector: 'settings-module-profile-dialog',
  templateUrl: './settings-module-profile-dialog.component.html',
  styleUrls: ['./settings-module-profile-dialog.component.scss']
})
export class SettingsModuleProfileDialogComponent implements OnInit {

  title:string= "Adicionar Módulo";
  modules:Module[];
   userProfileId:number;
   public moduleForm: FormGroup;

  constructor(
    public dialogRef: MdDialogRef<SettingsModuleProfileDialogComponent>,
    public snackBar: MdSnackBar,
    private appMessage: AppMessageService,
    private fb: FormBuilder,
    private permissionService: PermissionService,

    @Inject(MD_DIALOG_DATA) public data: any,
  ) {

  }



  ngOnInit() {
    this.moduleForm = this.fb.group({
      module: new FormControl([], [Validators.required]),
    });

    this.permissionService.getModuleAvailablesByUserProfile(this.data.userProfileId).subscribe(response=>{
      this.modules =response;       
       })
  }

  save(){
    if(this.moduleForm.valid){
     let moduleId = this.moduleForm.value.module;
     this.permissionService.addProfileToModule(moduleId,this.data.userProfileId).subscribe(result=>{
         this.closeDialog();
     });

    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
   

}
