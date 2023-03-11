import { Component, OnInit, OnChanges, EventEmitter, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CompanyContact } from 'app/shared/models/company-contact.model';
import { Company } from 'app/shared/models/company.model';
import { MaskUtil } from 'app/shared/util/mask.util';

@Component({
    selector: 'responsable-data',
    templateUrl: 'responsable-data.component.html',
    styleUrls: ['./responsable-data.component.scss']
})

export class ResponsableDataComponent implements OnChanges {

    @Input() company: Company;
    @Input() responsibleType: string;
    @Output() saved: EventEmitter<Company> = new EventEmitter();

    companyContact: CompanyContact;

    phoneFaxMask = MaskUtil.phoneMask;

    constructor() { }

    ngOnChanges() {
        if (this.company) {
            if (this.responsibleType === 'responsableData') {
                this.companyContact = this.company.responsibleCompany;
            } else if (this.responsibleType === 'responsableSstData') {
                this.companyContact = this.company.responsibleSst;
            } else if (this.responsibleType === 'responsableContactData') {
                this.companyContact = this.company.contact;
            }
        }

    }

    save(f: NgForm) {
        if (this.responsibleType === 'responsableData') {
            this.company.responsibleCompany = this.companyContact;
        } else if (this.responsibleType === 'responsableSstData') {
            this.company.responsibleSst = this.companyContact;
        } else if (this.responsibleType === 'responsableContactData') {
            this.company.contact = this.companyContact;
        }

        const company = Object.assign(
            new Company(),
            this.company
        );
        this.saved.emit(company);
    }
}
