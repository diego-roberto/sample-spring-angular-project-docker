import { forEach } from '@angular/router/src/utils/collection';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Managements } from 'app/shared/models/managements.model';
import { MdSnackBar, MdDialog } from '@angular/material';
import { ManagementsService } from 'app/shared/services/managements.service';
import { UserAddComponent } from '../../user-add/user-add.component';
import { UserProfile } from '../../../../../shared/models/user-profile.model';
import { ManagementsProfiles } from '../../../../../shared/models/managements-profiles.model';

@Component({
  selector: 'user-line-detail',
  templateUrl: './user-line-detail.component.html',
  styleUrls: ['./user-line-detail.component.scss']
})
export class UserLineDetailComponent implements OnInit {
  @Input() managements: Managements;

  constructor(private snackBar: MdSnackBar,
    private managementsService: ManagementsService,
    private _dialog: MdDialog) { }

  ngOnInit() { }

  toEditUser() {
    const dialogRef = this._dialog.open(UserAddComponent);
    dialogRef.componentInstance.managements = new Managements().initializeWithJSON(this.managements);
    dialogRef.componentInstance.mode = 'update';
  }

  click(event: any, management: Managements) {
    management.active = event.checked ? 1 : 0;
    this.managementsService.update(management).subscribe(response => {
      this.snackBar.open('Status do Usuário alterado com sucesso!', null, { duration: 3000 });
    },
      error => {
        this.handleError(error);
      });
  }

  private handleError(error) {
    if (error.json() && error.json().errors && error.json().errors.length > 0) {
      this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
    } else {
      this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
    }
  }

  public getProfiles(profiles: ManagementsProfiles[]): string {
    let profileStr = '';
    profiles.forEach(up => {
      if (profileStr) {
        profileStr += ', ' + up.userProfile.name;

      } else {
        profileStr += up.userProfile.name;
      }
    });
    return profileStr;
  }

}
