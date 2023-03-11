import {
  Component,
  OnChanges,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";

import { MaskUtil } from "app/shared/util/mask.util";
import { UtilValidators } from "app/shared/util/validators.util";
import { Company } from "app/shared/models/company.model";
import { CompanyService } from "app/shared/services/company.service";
import { Cnae } from "app/shared/models/cnae.model";
import { isNullOrUndefined } from "util";
import { BusinessUnitService } from "../../../../shared/services/business-unit.service";
import { ITreeOptions } from "angular-tree-component";
import { PermissionService } from "../../../../shared/services/permission.service";
import { EnumPermission } from "../../../../shared/models/permission/enum-permission";
import { TreeWraperComponent } from "../../../../shared/components/tree-wraper/tree-wraper.component";
import { ConnectionsService } from "app/shared/services/connections.service";
import { AppMessageService } from "app/shared/util/app-message.service";
import { ManagementsService } from "app/shared/services/managements.service";
import { SessionsService } from "app/shared/services/sessions.service";
import { User } from "app/shared/models/user.model";

@Component({
  selector: "company-details",
  templateUrl: "company-details.component.html",
  styleUrls: ["./company-details.component.scss"]
})
export class CompanyDetailsComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() company: Company;
  @Output() saved: EventEmitter<Company> = new EventEmitter();
  @ViewChild("tree") tree: TreeWraperComponent;

  initialCompany: Company;
  canShow: boolean = false;
  companyUrlDomainOnEdit = false;
  focusOnUrlInputField = false;
  httpProtocolRegex = /http[s]?:[/]{2}.*/g;
  cnaeMask = MaskUtil.cnaeMask;
  cnpjMask = MaskUtil.cnpjMask;
  companyForm: FormGroup;

  nodes: any = [];
  options: ITreeOptions = {
    useCheckbox: false,
    useTriState: false
  };
  isAdmin: boolean;
  time = null;
  hasConnection: boolean = false;
  nodeId: any;
  businessTitle: any = "";
  businessUnitId = null;
  showBusinessTree: boolean = false;
  currentUser: User;
  currentCompany: any;

  constructor(
    private connectionsService: ConnectionsService,
    private fb: FormBuilder,
    private businessUnitService: BusinessUnitService,
    public permissionService: PermissionService,
    private service: CompanyService,
    private appMessageService: AppMessageService,
    private managementsService: ManagementsService,
    public sessionsService: SessionsService
  ) {
    this.currentUser = this.sessionsService.getCurrent();
    this.currentCompany = this.sessionsService.getCurrentCompany();

    this.companyForm = this.fb.group({
      cnpj: new FormControl(
        null,
        Validators.compose([Validators.required, UtilValidators.cnpj]),
      ),
      integration: new FormControl(null, Validators.compose([])),
      corporateName: new FormControl(),
      fakeName: new FormControl(),
      cnaeDescription: new FormControl(),
      addressStreet: new FormControl(),
      addressComplement: new FormControl(),
      addressNumber: new FormControl(),
      urlDomain: new FormControl(),
      cep: new FormControl(),
      businessUnitId: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {
    if (
      this.permissionService.hasSomePermission([
        EnumPermission.COMPANY_BUSINESS_UNIT_EDIT
      ])
    ) {
      this.businessUnitService.getAllBusinessUnit().subscribe(result => {
        this.nodes.push(result);

        this.tree.treeModel.update();
        this.tree.treeModel.expandAll();
      });
    }

    this.getUserProfile(this.currentUser.id, this.currentCompany.companyId);
    this.setHasConnection();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.company && this.company.id) {
      this.initialCompany = this.cloneCompany(this.company);

      if (this.company.integration) {
        this.disableFields();
      } else {
        this.enableFields();
      }

      if (this.company.businessUnit) {
        this.businessTitle = "UNIDADE DA EMPRESA";
        if (this.tree) {
          const activeNodeid = {};
          activeNodeid[this.company.businessUnit.id] = true;
          this.company.businessUnit.id;
          this.tree.treeModel.activeNodeIds = activeNodeid;
          this.businessUnitId = this.company.businessUnit.id;
        }
      } else {
        this.businessTitle = "Selecione a unidade";
      }
    }
  }

  ngAfterViewInit() { }

  async getUserProfile(userId, companyId) {
    await this.managementsService
      .getUserProfileListByUserAndCompany(userId, companyId)
      .then(
        userProfile => {
          userProfile.filter(profile => {
            if (profile.name === "Admin Sesi") {
              this.isAdmin = true;
            }
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  onClickBusinessUnit() {
    this.showBusinessTree = true;
  }

  onEvent(event) {
    this.nodeId = event.node.data.id;
    this.company.businessUnit = { ...event.node.data };
    this.showBusinessTree = false;
    this.businessUnitId = this.company.businessUnit.id;
  }

  isInvalid() {
    return !(!!this.company.cnpj && this.companyForm.valid)
  }

  save() {
    const company = Object.assign(new Company(), this.company);
    this.saved.emit(company);
  }

  cloneCompany(company: Company) {
    return JSON.parse(JSON.stringify(company));
  }

  disableCheckbox() {
    if (!this.isAdmin) {
      return true;
    }

    if (this.hasConnection) {
      return false;
    } else {
      if (this.initialCompany && this.initialCompany.integration && !this.hasConnection) {
        return false;
      }
      return true;
    }
  }

  onChangeIntegration() {
    if (this.company.integration) {
      this.disableFields();

      if (this.hasConnection) {
        this.loadIntegrationCompany();
      } else {
        if (this.initialCompany && this.initialCompany.integration) {
          this.company = this.cloneCompany(this.initialCompany);
        }
      }
    } else {
      this.enableFields();
    }
  }

  loadIntegrationCompany() {
    const cleanedCnpj = this.formatCnpj(this.company.cnpj);
    this.service.getIntegrationCompanies(cleanedCnpj).subscribe(response => {

      if (response) {
        const { razaoSocial, nomeFantasia, cepUnidade, numero, endereco, cnae, possuiSesmt, descricaoCnae } = response;
        this.company.fakeName = nomeFantasia;
        this.company.corporateName = razaoSocial;
        this.company.addressNumber = numero;
        this.company.addressStreet = endereco;
        this.company.cep = cepUnidade;
        this.company.cnae.code = cnae;
        this.company.cnae.description = descricaoCnae;
        this.company.hasSesmt = possuiSesmt;
        this.company.businessUnit = this.initialCompany.businessUnit;
      } else {
        this.appMessageService.showError('Não foi possível encontrar uma empresa com esse cnpj');
        this.company.integration = false;
      }

    }, error => {
      this.appMessageService.showError('Erro ao consultar cnpj');
      this.company.integration = false;
    })
  }

  formatCnpj(cnpj: string) {
    return cnpj.split('-').join('').split('/').join('').split('.').join('');
  }

  enableFields() {
    this.companyForm.get('cnpj').enable();
    this.companyForm.get('fakeName').enable();
    this.companyForm.get('addressStreet').enable();
    this.companyForm.get('corporateName').enable();
    this.companyForm.get('addressNumber').enable();
    this.companyForm.get('cnaeDescription').enable();
    this.companyForm.get('addressComplement').enable();
    this.companyForm.get('businessUnitId').enable();
  }

  disableFields() {
    this.companyForm.get('cnpj').disable();
    this.companyForm.get('fakeName').disable();
    this.companyForm.get('corporateName').disable();
    this.companyForm.get('addressStreet').disable();
    this.companyForm.get('addressNumber').disable();
    this.companyForm.get('cnaeDescription').disable();
    this.companyForm.get('addressComplement').disable();
    this.companyForm.get('businessUnitId').disable();
  }

  onSelectFile(file) {
    this.company.logoFile = file;
  }

  onRemoveFile() {
    this.company.logoUrl = undefined;
    this.company.logoFileName = undefined;
  }

  onCepSearch(data) {
    if (!data.cep) return

    this.company.cep = data.cep;
    this.company.addressStreet = data.completeAdress;
  }

  onCnaeSearch(data) {
    if (data) {
      this.company.cnae = new Cnae().initializeWithJson(data);
    }
  }

  onBlurCnpj(hasError) {
    if (hasError) {
      this.company.corporateName = null;
      this.company.fakeName = null;
    }
  }

  setCompanyUrlDomainOnEdit(onEdit: boolean) {
    this.companyUrlDomainOnEdit = onEdit;
    if (this.companyUrlDomainOnEdit) {
      this.focusOnUrlInputField = true;
    }
  }

  isCompanyUrlDomainOnEdit(): boolean {
    return (
      this.companyUrlDomainOnEdit ||
      isNullOrUndefined(this.company.urlDomain) ||
      this.company.urlDomain === ""
    );
  }

  normalizeUrlDomainProtocol(urlDomain: string): string {
    if (isNullOrUndefined(urlDomain.match(this.httpProtocolRegex))) {
      return "http://" + urlDomain;
    }
    return urlDomain;
  }

  setHasConnection() {
    this.connectionsService.hasConnection().subscribe(response => {
      this.hasConnection = response;
    })
  }
}
