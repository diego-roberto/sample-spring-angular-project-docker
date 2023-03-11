import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { SettingsModuleProfilesPemissionsDialogComponent } from '../settings-module-profiles-pemissions-dialog/settings-module-profiles-pemissions-dialog.component';
import { MdDialog } from '@angular/material';
import { UserProfile } from '../../../../../shared/models/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { SettingsModuleProfileDialogComponent } from '../settings-module-profile-dialog/settings-module-profile-dialog.component';
import { UserProfileService } from '../../../../../shared/services/user-profile.service';

@Component({
  selector: 'settings-module-profiles',
  templateUrl: './settings-module-profiles.component.html',
  styleUrls: ['./settings-module-profiles.component.scss']
})
export class SettingsModuleProfilesComponent implements OnInit {

  userProfiles: Array<any> = [];
  moduleId:number;
  constructor(public permissionService:PermissionService,private dialog: MdDialog,
    private route: ActivatedRoute,private userProfileService:UserProfileService
  ) { }

  ngOnInit() {
    this.loadProfiles();
  }
 
  loadProfiles(){
  //  this.moduleId =this.route.snapshot.params["id"];
    this.userProfileService.getUserProfiles().subscribe(response=>{

         response.map((userProfile: UserProfile) => {
               this.userProfiles.push(userProfile);
             });     
       })
  }
   
 

  openProfileDialog () {
      let   dialogConfig = {
          data: {
            moduleId: this.moduleId
          }
      };
      const dialogRef = this.dialog.open(SettingsModuleProfileDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadProfiles();
      });
  }
   

}
