import { Component, OnInit, Input } from '@angular/core';

import { Supplier } from 'app/shared/models/supplier.model';

@Component({
  selector: 'supplier-overview-additional-information',
  templateUrl: './supplier-overview-additional-information.component.html',
  styleUrls: ['./supplier-overview-additional-information.component.scss']
})
export class SupplierOverviewAdditionalInformationComponent implements OnInit {

  @Input() supplier: Supplier;

  constructor() { }

  ngOnInit() {
  }

}
