import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Company } from 'app/shared/models/company.model';


@Component({
    selector: 'additional-information',
    templateUrl: 'additional-information.component.html',
    styleUrls: ['./additional-information.component.scss']
})

export class AddInformationComponent {

    @Input() company: Company;
    @Output() saved: EventEmitter<Company> = new EventEmitter();

    constructor() { }

    save(f: NgForm) {
        const company = Object.assign(
            new Company(),
            this.company
        );
        this.saved.emit(company);
    }

    onDesignatedCipaChange(value: any): void {
        this.company.isDesignatedCipa = value;
    }

    onSesmtChange(value: any): void {
        this.company.hasSesmt = value;
    }

    onCipaChange(value: any): void {
        this.company.hasCipa = value;
    }
}
