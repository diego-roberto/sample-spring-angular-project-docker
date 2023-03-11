import { Component, OnInit, Inject } from '@angular/core';

import { MdDialogRef, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import { AppMessageService } from '../../../../../shared/util/app-message.service';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { UserProfile } from '../../../../../shared/models/user-profile.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'settings-module-profile-create-dialog',
  templateUrl: './settings-module-profile-create-dialog.component.html',
  styleUrls: ['./settings-module-profile-create-dialog.component.scss']
})
export class SettingsModuleProfileCreateDialogComponent implements OnInit {
  title:string= "Adicionar Perfil";
  userProfiles:UserProfile[];
  userProfileId:number;
  public moduleForm: FormGroup;

 constructor(
   public dialogRef: MdDialogRef<SettingsModuleProfileCreateDialogComponent>,
   public snackBar: MdSnackBar,
   private appMessage: AppMessageService,
   private fb: FormBuilder,
   private permissionService: PermissionService,

   @Inject(MD_DIALOG_DATA) public data: any,
 ) {

 }



 ngOnInit() {
   this.moduleForm = this.fb.group({
     profile: new FormControl([], [Validators.required]),
   });

   this.permissionService.getUserProfileAvailablesByModule(this.data.moduleId).subscribe(response=>{
     this.userProfiles =[];
        response.map((userProfile: UserProfile) => {
              this.userProfiles.push(userProfile);
            });     
      })
 }

 save(){
   if(this.moduleForm.valid){
    let profileId = this.moduleForm.value.profile;
    this.permissionService.addProfileToModule(this.data.moduleId,profileId).subscribe(result=>{
        this.closeDialog();
    });

   }
 }

 closeDialog() {
   this.dialogRef.close();
 }
  

}

