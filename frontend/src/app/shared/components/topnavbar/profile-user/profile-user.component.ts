import { Router, UrlTree } from '@angular/router';
import { ConstructionUserProfileService } from '../../../services/construction-user-profile.service';
import { PermissionService } from '../../../services/permission.service';
import { ManagementsService } from '../../../services/managements.service';
import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SessionsService } from '../../../services/sessions.service';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { MdSnackBar, MdDialogRef } from '@angular/material';
import { environment } from 'environments/environment';
import { Managements } from './../../../models/managements.model';
import { EnumPermission } from '../../../models/permission/enum-permission';


@Component({
  selector: 'profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {

  userForm: FormGroup;
  companyForm: FormGroup;
  loading = false;
  photoUrl: string;
  onChangePassword: boolean;
  userPasswordConfirmationInfoLabel: string;
  currentUser: User;
  currentCompany: any;
  imageFile: File;
  userPasswordChangeForm: FormGroup;
  managementsService: ManagementsService;
  error = '';

  managementsList: Array<Managements> = new Array<Managements>();
  management: Managements;

  readonly userPasswordConfirmationInfoParamId = 1;
  readonly passwordMinLength = 6;
  readonly passwordMaxLength = 8;

  constructor(
    public snackBar: MdSnackBar,
    private fb: FormBuilder,
    private sessionsService: SessionsService,
    private userService: UserService,
    public dialogRef: MdDialogRef<ProfileUserComponent>,
    private ManagementsService: ManagementsService,
  ) {

    this.companyForm = new FormGroup({
      company: new FormControl('', [Validators.required])
    });

  }

  ngOnInit() {

    this.currentUser = this.sessionsService.getCurrent();
    this.currentCompany = this.sessionsService.getCurrentCompany();
    this.getManagements();
    this.userForm = this.fb.group({

      hiredTypeRadio: null,
      sex: null,
      role: null,
      supplier: null,
      scholarity: [''],
      necessitys: [''],
      status: ['']
    });

    this.onChangePassword = false;

    this.userPasswordChangeForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength), Validators.maxLength(this.passwordMaxLength)]),
      newPasswordConfirm: new FormControl('', [Validators.required]),

    }, this.functionValidatePasswordMatch);
  }

  getImgFile(imageFile: File) {
    this.imageFile = imageFile;
  }

  fileRemoved() {
    this.imageFile = null;
    this.photoUrl = null;
  }

  getAvatar() {
    if (this.currentUser.photoUrl && this.currentUser.photoFilename) {
      return environment.authUrl + this.currentUser.photoUrl + '?t=' + this.currentUser.photoFilename;
    } else {
      return '';
    }
  }

  functionValidatePasswordMatch(formGroup: FormGroup) {
    const passwordMatch = formGroup.controls.newPassword.value === formGroup.controls.newPasswordConfirm.value;
    if (!passwordMatch && !formGroup.controls.newPassword.errors) {
      formGroup.controls.newPasswordConfirm.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    if (formGroup.controls.newPasswordConfirm.hasError('mismatch')) {
      formGroup.controls.newPasswordConfirm.setErrors(null);
      formGroup.controls.newPasswordConfirm.updateValueAndValidity();
    }
    return null;
  }

  doChangePassword() {
    this.onChangePassword = true;
  }

  doCancelChangePassword() {
    this.onChangePassword = false;
  }

  save() {
    let changePasswordRequest = null;
    if (this.onChangePassword) {
      changePasswordRequest = {
        password: this.userPasswordChangeForm.controls.password.value,
        newPassword: this.userPasswordChangeForm.controls.newPassword.value
      };
    }

    this.userService.updateUserDetails(this.currentUser, this.imageFile, changePasswordRequest).subscribe(result => {
      this.currentUser = this.sessionsService.getCurrent();
      this.currentUser.photoFilename = result.user.photoFilename;
      this.currentUser.photoUrl = result.user.photoUrl;
      this.sessionsService.setCurrentUser(this.currentUser);

      this.snackBar.open('Dados atualizados com sucesso!', null, { duration: 3000 });
      this.dialogRef.close();
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

  isValid() {
    if (this.onChangePassword) {
      return this.userPasswordChangeForm.valid;
    }

    return true;
  }

  getManagements() {
    this.currentUser = this.sessionsService.getCurrent();

    this.ManagementsService.getActiveManagementsListByUser(this.currentUser.id).subscribe(
      managements => {
        this.managementsList = managements;
      }
    );

  }

}
