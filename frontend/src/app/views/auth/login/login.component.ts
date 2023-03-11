import { Router, UrlTree } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ViewChild, Component } from "@angular/core";

import { SessionsService } from "app/shared/services/sessions.service";
import { UtilValidators } from "app/shared/util/validators.util";
import { ManagementsService } from "./../../../shared/services/managements.service";

import { User } from "./../../../shared/models/user.model";
import { Managements } from "./../../../shared/models/managements.model";
import { ConstructionUserProfileService } from "../../../shared/services/construction-user-profile.service";
import { PermissionService } from "../../../shared/services/permission.service";
import { EnumPermission } from "../../../shared/models/permission/enum-permission";
import { MdSnackBar } from "@angular/material";
import { Term } from "app/shared/models/term.model";
import { environment } from "environments/environment";
import { TermService } from "app/shared/services/term.service";
import { TermUserService } from "app/shared/services/term-user.service";
import { TermUser } from "app/shared/models/term-user.model";

@Component({
  selector: "login",
  templateUrl: "login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  model: any = {};
  loading = false;
  firstStep = false;
  termAcceptance = false;
  error = "";
  loginForm: FormGroup;
  companyForm: FormGroup;
  termAcceptanceForm: FormGroup;
  currentUser: User;
  managementsList: Array<Managements> = new Array<Managements>();
  management: Managements;
  searchCompany: string = '';
  term: Term;
  termUser: TermUser;
  ipAddress: string = '';
  termEnvPath = '';
  termType: number = 1; //"Termos de Uso"

  constructor(
    private managementsService: ManagementsService,
    private sessionsService: SessionsService,
    private permissionService: PermissionService,
    private router: Router,
    private snackBar: MdSnackBar,
    private constructionUserProfileService: ConstructionUserProfileService,
    private termService: TermService,
    private termUserService: TermUserService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, UtilValidators.email]),
      password: new FormControl("", Validators.required)
    });

    this.companyForm = new FormGroup({
      company: new FormControl("", [Validators.required]),
      searchCompany: new FormControl()
    });

    this.termAcceptanceForm = new FormGroup({
      termOfUseAccept: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  cleanSearch() {
    this.searchCompany = "";
  }

  cleanSelection() {
    this.management = null;
  }

  login() {
    this.loading = true;
    this.sessionsService.login(this.model.email, this.model.password).subscribe(
      data => {
        this.loading = false;
        this.currentUser = this.sessionsService.getCurrent();
        this.termUserService.checkTermUser(this.currentUser.id, this.termType).subscribe(response => {

          if (response.accepted && response.updated) {
            this.firstStep = true;
            this.getManagements();
          } else {
            this.termService.getMaxVersionByTermTypeId(this.termType).subscribe(response => {
              this.term = new Term().initializeWithJSON(response);
              this.termEnvPath = 'https://blobstg001.blob.core.windows.net/seif/documents/' + this.term.filePath;
              this.termAcceptance = true;
            });
          }

        });
      },
      error => {
        this.loading = false;
        if (
          error.json() &&
          error.json().errors &&
          error.json().errors.length > 0
        ) {
          this.showErrorBar(error.json().errors[0].message);
        } else {
          this.showErrorBar("Erro no servidor!");
        }
      }
    );
  }

  redirectTermAccept() {
    this.termAcceptance = false;

    const aux = {
      user: this.currentUser.toJSON(),
      term: this.term.toJSON(),
      ipAddress: this.sessionsService.ipAddress,
      valid: true
    };
    this.termUser = new TermUser().initializeWithJSON(aux);
    this.termUserService.saveTermUser(this.termUser).subscribe();

    this.getManagements();
  }

  getManagements() {
    this.managementsService
      .getActiveManagementsListByUser(this.currentUser.id)
      .subscribe(managements => {
        this.managementsList = managements;

        if (this.managementsList && this.managementsList.length === 1) {
          this.management = this.managementsList[0];
          this.redirectCompany();
        }
        this.firstStep = true;
      });
  }

  redirectCompany() {
    this.sessionsService.setCompany(this.management).subscribe(
      permissions => {
        this.constructionUserProfileService
          .findAllPermissionOfCurrentUser(
            this.sessionsService.getCurrentCompany().companyId
          )
          .subscribe(permissions => {
            this.sessionsService.setUserPermissions(permissions);

            if (this.sessionsService.triedRoute) {
              this.router.navigateByUrl(this.sessionsService.triedRoute.url);
              this.sessionsService.triedRoute = null;
            } else {
              if (
                this.permissionService.hasPermission(
                  EnumPermission.CONSTRUCTION_LIST_CONSTRUCTIONS
                )
              ) {
                this.router.navigate(["/constructions"]);
              } else if (
                this.permissionService.hasPermission(
                  EnumPermission.COMPANY_WORKERS_LIST
                )
              ) {
                this.router.navigate(["/workers"]);
              } else {
                this.snackBar.open("Sem permissão de acesso!", null, {
                  duration: 3000
                });
              }
            }
          });
      },
      error => {
        if (
          error.json() &&
          error.json().errors &&
          error.json().errors.length > 0
        ) {
          this.showErrorBar(error.json().errors[0].message);
        } else {
          this.showErrorBar("Erro no servidor!");
        }
      }
    );
  }

  showErrorBar(error: string) {
    this.error = error;
  }

  disableLogin() {
    return this.loginForm.invalid || this.loading;
  }

  disableTermButton() {
    return this.termAcceptanceForm.invalid || this.loading;
  }
}
