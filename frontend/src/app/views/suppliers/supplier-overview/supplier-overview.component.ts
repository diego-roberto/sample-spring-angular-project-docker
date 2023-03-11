import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import { SafetyCardComponent } from 'app/shared/components/safety-card';

import { SupplierService } from 'app/shared/services/supplier.service';

import { Supplier } from 'app/shared/models/supplier.model';

@Component({
  selector: 'supplier-overview',
  templateUrl: './supplier-overview.component.html',
  styleUrls: ['./supplier-overview.component.scss']
})
export class SupplierOverviewComponent implements OnInit {

  @ViewChild('supplierOverviewData') supplierOverviewData: SafetyCardComponent;
  @ViewChild('supplierOverviewContact') supplierOverviewContact: SafetyCardComponent;
  @ViewChild('supplierOverviewAdditionalInformation') supplierOverviewAdditionalInformation: SafetyCardComponent;
  @ViewChild('supplierOverviewDocumentation') supplierOverviewDocumentation: SafetyCardComponent;

  supplier: Supplier;

  loadingStack: Set<string> = new Set<string>();

  constructor(
    private dialogRef: MdDialogRef<SupplierOverviewComponent>,
    private supplierService: SupplierService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getSupplier();
  }

  getSupplier() {
    this.addToLoadingStack('getSupplier');
    this.supplierService.getSupplier(this.data.supplierId).subscribe(supplier => {
      this.supplier = supplier;
      this.removeFromLoadingStack('getSupplier');
    });
  }

  updateCardsClosed(cardOpen: SafetyCardComponent) {
    if (this.supplierOverviewData && this.supplierOverviewData !== cardOpen) {
      this.supplierOverviewData.close();
    }
    if (this.supplierOverviewContact && this.supplierOverviewContact !== cardOpen) {
      this.supplierOverviewContact.close();
    }
    if (this.supplierOverviewAdditionalInformation && this.supplierOverviewAdditionalInformation !== cardOpen) {
      this.supplierOverviewAdditionalInformation.close();
    }
    if (this.supplierOverviewDocumentation && this.supplierOverviewDocumentation !== cardOpen) {
      this.supplierOverviewDocumentation.close();
    }
  }

  redirectToEdit() {
    this.dialogRef.close(true);
  }

  addToLoadingStack(key: string) {
    this.loadingStack.add(key);
  }

  removeFromLoadingStack(key: string) {
    this.loadingStack.delete(key);
  }

  isLoadingActive(key?: string): boolean {
    if (key) { return this.loadingStack.has(key); }

    return this.loadingStack.size > 0;
  }

}
