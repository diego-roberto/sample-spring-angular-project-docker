import { MdDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { ReportsService } from 'app/shared/services/reports.service';
import { Company } from 'app/shared/models/company.model';
import { SessionsService } from 'app/shared/services/sessions.service';
import { openNewTab } from 'app/shared/util/open-new-tab';

@Component({
  selector: 'company-report-dialog',
  templateUrl: './company-report-dialog.component.html',
  styleUrls: ['./company-report-dialog.component.scss']
})
export class CompanyReportDialogComponent implements OnInit {

  companyReportForm: FormGroup;
  constructionStatus: string[] = ['EM ANDAMENTO', 'PARALISADAS', 'FINALIZADAS']
  companies: Company[] = [];
  loading: boolean = false;

  reportRequest = {
    initialPeriod: undefined,
    finalPeriod: undefined,
    constructionStatus: undefined,
    company: undefined,
  };

  constructor(
    public dialogRef: MdDialogRef<CompanyReportDialogComponent>,
    private appMessage: AppMessageService,
    private reportsService: ReportsService,
    private sessionsService: SessionsService,
  ) {
    this.companyReportForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      constructionStatus: new FormControl('', [Validators.required]),
    });

    this.reportRequest.constructionStatus = this.constructionStatus;
    this.getCompaniesByUser();
  }

  ngOnInit() { }

  closeDialog() {
    this.dialogRef.close();
  }

  getCompaniesByUser() {
    this.reportsService.findNamesCompaniesByUserLogged().subscribe(response => {
      const { companyName } = this.sessionsService.getCurrentCompany();
      this.companies = response;
      this.reportRequest.company = [companyName];
    });
  }

  printReport() {
    this.loading = true;

    let andamento = false;
    let paralisada = false;
    let finalizada = false;

    this.reportRequest.constructionStatus.forEach((item) => {
      switch (item) {
        case 'EM ANDAMENTO':
          andamento = true;
          break;
        case 'PARALISADAS':
          paralisada = true;
          break;
        case 'FINALIZADAS':
          finalizada = true;
          break;
      }
    });

    const params = {
      namesCompanies: this.reportRequest.company,
      constructionFilterRequest: {
        andamento,
        paralisada,
        finalizada
      }
    }

    this.reportsService.findCompaniesAndConstructionsByUserLogged(params).subscribe(response => {
      this.reportsService.printCompaniesAndConstructionsReport(response).subscribe(response => {
        openNewTab(URL.createObjectURL(response));
        
        this.loading = false;
      });
    });
  }
}
