import { Component, OnInit, Input } from '@angular/core';

import { Supplier } from 'app/shared/models/supplier.model';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'supplier-overview-data',
  templateUrl: './supplier-overview-data.component.html',
  styleUrls: ['./supplier-overview-data.component.scss']
})
export class SupplierOverviewDataComponent implements OnInit {

  @Input() supplier: Supplier;

  constructor() { }

  ngOnInit() {
  }

  isSupplierCnaeVisible(): boolean {
    return ! isNullOrUndefined(this.supplier.cnae) && ! isNullOrUndefined(this.supplier.cnae.code);
  }

  isSupplierAddressVisible(): boolean {
    return ! isNullOrUndefined(this.supplier.addressStreet) && this.supplier.addressStreet !== '' || ! isNullOrUndefined(this.supplier.cep);
  }

  isSupplierUrlDomainVisible(): boolean {
    return ! isNullOrUndefined(this.supplier.urlDomain);
  }

}
