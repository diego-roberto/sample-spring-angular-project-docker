import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from "@angular/core";
import { MdSnackBar, MdDialog } from "@angular/material";

import { CompanyService } from "app/shared/services/company.service";
import { Company } from "app/shared/models/company.model";
import { User } from "app/shared/models/user.model";
import { SafetyCardComponent } from "app/shared/components/safety-card";
import { SessionsService } from "app/shared/services/sessions.service";
import { PermissionService } from "app/shared/services/permission.service";
import { AppMessageService } from "app/shared/util/app-message.service";
import { CompanyReportDialogComponent } from "./company-report-dialog/company-report-dialog.component";
import { WorkersEntrancePermissionsService } from "app/shared/services/workers-entrance-permissions.service";
import { Managements } from "app/shared/models/managements.model";
import { ManagementsService } from "app/shared/services/managements.service";

@Component({
  selector: "companies-component",
  templateUrl: "companies.component.html",
  styleUrls: ["./companies.component.scss"],
  providers: [CompanyService, WorkersEntrancePermissionsService, Managements]
})
export class CompaniesComponent implements OnInit, OnDestroy {
  company: Company = new Company();
  companiesList: Array<any>;

  currentUser: User;
  currentCompany: any;

  profiles: boolean = false;

  managementsList: Array<Managements> = new Array<Managements>();

  @ViewChild("companyDetails") companyDetails: SafetyCardComponent;
  @ViewChild("listNotCompaniesLinkedToUser")
  listNotCompaniesLinkedToUser: SafetyCardComponent;
  @ViewChild("listCompaniesLinkedToUser")
  listCompaniesLinkedToUser: SafetyCardComponent;
  @ViewChild("responsableData") responsableData: SafetyCardComponent;
  @ViewChild("responsableSstData") responsableSstData: SafetyCardComponent;
  @ViewChild("responsableContactData")
  responsableContactData: SafetyCardComponent;
  @ViewChild("companyDocumentation") companyDocumentation: SafetyCardComponent;
  @ViewChild("additionalInformation")
  additionalInformation: SafetyCardComponent;

  responsibleDataType = "responsableData";
  responsibleSstDataType = "responsableSstData";
  responsibleContactDataType = "responsableContactData";
  elements: Array<SafetyCardComponent>;

  sub: any;

  open = false;
  fixed = false;
  spin = true;
  direction = "up";
  animationMode = "fling";
  showFabButton = false;

  constructor(
    private dialog: MdDialog,
    public snackBar: MdSnackBar,
    private service: CompanyService,
    private sessionsService: SessionsService,
    private companyService: CompanyService,
    private appMessageService: AppMessageService,
    public permissionService: PermissionService,
    private workersEntranceService: WorkersEntrancePermissionsService,
    private managementsService: ManagementsService
  ) {
    this.currentUser = this.sessionsService.getCurrent() || new User();
    this.currentCompany = this.sessionsService.getCurrentCompany();
    this.viewUserProfile(this.currentUser.id, this.currentCompany.companyId);
    this.listCompaniesNotLinkedToUser();
  }

  ngOnInit() {
    this.getManagements();

    this.sub = this.service
      .getCompany(this.currentUser.companyId)
      .subscribe(response => {
        this.company = response;
      });

    this.elements = [
      this.companyDetails,
      this.listNotCompaniesLinkedToUser,
      this.listCompaniesLinkedToUser,
      this.responsableData,
      this.responsableSstData,
      this.responsableContactData,
      this.companyDocumentation,
      this.additionalInformation
    ];
    this.closeAll();

    this.companyDetails.open();
    this.setShowFabButton()
  }


  setShowFabButton() {
    let stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        this.showFabButton = true;
      }
    }, 200);
  }

  ngOnDestroy() {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  onCompanyDetailsSaved(company: Company) {
    this.service.updateCompanyDetails(company).subscribe(
      data => {
        this.companyDetails.close();
        this.responsableData.open();
        this.snackBar.open("Dados da empresa atualizados com sucesso!", null, {
          duration: 3000
        });
        setTimeout(() => {
          location.reload();
        }, 1000)
      },
      error => {
        this.handleError(error);
      }
    );
  }

  onResponsableData(company: Company) {
    this.service.updateCompanyResponsibleData(company).subscribe(
      data => {
        this.responsableData.close();
        this.responsableSstData.open();
        this.snackBar.open(
          "Dados do responsável pela empresa atualizados com sucesso!",
          null,
          { duration: 3000 }
        );
      },
      error => {
        this.handleError(error);
      }
    );
  }

  onResponsableSstData(company: Company) {
    this.service.updateCompanyResponsibleSstData(company).subscribe(
      data => {
        this.responsableSstData.close();
        this.responsableContactData.open();
        this.snackBar.open(
          "Dados do responsável SST atualizados com sucesso!",
          null,
          { duration: 3000 }
        );
      },
      error => {
        this.handleError(error);
      }
    );
  }

  onResponsableContactData(company: Company) {
    this.service.updateCompanyContactData(company).subscribe(
      data => {
        this.responsableContactData.close();
        this.companyDocumentation.open();
        this.snackBar.open("Dados do contato atualizados com sucesso!", null, {
          duration: 3000
        });
      },
      error => {
        this.handleError(error);
      }
    );
  }

  doSaveCompanyDocumentationList() {
    this.service.saveCompanyDocumentationList(this.company).subscribe(
      companyDocumentationList => {
        this.company.companyDocumentationList = companyDocumentationList;
        this.appMessageService.showSuccess(
          "Controle de documentos da empresa salvos com sucesso!"
        );

        this.companyDocumentation.close();
        this.additionalInformation.open();
      },
      error => {
        this.appMessageService.errorHandle(
          error,
          "Erro ao salvar o controle de documentos da empresa!"
        );
      }
    );

    this.workersEntranceService.updateByCompany(this.company.id).subscribe();
  }

  onAdditionalInformation(company: Company) {
    this.service.updateCompanyAdditionalInformation(company).subscribe(
      data => {
        this.additionalInformation.close();
        this.snackBar.open(
          "Informações Adicionais atualizadas com sucesso!",
          null,
          { duration: 3000 }
        );
      },
      error => {
        this.handleError(error);
      }
    );
  }

  closeAll() {
    this.elements.forEach(e => {
      if (e) {
        e.close();
      }
    });
  }

  private handleError(error) {
    if (error.json() && error.json().errors && error.json().errors.length > 0) {
      this.snackBar.open(error.json().errors[0].message, null, {
        duration: 3000
      });
    } else {
      this.snackBar.open("Erro no servidor!", null, { duration: 3000 });
    }
  }

  openPrintCompanyDocumentationReportDialog() {
    const dialogRef = this.dialog.open(CompanyReportDialogComponent);
  }

  getManagements() {
    this.managementsService
      .getManagementsListByUser(this.currentUser.id)
      .subscribe(managements => {
        this.managementsList = managements;
      });
  }

  listCompaniesNotLinkedToUser() {
    this.currentUser = this.sessionsService.getCurrent();
    this.companyService.getCompanies(this.currentUser.id).subscribe(company => {
      this.companiesList = company;
    });
  }

  addCompanyToUser(idCompany: number, idUser: number) {
    this.managementsService
      .saveCompanyToUser(idCompany, idUser)
      .then(response => {
        this.listCompaniesNotLinkedToUser();
        this.getManagements();
        this.listNotCompaniesLinkedToUser.close();
        this.listCompaniesLinkedToUser.open();
        this.snackBar.open("Vinculado empresa com sucesso!", null, {
          duration: 3000
        });
      });
  }

  updCompanyToUser(idManagement: number) {
    this.managementsService.updateCompanyToUser(idManagement).then(response => {
      this.listCompaniesNotLinkedToUser();
      this.getManagements();
      this.listCompaniesLinkedToUser.close();
      this.listNotCompaniesLinkedToUser.open();
      this.snackBar.open("Desvinculado empresa com sucesso!", null, {
        duration: 3000
      });
    });
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
