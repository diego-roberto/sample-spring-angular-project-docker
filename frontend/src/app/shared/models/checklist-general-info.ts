import { Clonable } from 'app/shared/util/generic/form/clonable';
import { Checklist } from './checklist.model';
import { ChecklistQuestion } from './checklist-question.model';

export class ChecklistGeneralInfo implements Clonable<ChecklistGeneralInfo> {

    contract: string;
    validityFrom: Date;
    validityTo: Date;
    visitOf: number;
    visitUntil: number;
    date: Date;
    companyName: string;
    cnpj: string;
    address: string;
    contact: string;
    email: string;
    phone: string;
    applicator: string;
    revisor: string;
    isUserSalesman: boolean;

    initializeWithJSON(json) {
        this.contract = json.contract;
        this.validityFrom = json.validityFrom;
        this.validityTo = json.validityTo;
        this.visitOf = json.visitOf;
        this.visitUntil = json.visitUntil;
        this.date = json.date;
        this.companyName = json.companyName;
        this.cnpj = json.cnpj;
        this.address = json.address;
        this.contact = json.contact;
        this.email = json.email;
        this.phone = json.phone;
        this.applicator = json.applicator;
        this.revisor = json.revisor;
        this.isUserSalesman = json.isUserSalesman;

        return this;
    }

    toJSON() {
        return {
            contract: this.contract,
            validityFrom: this.validityFrom,
            validityTo: this.validityTo,
            visitOf: this.visitOf,
            visitUntil: this.visitUntil,
            date: this.date,
            companyName: this.companyName,
            cnpj: this.cnpj,
            address: this.address,
            contact: this.contact,
            email: this.email,
            phone: this.phone,
            applicator: this.applicator,
            revisor: this.revisor,
            isUserSalesman: this.isUserSalesman
        };
    }

    clone(): ChecklistGeneralInfo {
        const checklistGeneralInfo = Object.assign(new ChecklistGeneralInfo(), this);

        return checklistGeneralInfo;
    }
}
