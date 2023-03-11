import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  AfterViewInit
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import {
  MdDialog,
  MdDialogRef,
  MdSelectChange
} from "@angular/material";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { isNullOrUndefined } from "util";
import * as Moment from "moment";

import { WorkerItemResolver } from "app/resolves/worker-item.resolver";
import { WorkerService } from "app/shared/services/worker.service";
import { CompanyService } from "app/shared/services/company.service";
import { Cbos } from "app/shared/models/cbos.model";
import { User } from "app/shared/models/user.model";
import { Company } from "app/shared/models/company.model";
import { MaskUtil } from "app/shared/util/mask.util";
import { SessionsService } from "app/shared/services/sessions.service";
import { UtilValidators } from "app/shared/util/validators.util";
import { Worker } from "app/shared/models/worker.model";
import { WorkerDetails } from "./worker-details-form.model";
import { WorkerFormBase } from "../worker-generic/worker-form-base";
import { WorkerCpfExistsDialogComponent } from "./worker-dialog/worker-cpf-exists-dialog.component";
import { SupplierService } from "app/shared/services/supplier.service";
import { AppMessageService } from "app/shared/util/app-message.service";
import { Supplier } from "app/shared/models/supplier.model";
import { environment } from "environments/environment";
import { PermissionService } from "app/shared/services/permission.service";
import { EnumPermission } from "app/shared/models/permission/enum-permission";
import { DegreeService } from "app/shared/services/degree.service";

@Component({
  selector: "worker-details-form",
  templateUrl: "./worker-details-form.component.html",
  styleUrls: ["./worker-details-form.component.scss"],
  providers: [WorkerService, CompanyService]
})
export class WorkersDataComponent extends WorkerFormBase<WorkerDetails>
  implements OnInit, AfterViewInit {
  @Output() savedWorkerDetails: EventEmitter<Object> = new EventEmitter();

  supportedFileTypes: Array<string> = ["image/jpeg", "image/jpg"];

  disabled = true;
  disableAll = true;
  myCbos: Cbos[] = [];
  cpf = "";
  hiredType: string;
  contract: string;
  companyName: string;
  workerForm: FormGroup;
  completeAddress: string;
  currentUser: User;
  company: Company;
  today = new Date();
  stateCtrl: FormControl;

  status = [
    { value: true, viewValue: "Ativo" },
    { value: false, viewValue: "Inativo" }
  ];

  hireds = [
    { value: true, viewValue: "Próprio", label: "Próprio" },
    { value: false, viewValue: "Terceiro", label: "Terceiro" }
  ];

  necessitys = [
    { value: true, viewValue: "Sim" },
    { value: false, viewValue: "Não" }
  ];

  contracts = [
    { value: "CLT", viewValue: "CLT" },
    { value: "CONTRATO PJ", viewValue: "CONTRATO PJ" }
  ];

  profiles = [];
  scholaritys = [];

  listAdditionalFunctions = [];
  listFilteredAdditionalFunctions = [];

  accessCardMask = MaskUtil.accessCardMask;
  ctpsMask = MaskUtil.ctpsMask;
  cpfMask = MaskUtil.cpfMask;
  cnpjMask = MaskUtil.cnpjMask;
  nitMask = MaskUtil.nitMask;
  cboMask = MaskUtil.cboMask;
  phoneMask = MaskUtil.phoneMask;
  complement = MaskUtil.variableLengthMask(MaskUtil.noSpecialChars, 255);

  supplierList: Supplier[] = [];

  constructor(
    protected workerItemResolver: WorkerItemResolver,
    private fb: FormBuilder,
    private router: Router,
    public service: WorkerService,
    private companyService: CompanyService,
    private sessionsService: SessionsService,
    private permissionService: PermissionService,
    private degreeService: DegreeService,
    public dialog: MdDialog,
    private appMessage: AppMessageService,
    private supplierService: SupplierService
  ) {
    super(workerItemResolver);

    this.workerForm = this.fb.group({
      fullname: new FormControl("", [
        Validators.required,
        UtilValidators.onlytext,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      cpf: new FormControl(
        "",
        [Validators.required, UtilValidators.cpf],
      ),
      contract: [""],
      contractCnpj: new FormControl("", [UtilValidators.cnpj]),
      ctps: new FormControl("", [UtilValidators.ctps]),
      birthDate: new FormControl("", [UtilValidators.date]),
      age: new FormControl({ value: "", disabled: this.hiredType }, null),
      nit: new FormControl(""),
      cep: new FormControl(this.model.cep, UtilValidators.cep),
      completeAddress: null,
      admissionDate: new FormControl("", [Validators.required, UtilValidators.date]),
      complement: null,
      contact: new FormControl(""),
      cbo: new FormControl("", [Validators.required, UtilValidators.cbo]),
      textArea: null,
      additionalFunction: null,
      company: new FormControl({ value: "", disabled: this.hiredType }, null),
      hiredTypeRadio: null,
      sex: null,
      role: new FormControl(null, [Validators.required]),
      supplier: null,
      scholarity: [""],
      necessitys: [""],
      status: [""],
      register: new FormControl({ value: "", disabled: true }, null),
      profiles: [""],
      accessCard: new FormControl("", [Validators.minLength(8), Validators.maxLength(8)]),
    },
    {
      validator: UtilValidators.birthAndAdmissionDateVerify
    }
    );

    this.currentUser = this.sessionsService.getCurrent() || new User();
  }

  async ngOnInit() {
    this.workerForm.controls.age.disable();
    this.workerForm.controls.contractCnpj.disable();

    if (!this.permissionService.hasPermission(EnumPermission.COMPANY_WORKERS_EDIT_WORKER_PROFILE)) {
      this.workerForm.controls.profiles.disable();
    }

    this.companyService
      .getCompany(this.currentUser.companyId)
      .subscribe(company => {
        this.company = company;

        if (this.isCreating() || this.model.contractType === "Terceiro") {
          if (this.company.integration) {
            this.model.contractType = "Terceiro";
            this.workerForm.controls.hiredTypeRadio.disable()
          }
        } else {
          if (this.model.integration) {
            this.disableFields();
          }
        }

        if (
          this.model.contractType === "Próprio" ||
          isNullOrUndefined(this.model.contractType)
        ) {
          this.hiredType = "Próprio";
          this.model.contractType = "Próprio";
          this.model.company = this.company.fakeName;
          this.workerForm.controls.supplier.disable();
          this.workerForm.controls.company.disable();
          this.workerForm.controls.register.disable();

        } else {
          this.workerForm.controls.supplier.enable();
          this.hiredType = "Terceiro";
        }
      });

    if (!isNullOrUndefined(this.model.birthDate)) {
      this.model.birthDate = new Date(this.model.birthDate);
    }

    this.getSupplierList();
    this.getDegreesList();
    this.setRegister();

    this.service
      .getAllAdditionalFunctions()
      .subscribe(listAdditionalFunctions => {
        this.listAdditionalFunctions = listAdditionalFunctions;
        this.filterAdditionalFunctions(this.model.additionalFunction);
      });
    this.getTurnstileProfiles();

  }

  disableFields() {
    this.workerForm.get('fullname').disable()
    this.workerForm.get('cpf').disable()
    this.workerForm.get('contract').disable()
    this.workerForm.get('birthDate').disable()
    this.workerForm.get('nit').disable()
    this.workerForm.get('admissionDate').disable()
    this.workerForm.get('textArea').disable()
    this.workerForm.get('company').disable()
    this.workerForm.get('hiredTypeRadio').disable()
    this.workerForm.get('sex').disable()
    this.workerForm.get('supplier').disable()
    this.workerForm.get('status').disable()
    this.workerForm.get('contractCnpj').disable()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.workerForm.controls.cbo.setValue(this.model.cbos.code);
    }, 0);
  }

  setRegister() {
    if (!this.model.register) {
      this.model.register = 'MANUAL';
    }

    if (this.model.integration) {
      if (this.model.register !== "MANUAL") {
        this.model.register = 'INTEGRAÇÃO';
      }
    }
  }

  showRegisterMessage() {
    if (this.model.integration && this.model.contractType === 'Próprio') {
      if (this.model.register === "MANUAL") {
        return true;
      }
    }
    return false;
  }

  filterAdditionalFunctions(val: string) {
    if (val) {
      const filterValue = val.toLowerCase();
      this.listFilteredAdditionalFunctions = this.listAdditionalFunctions.filter(
        item => item.toLowerCase().startsWith(filterValue)
      );
    } else {
      this.listFilteredAdditionalFunctions = this.listAdditionalFunctions;
    }
  }

  hiredChange(value) {
    this.hiredType = value.value;

    if (this.hiredType === "Terceiro") {
      this.model.company = "";
      this.workerForm.controls.supplier.enable();
    } else {
      if (this.hiredType === "Próprio") {
        this.model.supplier = null;
        this.model.company = this.company.fakeName;
        this.workerForm.enable();
        this.workerForm.controls.contractCnpj.disable();
        this.workerForm.controls.supplier.disable();
        this.workerForm.controls.company.disable();
        this.workerForm.controls.age.disable();
        this.workerForm.controls.register.disable();
        this.disableAll = true;
      }
    }

    this.workerForm.controls.age.disable();
  }

  supplierChange() {
    this.model.company = this.model.supplier.traddingName;
  }

  companyChange(newCompany: string) {
    this.companyName = newCompany;
    this.model.company = newCompany;

    if (newCompany) {
      this.workerForm.controls.age.disable();
      this.disableAll = true;
      this.workerForm.enable();
    } else {
    }
  }

  contractChange(event: MdSelectChange) {
    if (this.model.contract === "CONTRATO PJ") {
      this.workerForm.controls.contractCnpj.enable();
    } else if (this.model.contract === "CLT") {
      this.model.contractCnpj = null;
      this.workerForm.enable();
      this.workerForm.controls.contractCnpj.disable();
      this.workerForm.controls.supplier.disable();
      this.workerForm.controls.company.disable();
      this.workerForm.controls.age.disable();
      this.workerForm.controls.register.disable();
      this.disableAll = true;
    }

    this.workerForm.controls.age.disable();
  }

  protected create(): WorkerDetails {
    return new WorkerDetails();
  }

  onCepSearch(data) {
    this.model.cep = data.cep;
    this.model.completeAddress = data.completeAdress;
  }

  convertAccessCard(data){
    this.model.accessCard =  data.replace('-', '');
  }

  ageWorker(date) {
    if (!isNullOrUndefined(date)) {
      const moment = Moment().set({ h: 0, m: 0, s: 0 });
      if (Moment(date).isValid()) {
        this.model.birthDate = date;
        this.model.age = moment.diff(Moment(date), "y").toString();
        return;
      }
    }

    // Validações adicionadas para evitar ExpressionChangedAfterItHasBeenCheckedError
    if (this.model.birthDate) {
      this.model.birthDate = null;
    }
    if (this.model.age || this.model.age !== "") {
      this.model.age = "";
    }
  }

  getImgFile(imageFile: File) {
    this.model.imageFile = imageFile;
  }

  fileRemoved() {
    this.model.imageFile = null;
    this.model.photoFilename = null;
    this.model.photoUrl = null;
  }

  async saveWorker() {
    this.validateWorkerDetails(this.workerForm);
    const allowToSave = await this.checkWorkerAlreadyExists();

    if(allowToSave) {
      this.savedWorkerDetails.emit({
        modelToSave: this.model,
        onSaved: worker => {
          this.workerForm.updateValueAndValidity();
        }
      });
    }
  }

  /**
   * Metodo responsavel por fazer as validacoes dos campos do formulario de trabalhadores.
   * @param form form a ser validado
   */
  validateWorkerDetails(form: FormGroup): string {
    if (form.invalid) {
      const controls = form.controls;
      let msg: string;

      // Valida cpf vazio||invalido
      if (!isNullOrUndefined(controls.cpf.errors)) {
        msg = controls.cpf.errors.required
          ? "O Campo CPF não pode ser nulo!"
          : "O CPF digitado é inválido!";

        // Valida nome vazio||invalido
      } else if (!isNullOrUndefined(controls.fullname.errors)) {
        msg = controls.fullname.errors.required
          ? "O Campo Nome não pode ser nulo!"
          : controls.fullname.errors.minlength
            ? "Nome deve ter no minimo 3 carácteres"
            : "Nome é inválido!";
        // valida CBO vazio||invalido
      } else if (!isNullOrUndefined(controls.cbo.errors)) {
        msg = controls.cbo.errors.required
          ? "O Campo CBO não pode ser nulo!"
          : "CBO é inválido!";
        // valida ctps vazio||invalido
      } else if (!isNullOrUndefined(controls.ctps.errors)) {
        msg = controls.ctps.errors.required
          ? "O Campo CTPS não pode ser nulo!"
          : "CTPS é inválido!";
        // valida contato vazio||invalido
      } else if (!isNullOrUndefined(controls.contact.errors)) {
        msg = controls.contact.errors.required
          ? "O Campo Contato não pode ser nulo!"
          : "Contato é inválido!";
        // Valida Nº do Cartão de Acesso vazio||invalido
      } else if (!isNullOrUndefined(controls.accessCard.errors)) {
        msg = controls.accessCard.errors.minlength
            ? "Nº do Cartão de Acesso deve ter no mínimo 8 carácteres"
            : "Nº do Cartão de Acesso é inválido!";
      }

      return msg;
    }
    return "";
  }

  searchFilteredCbo(cbo: string) {
    const subscription: Subscription = this.workerForm.controls.cbo.statusChanges.subscribe(
      s => {
        subscription.unsubscribe();

        if (!cbo) {
          return;
        }

        cbo = cbo.replace(/[^-\d]/g, "");

        if (this.workerForm.controls.cbo.valid) {
          this.service.getWorkerCBOByCodeLike(cbo).subscribe(cboWrapper => {
            // Preenche a lista de CBOs encontradas
            this.myCbos = isNullOrUndefined(cboWrapper.cbos)
              ? []
              : this.initializeListCbo(cboWrapper.cbos);

            // Adiciona o erro de não encontrado
            if (this.myCbos.length === 0) {
              this.workerForm.controls.cbo.setErrors({ notFoundCbo: true });
            }

            // Se o código da CBOs selecionada for igual à CBO que está preenchida no Control desconsiderando
            // as letras das repetições de CBO, então considera que o campo de filtro está sendo preenchido
            // não pelo usuário mas programaticamente. Isso acontece quando abre a tela em modo de edição.
            if (
              this.model.cbos.code &&
              this.model.cbos.code.replace(/[^-\d]/g, "") === cbo
            ) {
              this.model.cbos = this.myCbos.find(
                cbos => cbos.id === this.model.cbos.id
              );
              return;
            }

            // Se não tiver nenhuma CBO ou tiver mais de uma, então coloca como uma CBOs com a única informação
            // que a gente sabe até o momento, que é o código da CBO
            this.model.cbos =
              this.myCbos.length === 1
                ? this.myCbos[0]
                : new Cbos().initializeWithJSON({ code: cbo });
          });
        } else {
          this.myCbos = [];
          this.model.cbos = new Cbos().initializeWithJSON({ code: cbo });
        }
      }
    );
  }

  private initializeListCbo(arrayCbos: Object[]): Cbos[] {
    const cbos: Cbos[] = [];
    for (let i = 0; i < arrayCbos.length; i++) {
      cbos.push(new Cbos().initializeWithJSON(arrayCbos[i]));
    }
    return cbos;
  }

  async checkWorkerAlreadyExists(): Promise<boolean> {
    const isEditing = !this.isCreating();
    const cpf = this.model.cpf;

    return await new Promise<boolean>((resolve, reject) => {

      console.log({ isEditing });
      if (isEditing){
        const workerBeforeEdit = this.workerItemResolver.getValue();
        const workerAfterEdit = this.model;

        console.log({ workerBeforeEdit, workerAfterEdit });
        if (workerBeforeEdit.cpf === workerAfterEdit.cpf) {
          return resolve(true);
        }
      }

      this.service
      .getWorkerByCpf(cpf)
      .subscribe(workerWithSameCPF => {
        const currentWorker = this.model;
        const { name, cpf, id, status } = workerWithSameCPF;

        console.log({ currentWorker, workerWithSameCPF })
        let isSameCompany = false;
        if(workerWithSameCPF.contractType === 'Próprio' && currentWorker.contractType === 'Próprio'){
          isSameCompany = true;
        } else if(workerWithSameCPF.supplier && currentWorker.supplier) {
          if(workerWithSameCPF.supplier.id == currentWorker.supplier.id){
            isSameCompany = true;
          }
        }

        console.log({ isSameCompany });
        console.log({ isActive: status });
        if(status) {
          let dialogRef: MdDialogRef<WorkerCpfExistsDialogComponent>;
          dialogRef = this.dialog.open(WorkerCpfExistsDialogComponent);
          dialogRef.componentInstance.name = name;
          dialogRef.componentInstance.cpf = cpf;
          dialogRef.componentInstance.sameCompany = isSameCompany;

          dialogRef.componentInstance.removed.subscribe(({ wantToEdit }) => {
            dialogRef.close();

            console.log({ wantToEdit });
            if(wantToEdit){
              this.router.navigate([
                "/workers/" + id + "/edit"
              ]);

              return resolve(false);
            } else {
              if(isSameCompany) {
                return resolve(false);
              } else {
                return resolve(true);
              }
            }
          });
         } else {
           return resolve(true);
         }

      }, error => {
        if(error.status === 404){
          return resolve(true);
        }

        this.appMessage.showError('Erro no servidor!');
        return resolve(false);
      });
    });
  }

  getSupplierList() {
    this.supplierService.getAllSupplierList().subscribe(
      response => {
        this.supplierList = response;
        if (this.model.supplier && this.model.supplier != null) {
          this.supplierList.map(item => {
            if (item.id === this.model.supplier.id) {
              this.model.supplier = item;
              this.model.company = item.traddingName;
            }
          });
        }
      },
      error => {
        this.appMessage.errorHandle(error, null);
      }
    );
  }

  getDegreesList() {
    this.degreeService.getAllDegrees().subscribe(
      response => {
        this.scholaritys = response;
      }
    );
  }

  getAvatar() {
    if (this.model.photoUrl && this.model.photoFilename) {
      return (
        environment.backendUrl +
        this.model.photoUrl +
        "?t=" +
        this.model.photoFilename
      );
    } else {
      return "assets/no-image-placeholder.jpg";
    }
  }

  disableForm() {
    return this.workerForm.invalid || !this.model.company || !this.model.cbos.title
  }

  private getTurnstileProfiles() {
    this.service.getTurnstileProfiles().subscribe(items => {
      this.profiles = items;
      if (this.model.profile == null) {
        this.model.profile = this.profiles[0].value;
      }
    },
      error => this.appMessage.errorHandle(error, null));
  }
}

/**
 * Classe privada utilizada como retorno da caixa de diálogo de CPF já existente.
 * Contém um boolean informando se o usuário quer redirecionar, e a instância
 * do trabalhador encontrado.
 */
class RedirectWorker {
  constructor(public redirect: boolean, public worker: Worker) { }
}
