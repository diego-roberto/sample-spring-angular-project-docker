import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../shared/services/permission.service';
import { DegreeService } from '../../../shared/services/degree.service';
import { SettingsDegreeDialogComponent } from './components/settings-degree-dialog/settings-degree-dialog.component';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Degree } from '../../../shared/models/degree.model';
import { UserProfileService } from '../../../shared/services/user-profile.service';

@Component({
  selector: 'settings-degree',
  templateUrl: './settings-degree.component.html',
  styleUrls: ['./settings-degree.component.scss']
})
export class SettingsDegreeComponent implements OnInit {

  degreesList: Array<Degree>;

  constructor(public permissionService: PermissionService,
    public degreeService: DegreeService,
    private dialog: MdDialog,
    private route: ActivatedRoute,
    public userProfileService: UserProfileService
  ) { }

  ngOnInit() {

    this.loadDegrees();
  }

  loadDegrees() {
    this.degreeService.getAllDegrees().subscribe(response => {
      this.degreesList = response;
    })
  }

  openDegreeDialog(degree: Degree) {
    let dialogConfig = {
      data: {
        degree: degree
      }
    };
    const dialogRef = this.dialog.open(SettingsDegreeDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.loadDegrees();
    });
  }
}

