import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../shared/services/permission.service';
import { ManagementsService } from '../../../shared/services/managements.service';
import { Managements } from './../../../shared/models/managements.model';
import { SessionsService } from '../../../shared/services/sessions.service';
import { User } from '../../../shared/models/user.model';
import { ConstructionUserProfileService } from '../../../shared/services/construction-user-profile.service';
import { MdSnackBar, MdDialogRef } from '@angular/material';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { EnumPermission } from '../../../shared/models/permission/enum-permission';

@Component({
  selector: 'change-company',
  templateUrl: './change-company.component.html',
  styleUrls: ['./change-company.component.scss'],
})
export class ChangeCompanyComponent implements OnInit {
  changeCompanyForm: FormGroup;
  currentUser: User;
  currentCompany: any;
  error = '';
  managementsService: ManagementsService;
  searchTerm: string = '';
  managementsList: Array<Managements> = new Array<Managements>();
  management: Managements;

  constructor(
    public snackBar: MdSnackBar,
    private permissionService: PermissionService,
    private sessionsService: SessionsService,
    private router: Router,
    public dialogRef: MdDialogRef<ChangeCompanyComponent>,
    private ManagementsService: ManagementsService,
    private constructionUserProfileService: ConstructionUserProfileService,
  ) {
    this.changeCompanyForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      searchTerm: new FormControl(),
    });
  }

  ngOnInit() {
    this.currentUser = this.sessionsService.getCurrent();
    this.currentCompany = this.sessionsService.getCurrentCompany();
    this.getManagements();
  }

  cleanSearch() {
    this.searchTerm = "";
  }

  cleanSelection() {
    this.management = null;
  }

  getManagements() {
    this.currentUser = this.sessionsService.getCurrent();

    this.ManagementsService.getActiveManagementsListByUser(
      this.currentUser.id,
    ).subscribe(managements => {
      this.managementsList = managements;
    });
  }

  showErrorBar(error: string) {
    this.error = error;
  }

  changeCompany() {
    this.cleanSessionStorage();
    this.sessionsService.setCompany(this.management).subscribe(
      permissions => {
        this.constructionUserProfileService
          .findAllPermissionOfCurrentUser(
            this.sessionsService.getCurrentCompany().companyId,
          )
          .subscribe(permissions => {
            this.sessionsService.setUserPermissions(permissions);

            if (this.sessionsService.triedRoute) {
              this.router.navigateByUrl(this.sessionsService.triedRoute.url);
              this.sessionsService.triedRoute = null;
            } else {
              if (
                this.permissionService.hasPermission(
                  EnumPermission.CONSTRUCTION_LIST_CONSTRUCTIONS,
                )
              ) {
                this.router.navigate(['/constructions']);
              } else if (
                this.permissionService.hasPermission(
                  EnumPermission.COMPANY_WORKERS_LIST,
                )
              ) {
                this.router.navigate(['/workers']);
              }
            }

            this.router.navigate(['/company']).then(() => {
              location.reload();
            });
          }, error => {
            console.log(error)
            this.showErrorBar('Erro no servidor!');
          });
      },
      error => {
        console.log(error)
        this.showErrorBar('Erro no servidor!');
      },
    );
  }

  cleanSessionStorage(){
    sessionStorage.removeItem('worker_filter');
    sessionStorage.removeItem('dashboard_filter');
    sessionStorage.removeItem('construction_filter');
    sessionStorage.removeItem('supplier_filter');
    sessionStorage.removeItem('checklist_filter');
  }
}
