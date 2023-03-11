import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SafetyCardComponent } from 'app/shared/components/safety-card';
import { SupplierDataFormComponent } from './supplier-data-form/supplier-data-form.component';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { SupplierService } from 'app/shared/services/supplier.service';

import { Supplier } from 'app/shared/models/supplier.model';
import { SupplierContact } from 'app/shared/models/supplier-contact.model';

import { PermissionService } from 'app/shared/services/permission.service';
import { EnumPermission } from 'app/shared/models/permission/enum-permission';

@Component({
    templateUrl: 'form.component.html',
    styleUrls: ['./form.component.scss']
})
export class SupplierFormComponent implements OnInit {

    @ViewChild('supplierData') supplierData: SafetyCardComponent;
    @ViewChild('supplierResponsible') supplierResponsible: SafetyCardComponent;
    @ViewChild('supplierResponsibleSst') supplierResponsibleSst: SafetyCardComponent;
    @ViewChild('supplierContact') supplierContact: SafetyCardComponent;
    @ViewChild('supplierDocumentation') supplierDocumentation: SafetyCardComponent;
    @ViewChild('supplierAdditionalInformation') supplierAdditionalInformation: SafetyCardComponent;

    @ViewChild('supplierDataForm') supplierDataForm: SupplierDataFormComponent;

    supplier: Supplier = new Supplier();

    showSupplierDocumentation = true;

    constructor(
        private supplierService: SupplierService,
        private appMessageService: AppMessageService,
        public permissionService: PermissionService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.doCheckSupplierToEdit();

        this.updateCardsClosed(this.supplierData);

        this.showSupplierDocumentation = this.permissionService.hasSomePermission([EnumPermission.COMPANY_SUPPLIERS_SHOW_SUPPLIER]);
    }

    doCheckSupplierToEdit() {
        this.route.params.subscribe(params => {
            const supplierId = params['id'];

            if (supplierId) {
                this.supplierService.getSupplier(supplierId).subscribe(supplier => {
                    this.supplier = supplier;
                    this.supplierDataForm.cnaePicker.searchCnae(this.supplier.cnae.code);
                });
            }
        });
    }

    doSaveSupplierData() {
        this.supplierService.saveSupplierData(this.supplier).subscribe(
            supplierSaved => {
                if (this.supplier.id) {
                    this.appMessageService.showSuccess('Dados da empresa fornecedora atualizados com sucesso!');
                } else {
                    this.supplier.id = supplierSaved.id;
                    this.appMessageService.showSuccess('Dados da empresa fornecedora salvos com sucesso!');
                }
                this.supplierResponsible.open();
            },
            error => {
                this.appMessageService.errorHandle(error, 'Erro ao salvar os dados da empresa fornecedora!');
            }
        );
    }

    doSaveSupplierResponsible() {
        if (! this.supplier.id) {
            this.appMessageService.showSuccess('Empresa fornecedora ainda não salva.');
            return;
        }

        this.supplierService.saveSupplierResponsible(this.supplier).subscribe(
            supplierResponsibleSaved => {
                if (this.supplier.supplierResponsible.id) {
                    this.appMessageService.showSuccess('Dados do responsável pela empresa fornecedora atualizados com sucesso!');
                } else {
                    this.supplier.supplierResponsible.id = supplierResponsibleSaved.id;
                    this.appMessageService.showSuccess('Dados do responsável pela empresa fornecedora salvos com sucesso!');
                }
                this.supplierResponsibleSst.open();
            },
            error => {
                this.appMessageService.errorHandle(error, 'Erro ao salvar os dados do responsável pela empresa fornecedora!');
            }
        );
    }

    doSaveSupplierResponsibleSST() {
        if (! this.supplier.id) {
            this.appMessageService.showSuccess('Empresa fornecedora ainda não salva.');
            return;
        }

        this.supplierService.saveSupplierResponsibleSST(this.supplier).subscribe(
            supplierResponsibleSSTSaved => {
                if (this.supplier.supplierResponsibleSST.id) {
                    this.appMessageService.showSuccess('Dados do responsável SST da empresa fornecedora atualizados com sucesso!');
                } else {
                    this.supplier.supplierResponsibleSST.id = supplierResponsibleSSTSaved.id;
                    this.appMessageService.showSuccess('Dados do responsável SST da empresa fornecedora salvos com sucesso!');
                }
                this.supplierContact.open();
            },
            error => {
                this.appMessageService.errorHandle(error, 'Erro ao salvar os dados do responsável SST da emprasa fornecedora!');
            }
        );
    }

    doSaveSupplierContact() {
        if (! this.supplier.id) {
            this.appMessageService.showSuccess('Empresa fornecedora ainda não salva.');
            return;
        }

        this.supplierService.saveSupplierContact(this.supplier).subscribe(
            supplierContactSaved => {
                if (this.supplier.supplierContact.id) {
                    this.appMessageService.showSuccess('Dados do contato da empresa fornecedora atualizados com sucesso!');
                } else {
                    this.supplier.supplierContact.id = supplierContactSaved.id;
                    this.appMessageService.showSuccess('Dados do contato da empresa fornecedora salvos com sucesso!');
                }

                if (this.showSupplierDocumentation) {
                    this.supplierDocumentation.open();
                } else {
                    this.supplierAdditionalInformation.open();
                }
            },
            error => {
                this.appMessageService.errorHandle(error, 'Erro ao salvar os dados do cantato da empresa fornecedora!');
            }
        );
    }

    doSaveSupplierDocumentationList() {
        if (! this.supplier.id) {
            this.appMessageService.showSuccess('Empresa fornecedora ainda não salva.');
            return;
        }

        this.supplierService.saveSupplierDocumentationList(this.supplier).subscribe(
            supplierDocumentationList => {
                this.supplier.supplierDocumentationList = supplierDocumentationList;
                this.appMessageService.showSuccess('Controle de documentos da empresa fornecedora salvos com sucesso!');

                this.supplierAdditionalInformation.open();
            },
            error => {
                this.appMessageService.errorHandle(error, 'Erro ao salvar o controle de documentos da empresa fornecedora!');
            }
        );
    }

    doSaveSupplierAdditionalInformation() {
        if (! this.supplier.id) {
            this.appMessageService.showSuccess('Empresa fornecedora ainda não salva.');
            return;
        }

        this.supplierService.updateSupplierAdditionalInformation(this.supplier).subscribe(
            supplierSaved => {
                this.appMessageService.showSuccess('Informações adicionais da empresa fornecedora atualizadas com sucesso!');
            },
            error => {
                this.appMessageService.errorHandle(error, 'Erro ao salvar as informações adicionais da empresa fornecedora!');
            }
        );
    }

    updateCardsClosed(cardOpen: SafetyCardComponent) {
        if (this.supplierData && this.supplierData !== cardOpen) {
            this.supplierData.close();
        }
        if (this.supplierResponsible && this.supplierResponsible !== cardOpen) {
            this.supplierResponsible.close();
        }
        if (this.supplierResponsibleSst && this.supplierResponsibleSst !== cardOpen) {
            this.supplierResponsibleSst.close();
        }
        if (this.supplierContact && this.supplierContact !== cardOpen) {
            this.supplierContact.close();
        }
        if (this.supplierDocumentation && this.supplierDocumentation !== cardOpen) {
            this.supplierDocumentation.close();
        }
        if (this.supplierAdditionalInformation && this.supplierAdditionalInformation !== cardOpen) {
            this.supplierAdditionalInformation.close();
        }
    }

    isSupplierResponsibleDisabled(): boolean {
        return this.supplier.id === undefined || this.supplier.id === null;
    }

    isSupplierResponsibleSstDisabled(): boolean {
        return this.supplier.id === undefined || this.supplier.id === null;
    }

    isSupplierContactDisabled(): boolean {
        return this.supplier.id === undefined || this.supplier.id === null;
    }

    isSupplierDocumentationDisabled(): boolean {
        return this.supplier.id === undefined || this.supplier.id === null;
    }

    isSupplierAdditionalInformationDisabled(): boolean {
        return this.supplier.id === undefined || this.supplier.id === null;
    }
}
