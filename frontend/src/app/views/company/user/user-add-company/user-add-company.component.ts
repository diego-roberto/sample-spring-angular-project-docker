import { ManagementsService } from 'app/shared/services/managements.service';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../../../shared/models/user.model';
import { SessionsService } from '../../../../shared/services/sessions.service';
import { CompanyService } from '../../../../shared/services/company.service';
import { Managements } from '../../../../shared/models/managements.model';
import { Company } from '../../../../shared/models/company.model';

@Component({
  selector: 'user-add-company',
  templateUrl: './user-add-company.component.html',
  styleUrls: ['./user-add-company.component.scss'],
  providers: [CompanyService],
})
export class UserAddCompanyComponent implements OnInit {
  constructor(
    private snackBar: MdSnackBar,
    public dialogRef: MdDialogRef<UserAddCompanyComponent>,
    private sessionsService: SessionsService,
    private companyService: CompanyService,
    private managementsService: ManagementsService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) {
    this.userAddCompanyForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
    });
  }
  @Input() managements: Managements;

  public userAddCompanyForm: FormGroup;
  currentUser: User;
  teste: User;
  currentCompany: any;
  title = 'Vincular empresa ao usuário: ';
  companiesToAdd: Array<Number> = this.data.companies
    ? this.data.companies
    : [];
  companiesList: Array<any> = [];
  companies = Company;

  managementsList: Array<Managements> = this.data.managementList
    ? this.data.managementList
    : new Array<Managements>();
  management: Managements;

  ngOnInit() {
    this.currentUser = this.sessionsService.getCurrent();
    this.currentCompany = this.sessionsService.getCurrentCompany();
    this.getManagements();
    this.listCompaniesNotLinkedToUser();
  }

  getUserId() {
    return this.managements.user.id ? this.managements.user.id : -1;
  }
  isInArray(item, lista) {
    return lista.filter(l => {
      return l == item;
    }).length;
  }

  addCompanyToUser(idCompany: number, idUser: number) {
    if (!!idUser) {
      this.managementsService
        .saveCompanyToUser(idCompany, idUser)
        .then(response => {
          this.listCompaniesNotLinkedToUser();
          this.getManagements(true);
          this.snackBar.open('Vinculado empresa com sucesso!', null, {
            duration: 3000,
          });
        });
    } else {
      this.companiesToAdd.push(Number(idCompany));
      this.getCompaniesAndManagements();
    }
  }

  onRemoveOneItem(itemId) {
    this.companiesToAdd = this.companiesToAdd.filter(item => item != itemId);
    this.getCompaniesAndManagements();
  }

  getCompaniesAndManagements() {
    let allCompanies = [];
    this.currentUser = this.sessionsService.getCurrent();
    this.companyService.getCompanies(this.getUserId()).subscribe(company => {
      allCompanies = company;
      this.managementsService
        .getManagementsListByUser(this.getUserId())
        .subscribe(managements => {
          allCompanies.map(cl => {
            if (this.isInArray(cl.id, this.companiesToAdd)) {
              const management = new Managements();
              management.company = { ...cl };
              management.active = 1;
              managements.push(management);
            }
          });
          this.managementsList = managements;
        });
      this.companiesList = company.filter(
        (c: Company) => !this.isInArray(c.id, this.companiesToAdd),
      );
    });
  }

  listCompaniesNotLinkedToUser() {
    this.currentUser = this.sessionsService.getCurrent();
    this.companyService.getCompanies(this.getUserId()).subscribe(company => {
      this.companiesList = company.filter(
        companyItem =>
          companyItem.id != this.companiesToAdd.find(c => c == companyItem.id),
      );
    });
  }

  getManagements(newManagements = false) {
    if (this.managementsList.length === 0 || newManagements) {
      this.managementsService
        .getManagementsListByUser(this.getUserId())
        .subscribe(managements => {
          this.managementsList = managements;
        });
    }
  }

  updCompanyToUser(idManagement: number, management: Managements) {
    if (this.getUserId() > -1) {
      this.managementsService
        .updateCompanyToUser(idManagement)
        .then(response => {
          this.listCompaniesNotLinkedToUser();
          this.getManagements(true);
          this.snackBar.open('Desvinculado empresa com sucesso!', null, {
            duration: 3000,
          });
        });
    } else {
      this.onRemoveOneItem(management.company.id);
    }
  }
}
