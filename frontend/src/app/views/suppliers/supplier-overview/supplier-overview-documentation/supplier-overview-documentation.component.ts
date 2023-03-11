import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

import { isNullOrUndefined } from 'util';

import { Supplier } from 'app/shared/models/supplier.model';
import { SupplierDocumentation } from 'app/shared/models/supplier-documentation.model';

@Component({
  selector: 'supplier-overview-documentation',
  templateUrl: './supplier-overview-documentation.component.html',
  styleUrls: ['./supplier-overview-documentation.component.scss']
})
export class SupplierOverviewDocumentationComponent implements OnInit {

  @Input() supplier: Supplier;

  supplierDocumentationToShowList: SupplierDocumentation[];

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.supplierDocumentationToShowList = this.supplier.supplierDocumentationList.filter(supplierDocumentation => ! this.isSupplierDocumentationRenew(supplierDocumentation));
  }

  isSupplierDocumentationLate(supplierDocumentation: SupplierDocumentation): boolean {
    return this.doCompareWithToday(supplierDocumentation.dueDate) === -1;
  }

  isSupplierDocumentationRenew(supplierDocumentation: SupplierDocumentation): boolean {
    return ! isNullOrUndefined(supplierDocumentation.shelved) && ! supplierDocumentation.shelved;
  }

  private doCompareWithToday(date: Date): number {
      if (isNullOrUndefined(date)) { return; }

      const today = new Date(this.datePipe.transform(new Date(), 'MM/dd/yyyy'));
      const dateToCompare = new Date(this.datePipe.transform(date, 'MM/dd/yyyy'));

      if (dateToCompare < today) { return -1; }
      if (dateToCompare > today) { return 1; }

      return 0;
  }

}
