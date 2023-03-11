import { Component, OnInit } from '@angular/core';
import { Module } from '../../../../../shared/models/module.model';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../../../shared/services/user-profile.service';
import { SettingsModuleDialogComponent } from '../settings-module-dialog/settings-module-dialog.component';
import { SettingsModuleProfilesPemissionsDialogComponent } from '../settings-module-profiles-pemissions-dialog/settings-module-profiles-pemissions-dialog.component';
import { SettingsModuleProfileDialogComponent } from '../settings-module-profile-dialog/settings-module-profile-dialog.component';
import { UserProfile } from '../../../../../shared/models/user-profile.model';


@Component({
  selector: 'settings-module-profile-permissions',
  templateUrl: './settings-module-profile-permissions.component.html',
  styleUrls: ['./settings-module-profile-permissions.component.scss']
})
export class SettingsModuleProfilePermissionsComponent implements OnInit {

  modulesList: Array<Module> ;
   profileId:number;
   userProfile:UserProfile;
  constructor(public permissionService:PermissionService,private dialog: MdDialog,
    private route: ActivatedRoute,
    public userProfileService:UserProfileService
  ){}

  ngOnInit() {
    this.profileId =this.route.snapshot.params["id"];
   this.loadModules();
  }

  loadModules(){
    this.userProfileService.getUserProfile(this.profileId).subscribe(response=>{
         this.userProfile=response;
    });

    this.modulesList=[];
    this.userProfileService.getModulesByUserProfile(this.profileId).subscribe(response=>{
      this.modulesList = response;
    
    })
  }

  openModuleDialog () {
    let   dialogConfig = {
        data: {
            update: false,
            userProfileId:this.profileId
        }
    };
    const dialogRef = this.dialog.open(SettingsModuleProfileDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.loadModules();
    });
}
  
openPermissionsDialog (moduleId:number) {
  let   dialogConfig = {
      data: {
          update: false,
          userProfileId: this.profileId,
          moduleId: moduleId
      }
  };
  const dialogRef = this.dialog.open(SettingsModuleProfilesPemissionsDialogComponent, dialogConfig);

}

}
