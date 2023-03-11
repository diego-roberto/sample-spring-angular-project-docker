import { SupplierContact } from 'app/shared/models/supplier-contact.model';
import { Component, OnInit, Input } from '@angular/core';

import { isNullOrUndefined } from 'util';

import { Supplier } from 'app/shared/models/supplier.model';

@Component({
  selector: 'supplier-overview-contact',
  templateUrl: './supplier-overview-contact.component.html',
  styleUrls: ['./supplier-overview-contact.component.scss']
})
export class SupplierOverviewContactComponent implements OnInit {

  @Input() supplier: Supplier;

  constructor() { }

  ngOnInit() {
  }

  isSupplierContactPhoneVisible(supplierContact: SupplierContact): boolean {
    return ! isNullOrUndefined(supplierContact) && ! isNullOrUndefined(supplierContact.phone);
  }

  isSupplierContactEmailVisible(supplierContact: SupplierContact): boolean {
    return ! isNullOrUndefined(supplierContact) && ! isNullOrUndefined(supplierContact.email);
  }

}
