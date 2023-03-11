import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MaskUtil } from 'app/shared/util/mask.util';
import { UtilValidators } from 'app/shared/util/validators.util';
import { isNullOrUndefined } from 'util';

import { AppMessageService } from 'app/shared/util/app-message.service';
import { CompanyService } from 'app/shared/services/company.service';

import { Company } from 'app/shared/models/company.model';
import { ConnectionsService } from 'app/shared/services/connections.service';
import { BusinessUnitService } from 'app/shared/services/business-unit.service';
import { TreeWraperComponent } from 'app/shared/components/tree-wraper/tree-wraper.component';
import { ITreeOptions } from 'angular-tree-component';

@Component({
  selector: 'create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {
  @ViewChild("tree") tree: TreeWraperComponent;

  company: Company;
  hasConnection: boolean = false;
  time = null;
  companyForm: FormGroup;
  cnpjMask = MaskUtil.cnpjMask;
  loadingStack: Set<string> = new Set<string>();
  integrationWasChecked: boolean = false;
  options: ITreeOptions = {
    useCheckbox: false,
    useTriState: false
  };
  nodes: any[] = [];
  businessTitle: string = "Selecione a unidade";
  showBusinessTree: boolean = false;
  businessUnitId: number;

  constructor(
    private service: CompanyService,
    private fb: FormBuilder,
    private connectionsService: ConnectionsService,
    private appMessageService: AppMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private businessUnitService: BusinessUnitService,
  ) {
    this.companyForm = this.fb.group({
      cnpj: new FormControl(undefined, Validators.compose([Validators.required, UtilValidators.cnpj])),
      corporateName: new FormControl(undefined, []),
      fakeName: new FormControl(undefined, Validators.required),
      integration: new FormControl(undefined, []),
      businessUnitId: new FormControl(undefined, Validators.required),
    });
  }

  ngOnInit(): void {
    this.company = new Company();
    this.getBussinessUnits();
    this.setHasConnection();
  }

  save() {
    this.addToLoadingStack('save');
    this.companyForm.disable();
    this.service.saveCompany(this.company).subscribe(company => {
      this.companyForm.enable();
      this.removeFromLoadingStack('save');
      if (!isNullOrUndefined(company.id)) {
        this.appMessageService.showSuccess('Empresa criada com sucesso!');
        this.redirectTo('../');
      }
    },
      error => {
        this.company.integration = false;
        this.companyForm.enable();
        this.removeFromLoadingStack('save');
        this.appMessageService.errorHandle(error, 'Erro ao criar a empresa!');
      });
  }

  onClickBusinessUnit() {
    if (this.nodes.length) {
      this.showBusinessTree = true;
    }
  }

  onEvent(event) {
    this.company.businessUnit = event.node.data;
    this.businessUnitId = this.company.businessUnit.id;
    this.showBusinessTree = false;
  }

  formatCnpj(cnpj: string) {
    return cnpj.split('-').join('').split('/').join('').split('.').join('');
  }

  cleanFields() {
    this.company.fakeName = null;
    this.company.corporateName = null;
  }

  disableSave() {
    return !(this.company.cnpj && this.company.corporateName && this.company.fakeName)
      || this.companyForm.invalid
      || this.isLoadingActive('save');
  }

  loadIntegrationCompany() {
    if (!this.company.cnpj) return;

    const cleanedCnpj = this.formatCnpj(this.company.cnpj);
    this.service.getIntegrationCompanies(cleanedCnpj).subscribe(response => {

      if (response) {
        const { razaoSocial, nomeFantasia } = response;
        this.company.fakeName = nomeFantasia;
        this.company.corporateName = razaoSocial;
      } else {
        this.appMessageService.showError('Não foi possível encontrar uma empresa com esse cnpj');
        this.company.integration = false;
        this.cleanFields();
      }
    }, error => {
      this.appMessageService.showError('Erro ao consultar cnpj');
    })
  }

  onIntegrationChange(event) {
    if (!event) {
      if(this.integrationWasChecked){
        this.cleanFields();
      }
      this.companyForm.get('corporateName').enable();
      this.companyForm.get('fakeName').enable();
    } else {
      this.companyForm.get('corporateName').disable();
      this.companyForm.get('fakeName').disable();
      this.loadIntegrationCompany();
    }
    this.integrationWasChecked = event;
  }

  onTypeCnpj() {
    if (this.company.integration) {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.loadIntegrationCompany();
      }, 1000);
    }
  }

  redirectTo(route) {
    this.router.navigate([route], { relativeTo: this.route });
  }

  onBlurCnpj(hasError) {
    if (hasError) {
      this.company.corporateName = null;
      this.company.fakeName = null;
    }
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

  getBussinessUnits() {
    this.businessUnitService.getAllBusinessUnit().subscribe(result => {
      this.nodes.push(result);

      this.tree.treeModel.update();
      this.tree.treeModel.expandAll();
    });
  }

  setHasConnection() {
    this.connectionsService.hasConnection().subscribe(response => {
      this.hasConnection = response;
    })
  }
}
