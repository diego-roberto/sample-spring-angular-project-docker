import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSlideToggleChange, MdDialog } from '@angular/material';

import { ConfirmDialogHandler } from 'app/shared/util/generic/confirm-dialog/confirm-dialog.handler';

import { SupplierOverviewComponent } from 'app/views/suppliers/supplier-overview/supplier-overview.component';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { SupplierService } from 'app/shared/services/supplier.service';

import { Supplier } from 'app/shared/models/supplier.model';


@Component({
    selector: 'line-supplier',
    templateUrl: './line-supplier.component.html',
    styleUrls: ['./line-supplier.component.scss']
})
export class LineSupplierDetailComponent {
    @Input() supplier: Supplier;

    loadingStack: Set<string> = new Set<string>();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private supplierService: SupplierService,
        private appMessageService: AppMessageService,
        private confirmDialogHandler: ConfirmDialogHandler,
        private dialog: MdDialog,
    ) { }

    redirectTo(url) {
        this.router.navigate([url], { relativeTo: this.activatedRoute });
    }

    suplierActiveSlideToggleChangeHandler(event: MdSlideToggleChange) {
        if (! event.checked && this.supplier.active) {
            this.confirmDialogHandler.call('Inativar Fornecedor', 'ATENÇÃO! Esta ação irá inativar todos os trabalhadores atrelados a este fornecedor. Deseja continuar?', { trueValue: 'Sim', falseValue: 'Não' }).subscribe((confirm) => {
                if (confirm) {
                    this.doToggleSupplierActive(event.checked);
                } else {
                    event.source.toggle();
                }
            });
        } else if (event.checked && ! this.supplier.active) {
            this.doToggleSupplierActive(event.checked);
        }
    }

    doToggleSupplierActive(value: boolean) {
        this.addToLoadingStack('doToggleSupplierActive');
        this.supplierService.updateSupplierActive(this.supplier.id, value).subscribe(response => {
            this.supplier.active = response.active;
            this.removeFromLoadingStack('doToggleSupplierActive');
        },
        error => {
            this.appMessageService.errorHandle(error, 'Erro ao ativar/inativar a empresa fornecedora!');
            this.removeFromLoadingStack('doToggleSupplierActive');
        });
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

    openSupplierOverviewDialog() {
        const dialogRef = this.dialog.open(SupplierOverviewComponent, { data: { supplierId: this.supplier.id }, width: '75%' });
        dialogRef.afterClosed().subscribe(value => {
            if (value) {
                this.redirectTo('/suppliers/' + this.supplier.id + '/edit');
            }
        });
    }

}
