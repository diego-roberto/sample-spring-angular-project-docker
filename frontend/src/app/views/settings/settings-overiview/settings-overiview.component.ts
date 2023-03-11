import { Component, OnInit } from "@angular/core";

import { User } from "app/shared/models/user.model";
import { SessionsService } from "app/shared/services/sessions.service";
import { ManagementsService } from "app/shared/services/managements.service";
import { PermissionService } from "app/shared/services/permission.service";
import { EnumPermission } from "app/shared/models/permission/enum-permission";

@Component({
  selector: "settings-overiview",
  templateUrl: "./settings-overiview.component.html",
  styleUrls: ["./settings-overiview.component.scss"]
})
export class SettingsOveriviewComponent implements OnInit {
  public currentUser: User;
  public currentCompany: any;
  profiles: boolean = false;
  accessFiles: boolean = true;
  accessManuals: boolean = true;

  constructor(
    private managementsService: ManagementsService,
    public sessionsService: SessionsService,
    public permissionService: PermissionService
  ) {
    this.currentUser = this.sessionsService.getCurrent();
    this.currentCompany = this.sessionsService.getCurrentCompany();
  }

  ngOnInit() {
    this.viewUserProfile(this.currentUser.id, this.currentCompany.companyId);
    this.loadPermissions();
  }

  async viewUserProfile(userId, companyId) {
    await this.managementsService
      .getUserProfileListByUserAndCompany(userId, companyId)
      .then(
        userProfile => {
          userProfile.filter(profile => {
            switch (profile.name) {
              case "Admin Sesi":
                this.profiles = true;
                // console.log(`visualizar profiles Admin Sesi: ${this.profiles}`);
                return this.profiles;
              /**
               * Inicio - Implementação em andamento, aguardando retorno.
               */
              // case "Admin Empresa":
              //   if (this.currentUser.companyId == this.managements.company.id) {
              //     this.profiles = true;
              //     console.log(
              //       `visualizar profiles Admin Empresa: ${this.profiles}`
              //     );
              //     return this.profiles;
              // }
              /**
               * Fim - Implementação em andamento, aguardando retorno.
               */
            }
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  private loadPermissions() {
    this.accessFiles = this.permissionService.hasPermission(EnumPermission.SETTINGS_ACCESS_DOWNLOAD_FILES);
    this.accessManuals = this.permissionService.hasPermission(EnumPermission.SETTINGS_ACCESS_DOWNLOAD_MANUALS);
  }
}
