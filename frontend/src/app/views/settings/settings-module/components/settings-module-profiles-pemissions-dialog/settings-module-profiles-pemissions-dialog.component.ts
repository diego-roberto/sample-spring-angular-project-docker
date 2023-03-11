import { Component, Inject, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl, } from '@angular/forms';
import { MdSnackBar, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';



import * as Moment from 'moment';
import { Permission } from '../../../../../shared/models/permission/permission';
import { QualificationsItem } from '../../../../../shared/models/qualifications-item.model';
import { AppMessageService } from '../../../../../shared/util/app-message.service';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { UtilValidators } from '../../../../../shared/util/validators.util';
import { Observable } from 'rxjs';
import { UserProfileService } from '../../../../../shared/services/user-profile.service';


@Component({
  selector: 'settings-module-profiles-pemissions-dialog',
  templateUrl: './settings-module-profiles-pemissions-dialog.component.html',
  styleUrls: ['./settings-module-profiles-pemissions-dialog.component.scss']
})
export class SettingsModuleProfilesPemissionsDialogComponent implements OnInit {

  invalid = false;
  workerQualificationsItemForm: FormGroup;
  qualificationsLoading = false;

  @Input() profileId: number;
  @Input() moduleId: number;

  @Input() totalSteps = 1;
  @Input() title = 'GERENCIAR as Permissões do perfil no módulo ';
  @Input() step = 1;
  @Input() workerQualificationsItem: QualificationsItem;

  @Output() toShowPrintLoader: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filterSelected') filterSelected: ElementRef;
  @ViewChild('qualitiesVirtualScroll') qualitiesVirtualScroll: VirtualScrollComponent;
  @ViewChild('qualitiesSelectedVirtualScroll') qualitiesSelectedVirtualScroll: VirtualScrollComponent;

  companyQualities: Permission[] = [];
  selectedQualities: Permission[] = [];

  selectedQualitiesFiltered: Permission[] = [];
  companyQualitiesFiltered: Permission[] = [];

  qualitiesVirtualScrollItems: Permission[] = [];
  qualitiesSelectedVirtualScrollItems: Permission[] = [];

  selectedToAdd = [];
  selectedToRemove = [];

  checkedAddAll = false;
  checkedRemoveAll = false;

  constructor(

    public snackBar: MdSnackBar,
    private appMessage: AppMessageService,
    private permissionService: PermissionService,
    private userProfileService: UserProfileService,


  ) {
    this.workerQualificationsItemForm = new FormGroup({
      action: new FormControl(''),
      beginAt: new FormControl('', [Validators.required, UtilValidators.date, this.validateBeginAt]),
      endAt: new FormControl('', [Validators.required, UtilValidators.date, this.validateEndAt]),
    });
  }

  getTitle(): string {
    return 'Selecione as Permissões';
  }

  ngOnInit() {
    let moduleId = this.moduleId;
    let userProfileId = this.profileId;
    this.permissionService.getAllPermissions().flatMap(
      permissions => {
        this.companyQualities = permissions;
        return this.permissionService.getAllPermissionsByModuleAndUserProfile(moduleId, userProfileId);
      }
    ).subscribe(
      permissionsFromUserProfile => {
        this.selectedQualities = permissionsFromUserProfile;

        if (this.selectedQualities && this.selectedQualities.length > 0) {
          this.companyQualities = this.companyQualities.filter(item => !this.selectedQualities.find(item2 => item.id === item2.id));
        } else {
          this.selectedQualities = [];
        }

        this.doCompanyQualitiesOrderByName();
        this.doSelectedQualitiesOrderByName();
      });

  }

  hasErrorForm(attr: string, type: string): boolean {
    if (this.workerQualificationsItemForm.controls[attr].touched) {
      return this.workerQualificationsItemForm.controls[attr].hasError(type);
    } else {
      return false;
    }
  }



  isEnabledDate(atributo: string): boolean {
    return this.workerQualificationsItemForm.controls[atributo].disabled;
  }

  validateBeginAt(control: AbstractControl) {

    if (!control || !control.parent || !control.parent.controls['beginAt'] || !control.parent.controls['beginAt'].value) {
      return null;
    }
    const dateEnd = Moment(control.parent.controls['endAt'].value);
    const dateBegin = Moment(control.parent.controls['beginAt'].value);
    const currentDate = Moment(new Date(Moment().format('L')));
    return null;
  }

  validateEndAt(control: AbstractControl) {
    if ((!control || !control.parent) || (!control.parent.controls['beginAt'] || !control.parent.controls['beginAt'].value)
      || (!control.parent.controls['endAt'] || !control.parent.controls['endAt'].value)) {
      return null;
    }

    const dateBegin = Moment(control.parent.controls['beginAt'].value);
    const dateEnd = Moment(control.parent.controls['endAt'].value);
    const currentDate = Moment(new Date(Moment().format('L')));
    if (dateEnd.isBefore(dateBegin)) {
      return { isbeforeEnd: true };
    }
    return null;
  }

  setSelectedToAdd(quality: Permission) {
    if (!this.selectedToAdd.includes(quality)) {
      this.selectedToAdd.push(quality);
    } else {
      this.selectedToAdd = this.selectedToAdd.filter(item => item !== quality);
    }
  }

  setSelectedToRemove(quality: Permission) {
    if (!this.selectedToRemove.includes(quality)) {
      this.selectedToRemove.push(quality);
    } else {
      this.selectedToRemove = this.selectedToRemove.filter(item => item !== quality);
    }
  }

  doAdd() {
    this.selectedQualities = this.selectedQualities.concat(this.selectedToAdd);
    this.companyQualities = this.companyQualities.filter(item => !this.selectedToAdd.includes(item));
    this.selectedToAdd = [];
    this.checkedAddAll = false;
    this.doSelectedQualitiesOrderByName();
    this.doCompanyQualitiesOrderByName();
  }

  doRemove() {
    this.companyQualities = this.companyQualities.concat(this.selectedToRemove);
    this.selectedQualities = this.selectedQualities.filter(item => !this.selectedToRemove.includes(item));
    this.selectedToRemove = [];
    this.checkedRemoveAll = false;
    this.doSelectedQualitiesOrderByName();
    this.doCompanyQualitiesOrderByName();
  }

  doFilterSelectedQualities(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.selectedQualitiesFiltered = this.selectedQualities;
    } else {
      this.selectedQualitiesFiltered = this.selectedQualities.filter(quality =>
        quality.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doFilterCompanyQualities(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.companyQualitiesFiltered = this.companyQualities;
    } else {
      this.companyQualitiesFiltered = this.companyQualities.filter(quality =>
        quality.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }

  doClearQualitiesFilter() {
    this.filter.nativeElement.value = '';
    this.doFilterCompanyQualities(this.filter.nativeElement.value);
  }

  doClearSelectedQualitiesFilter() {
    this.filterSelected.nativeElement.value = '';
    this.doFilterSelectedQualities(this.filterSelected.nativeElement.value);
  }

  doCompanyQualitiesOrderByName() {
    this.companyQualities = this.companyQualities.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    this.doFilterCompanyQualities(this.filter.nativeElement.value);
  }

  doSelectedQualitiesOrderByName() {
    this.selectedQualities = this.selectedQualities.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    this.doFilterSelectedQualities(this.filterSelected.nativeElement.value);
  }

  setAllSelectedToAdd() {
    if (this.selectedToAdd.length === this.companyQualitiesFiltered.length) {
      this.selectedToAdd = [];
      this.checkedAddAll = !this.checkedAddAll;
    } else {
      this.selectedToAdd = this.companyQualitiesFiltered;
      this.checkedAddAll = !this.checkedAddAll;
    }
  }

  setAllSelectedToRemove() {
    if (this.selectedToRemove.length === this.selectedQualitiesFiltered.length) {
      this.selectedToRemove = [];
      this.checkedRemoveAll = !this.checkedRemoveAll;
    } else {
      this.selectedToRemove = this.selectedQualitiesFiltered;
      this.checkedRemoveAll = !this.checkedRemoveAll;
    }
  }

  showDialog() {
    window.alert("Alteração de permissões\nAs alterações terão efeito no pŕoximo logon.");
  }

  save() {
    let moduleId = this.moduleId;
    let userProfileId = this.profileId;
    let permissionIds: number[] = this.selectedQualities.map(element => {
      return element.id;
    })

    this.userProfileService.addPermissionsToUserProfileModule(userProfileId, moduleId, permissionIds).subscribe(result => {
      this.appMessage.showSuccess('Salvo com sucesso!');
      this.showDialog()
    },
      (error) => {
        this.appMessage.showError('Não foi possível salvar as alterações');
      });
  }
}
