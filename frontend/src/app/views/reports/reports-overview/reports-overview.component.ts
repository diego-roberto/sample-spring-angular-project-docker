import { Component, OnInit } from "@angular/core";

import { User } from "app/shared/models/user.model";
import { SessionsService } from "app/shared/services/sessions.service";
import { ManagementsService } from "app/shared/services/managements.service";
import { MdDialog } from '@angular/material';
import { CompanyReportDialogComponent } from '../company-report-dialog/company-report-dialog.component';
import { PermissionService } from "app/shared/services/permission.service";
import { EventReportDialogComponent } from "../event-report-dialog/event-report-dialog.component";
import { ChecklistReportDialogComponent } from "../checklist-report-dialog/checklist-report-dialog.component";

@Component({
  selector: "reports-overview",
  templateUrl: "./reports-overview.component.html",
  styleUrls: ["./reports-overview.component.scss"]
})
export class ReportsOverviewComponent implements OnInit {
  public currentUser: User;
  public currentCompany: any;
  profiles: boolean = false;

  constructor(
    private dialog: MdDialog,
    private managementsService: ManagementsService,
    public sessionsService: SessionsService,
    public permissionService: PermissionService,
  ) {
    this.currentUser = this.sessionsService.getCurrent();
    this.currentCompany = this.sessionsService.getCurrentCompany();
  }

  ngOnInit() {
    this.viewUserProfile(this.currentUser.id, this.currentCompany.companyId);
  }

  openEventReportModal() {
    this.dialog.open(EventReportDialogComponent);
  }

  openCompanyReportModal() {
    this.dialog.open(CompanyReportDialogComponent);
  }

  openChecklistReportModal() {
    this.dialog.open(ChecklistReportDialogComponent);
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
                return this.profiles;
            }
          });
        },
        err => {
          console.log(err);
        }
      );
  }
}
