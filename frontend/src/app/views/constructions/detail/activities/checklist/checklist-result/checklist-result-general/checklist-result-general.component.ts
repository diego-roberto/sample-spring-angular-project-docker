import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as Moment from 'moment';

import { UtilValidators } from 'app/shared/util/validators.util';
import { MaskUtil } from 'app/shared/util/mask.util';

import { Checklist } from 'app/shared/models/checklist.model';
import { ChecklistInfo } from 'app/shared/models/checklist-info';
import { ChecklistGeneralInfo } from 'app/shared/models/checklist-general-info';

import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { SessionsService } from '../../../../../../../shared/services/sessions.service';
import { CompanyService } from '../../../../../../../shared/services/company.service';
import { CompanyContact } from '../../../../../../../shared/models/company-contact.model';
import { DatePipe } from '@angular/common';
import { ChecklistResultService } from 'app/shared/services/checklist-result.service';

@Component({
    selector: 'checklist-result-general',
    templateUrl: './checklist-result-general.component.html',
    styleUrls: ['./checklist-result-general.component.scss']
})
export class ChecklistResultGeneralComponent implements OnInit {

    @Input() checklistInfos: ChecklistInfo;
    @Input() checklist: Checklist;

    @ViewChild('checklistResultGeneralCard') checklistResultGeneralCard: SafetyCardComponent;

    readonly title = 'DADOS GERAIS';

    cnpjMask = MaskUtil.cnpjMask;
    phoneMask = MaskUtil.phoneMask;
    generalForm: FormGroup;
    isUserSalesman: boolean;

    constructor(private fb: FormBuilder,
                private datepipe: DatePipe,
                private companyService: CompanyService,
                private sessionsService: SessionsService,
                private service: ChecklistResultService) {

        this.generalForm = this.fb.group({
            contract: new FormControl(''),
            validityFrom: new FormControl('', [UtilValidators.date]),
            validityTo: new FormControl('', [UtilValidators.date]),
            visitOf: new FormControl('', [UtilValidators.onlyPositiveNumbers]),
            visitUntil: new FormControl('', [UtilValidators.onlyPositiveNumbers]),
            date: new FormControl('', [UtilValidators.date]),
            companyName: new FormControl(''),
            cnpj: new FormControl('', [UtilValidators.cnpj]),
            address: new FormControl(''),
            contact: new FormControl(''),
            email: new FormControl(''),
            phone: new FormControl(''),
            applicator: new FormControl(''),
            revisor: new FormControl(''),
        });
    }

    ngOnInit() {
        this.generalForm.controls['date'].setValue(Moment().format('DD/MM/YYYY'));

        const currentUser = this.sessionsService.getCurrent();
        this.companyService.getCompany(currentUser.companyId).subscribe((company) => {

            let contact = company.contact;
            if (!contact) {
                contact = new CompanyContact();
            }

            this.checklistInfos.generalInfo.date = new Date(Moment().format('L'));
            this.checklistInfos.generalInfo.applicator = currentUser.name;
            this.checklistInfos.generalInfo.companyName = company.fakeName;
            this.checklistInfos.generalInfo.cnpj = company.cnpj;
            this.checklistInfos.generalInfo.address = company.addressStreet;
            this.checklistInfos.generalInfo.contact = contact.name;
            this.checklistInfos.generalInfo.email = contact.email;
            this.checklistInfos.generalInfo.phone = contact.phone;
        })

        this.service.userHasProfileSalesman(currentUser)
        .subscribe(response => {
            this.isUserSalesman = response.isUserSalesman;
            this.checklistInfos.generalInfo.isUserSalesman = response.isUserSalesman;
        });
    }
}
