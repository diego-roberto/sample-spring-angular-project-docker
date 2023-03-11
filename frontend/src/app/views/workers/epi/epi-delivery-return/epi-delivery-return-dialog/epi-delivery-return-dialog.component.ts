import { forEach } from '@angular/router/src/utils/collection';
import { IndividualEquipmentWorker } from 'app/shared/models/individual-equipment-worker.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as Moment from 'moment';

import { EpiWorkers } from 'app/shared/models/epi-workers.model';
import { CaEpi } from 'app/shared/models/ca-epi.model';
import { WorkerService } from 'app/shared/services/worker.service';
import { EpiWorkersService } from 'app/shared/services/epi-workers.service';
import { CaEpiService } from 'app/shared/services/ca-epi.service';
import { CaEpiListResolver } from 'app/resolves/ca-epi-list.resolver';
import { UtilValidators } from 'app/shared/util/validators.util';
import { Worker } from 'app/shared/models/worker.model';
import { EpiConfirmFormComponent } from 'app/views/workers/epi/epi-delivery-return/epi-confirm-form/epi-confirm-form.component';
import { IndividualEquipment } from 'app/shared/models/individual-equipment.model';
import { IndividualEquipmentWorkerService } from 'app/shared/services/individual-equipment-worker.service';

@Component({
  selector: 'safety-epi-delivery-return-dialog',
  templateUrl: './epi-delivery-return-dialog.component.html',
  styleUrls: ['./epi-delivery-return-dialog.component.scss']
})
export class EpiDeliveryReturnDialogComponent implements OnInit {

  // SUB-TITULOS
  readonly quantityMsg = 'Insira a quantidade de EPI';
  readonly returnMsg = 'Selecione o trabalhador e o EPI para devolução';
  readonly deliveryMsg = 'Selecione o trabalhador e o EPI para entrega';
  readonly deliveryMidMsg = 'Selecione os EPI para entrega';
  readonly confirmDeliveryMsg = 'Confirmação de entrega';
  readonly confirmDeliveryReturnMsg = 'Confirmação de devolução e entrega';

  // LABELS BOTOES
  readonly btnLabelDelivery = 'Entregar EPI';
  readonly btnLabelReturn = 'Devolver EPI';
  readonly btnLabelConfirm = 'Colher assinatura da ficha de EPI';
  readonly btnLabelLast = 'Finalizar';
  readonly btnLabelNext = 'Próximo';

  // MENSAGEM SUCESSO
  readonly deliverySuccess = 'Entrega Efetuada!';
  readonly returnSuccess = 'Devolução Efetuada!';
  readonly deliveryReturnSuccess = 'Devolução e Entrega Efetuada!';

  // CAMPOS DATA
  readonly returnDateMsg = 'Data Devolução';
  readonly deliverDateMsg = 'Data de Entrega';
  readonly deliverReturnDateMsg = 'Data de Devolução/Entrega';

  @ViewChild('epiConfirmForm') epiConfirmForm: EpiConfirmFormComponent;

  title: String;
  type: Number;
  step = 1;
  totalStep: Number;
  stepTitle: String;
  stage: String;
  workers: Array<Worker> = [];
  epiDeliveryReturnForm: FormGroup;
  filteredOptions: Observable<Worker[]>;
  worker: Worker | string;
  epiWorkers: Array<EpiWorkers> = [];
  individualEquipmentWorkerList: Array<IndividualEquipmentWorker> = [];
  returnDate;
  deliveryDate;
  caEpisQuantitySum = new Map<number, number>();

  buttonText: string;
  saveMsg: string;
  dateMsg: string;

  tomorrow = new Date();

  workerSubject = new Subject<any>();
  individualEquipmentWorkerSubject = new Subject<any>();
  loanedCaEpis: CaEpi[] = [];
  loanedIndividualEquipmentList: IndividualEquipment[] = [];

  showDeliveryDate = false;
  showReturnDate = false;
  showDeliveryDisabledDate = false;
  showReturnDisabledDate = false;
  onSaveDisable = false;
  quantityComponentDataDisabled: boolean = true;

  quantityComponentData = {
    deliver: new Array<CaEpi>(),
    return: new Array<CaEpi>(),
    form: new FormGroup({}),
    availableDeliverEpi: new Map<Number, any>(),
    availableReturnEpi: new Map<Number, any>(),

    deliveryIndividualEquipmentList: new Array<IndividualEquipment>(),
    returnIndividualEquipmentList: new Array<IndividualEquipment>(),
    availableDeliveryIndividualEquipment: new Map<Number, any>(),
    availableReturnIndividualEquipment: new Map<Number, any>(),
  };
  saveFn: () => Observable<any[]>;

  deliveryControls = new Map<String, FormControl>();
  returnControls = new Map<String, FormControl>();
  deliveryIndividualEquipmentControls = new Map<String, FormControl>();
  returnIndividualEquipmentControls = new Map<String, FormControl>();

  constructor(
    private workerService: WorkerService,
    public dialogRef: MdDialogRef<EpiDeliveryReturnDialogComponent>,
    public epiWorkersService: EpiWorkersService,
    private individualEquipmentWorkerService: IndividualEquipmentWorkerService,
    @Inject(MD_DIALOG_DATA) public data: any,
    public snackBar: MdSnackBar,
    public caeEpiService: CaEpiService,
    public caEpiListResolver: CaEpiListResolver
  ) {
    this.epiDeliveryReturnForm = new FormGroup({
      worker: new FormControl('', [Validators.required, this.validateWorker()]),
      returnDate: new FormControl('', [Validators.required, UtilValidators.date]),
      deliveryDate: new FormControl('', [Validators.required, UtilValidators.date])
    });

    this.type = data.type;
    this.totalStep = this.setTotalStep(this.type);
    this.stage = this.resolveRoute();
    this.setTitleAndSaveFn(this.type);
  }

  ngOnInit() {

    let filter = {

      activatedStatus: [true],
    }

    this.workerService.getWorkerListByFilter(filter).subscribe((workers: Worker[]) => {
      this.workers = workers;
      this.filteredOptions = this.epiDeliveryReturnForm.controls.worker.valueChanges.startWith(null).map(
        worker => worker && typeof worker === 'object' ? worker.name : worker
      ).map(
        name => !name || name.length < 1 ? this.workers.slice() : this.workers.filter(worker => new RegExp(`^${name}`, 'gi').test(worker.name))
      );
    });
  }

  workerSelected(worker: Worker, event) {
    if (event.isUserInput && (this.type === 1) || (this.type === 3 && this.step === 1)) {
      this.epiWorkersService.getEpiOfWorkerList(worker.id).subscribe(epiWorkers => {
        this.epiWorkers = epiWorkers;
        this.loanedCaEpis = [];

        for (const epiWorker of this.epiWorkers) {
          if (!this.loanedCaEpis.some(c => c.ca.ca === epiWorker.caEpiId.ca.ca)) {
            this.loanedCaEpis.push(epiWorker.caEpiId);
          }
        }
        this.filterLoaned();
        this.quantityComponentData.return = [];
        this.workerSubject.next(this.loanedCaEpis);
      });

      this.individualEquipmentWorkerService.getIndividualEquipmentsLoanedByWorker(worker.id).subscribe(individualEquipmentsLoaned => {
        this.individualEquipmentWorkerList = individualEquipmentsLoaned;
        this.loanedIndividualEquipmentList = [];

        for (const individualEquipmentWorker of this.individualEquipmentWorkerList) {
          if (!this.loanedIndividualEquipmentList.some(loanedIndividualEquipment => loanedIndividualEquipment.id === individualEquipmentWorker.individualEquipment.id)) {
            this.loanedIndividualEquipmentList.push(individualEquipmentWorker.individualEquipment);
          }
        }

        this.filterIndividualEquipmentLoaned();
        this.quantityComponentData.returnIndividualEquipmentList = [];
        this.individualEquipmentWorkerSubject.next(this.loanedIndividualEquipmentList);
      });
    }
  }

  filterLoaned() {
    if (this.quantityComponentData.return && this.quantityComponentData.return.length > 0) {
      for (const epi of this.quantityComponentData.return) {
        if (this.loanedCaEpis.find(x => x.id === epi.id)) {
          this.loanedCaEpis.splice(this.loanedCaEpis.indexOf(this.loanedCaEpis.find(x => x.id === epi.id)), 1);
        }
      }
    }
  }

  filterIndividualEquipmentLoaned() {
    for (const individualEquipment of this.quantityComponentData.returnIndividualEquipmentList) {
      this.loanedIndividualEquipmentList = this.loanedIndividualEquipmentList.filter(loanedIndividualEquipment => loanedIndividualEquipment.id !== individualEquipment.id);
    }
  }

  resolveRoute() {
    switch (this.type) {
      // RETORNO
      case 1: {
        if (this.step === 1) {
          this.buttonText = this.btnLabelReturn;
          this.stepTitle = this.returnMsg;
          this.showReturnDate = true;
          this.showReturnDisabledDate = false;
          return 'r';
        }
        if (this.step === 2) {
          this.buttonText = this.btnLabelLast;
          this.stepTitle = this.quantityMsg;
          this.showReturnDate = false;
          this.showReturnDisabledDate = true;
          return 'q';
        }
        break;
      }
      // ENTREGA
      case 2: {
        if (this.step === 1) {
          this.buttonText = this.btnLabelDelivery;
          this.stepTitle = this.deliveryMsg;
          this.showDeliveryDate = true;
          this.showDeliveryDisabledDate = false;
          return 'd';
        }
        if (this.step === 2) {
          this.buttonText = this.btnLabelConfirm;
          this.stepTitle = this.quantityMsg;
          this.showDeliveryDate = false;
          this.showDeliveryDisabledDate = true;
          return 'q';
        }
        if (this.step === 3) {
          this.buttonText = this.btnLabelLast;
          this.stepTitle = this.confirmDeliveryMsg;
          this.showDeliveryDate = false;
          this.showDeliveryDisabledDate = true;
          return 'c';
        }
        break;
      }
      // ENTREGA E RETORNO
      case 3: {
        if (this.step === 1) {
          this.buttonText = this.btnLabelNext;
          this.stepTitle = this.returnMsg;
          this.showReturnDate = true;
          this.showDeliveryDate = false;
          this.epiDeliveryReturnForm.controls.deliveryDate.disable();
          return 'r';
        }
        if (this.step === 2) {
          this.buttonText = this.btnLabelNext;
          this.stepTitle = this.deliveryMidMsg;
          this.showDeliveryDate = true;
          this.showReturnDate = false;
          this.showDeliveryDisabledDate = false;
          this.showReturnDisabledDate = false;
          this.epiDeliveryReturnForm.controls.deliveryDate.enable();
          return 'd';
        }
        if (this.step === 3) {
          this.buttonText = this.btnLabelConfirm;
          this.stepTitle = this.quantityMsg;
          this.showDeliveryDate = false;
          this.showDeliveryDisabledDate = true;
          this.showReturnDisabledDate = true;
          return 'q';
        }
        if (this.step === 4) {
          this.buttonText = this.btnLabelLast;
          this.stepTitle = this.confirmDeliveryReturnMsg;
          this.showDeliveryDate = false;
          this.showDeliveryDisabledDate = true;
          this.showReturnDisabledDate = true;
          return 'c';
        }
        break;
      }
    }
  }

  nextStep() {
    if (this.step !== this.totalStep) {
      this.step++;
      this.stage = this.resolveRoute();
      if (typeof this.worker === 'string') {
        const w = this.worker.toLocaleLowerCase();
        this.worker = this.workers.find(x => x.name.toLocaleLowerCase() === w);
      }
    } else {
      // CHAMR FN PARA SALVAR
      this.onSaveDisable = true;
      if (this.type === 1) {
        this.doSave();
      } else {
        this.epiConfirmForm.doSubmitWorkerPasswordForm().subscribe(
          (response) => {
            this.doSave();
          },
          (error) => {
            this.onSaveDisable = false;
            this.snackBar.open(error.json().errors[0].message, null, { duration: 3000 });
          },
          () => {
            this.onSaveDisable = false;
          }
        );
      }
    }
  }

  doSave() {
    this.saveFn().subscribe(
      response => {
        if (this.quantityComponentData.deliver.length > 0) {
          this.caEpisQuantitySum.forEach((value, key) => {
            this.quantityComponentData.deliver.find(x => x.id === key).quantity += value;
          });
          this.caeEpiService.updateCaEpis(this.quantityComponentData.deliver).subscribe(caeEpis => {
            for (const caEpi of caeEpis) {
              const registered = this.caEpiListResolver.loadRegistered.getValue();
              const registeredEpi = registered.find(x => x.id === caEpi.id);
              if (registeredEpi) {
                registeredEpi.quantity = caEpi.quantity;
                this.caEpiListResolver.setListCaEpiRegistered(registered);
              }

              const expired = this.caEpiListResolver.loadCaEpiExpired.getValue();
              const expiredEpi = expired.find(x => x.id === caEpi.id);
              if (expiredEpi) {
                expiredEpi.quantity = caEpi.quantity;
                this.caEpiListResolver.setListCaEpiExpired(expired);
              }

              const toExpire = this.caEpiListResolver.loadForthComingMaturities.getValue();
              const toExpireEpi = toExpire.find(x => x.id === caEpi.id);
              if (toExpireEpi) {
                toExpireEpi.quantity = caEpi.quantity;
                this.caEpiListResolver.setListCaEpiForthComingMaturities(toExpire);
              }
            }
            this.snackBar.open(this.saveMsg, null, { duration: 3000 });
          },
            error => {
              this.onSaveDisable = false;
              this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
            },
            () => {
              this.onSaveDisable = false;
              this.dialogRef.close(true);
            });
        } else {
          this.snackBar.open(this.saveMsg, null, { duration: 3000 });
          this.dialogRef.close(true);
        }
      },
      error => {
        this.onSaveDisable = false;
        this.snackBar.open('Erro no servidor!', null, { duration: 3000 });
      },
      () => {
        this.onSaveDisable = false;
        this.dialogRef.close(true);
      }
    );
  }

  previousStep() {
    if (this.step > 1) {
      if (this.type !== 2 && this.step < 3) {
        this.filterLoaned();
        this.filterIndividualEquipmentLoaned();
      }
      this.step--;
      this.stage = this.resolveRoute();
    }
  }

  setTotalStep(type: Number) {
    if (type === 3) { return 4; }
    if (type === 2) { return 3; }

    return 2;
  }

  setTitleAndSaveFn(type: Number) {
    switch (type) {
      case 1: {
        this.title = 'devolução de EPI';
        // this.saveFn = this.returnEpi;
        this.saveFn = this.returnEquipments;
        this.saveMsg = this.returnSuccess;
        this.epiDeliveryReturnForm.controls.deliveryDate.disable();
        break;
      }
      case 2: {
        this.title = 'entrega de EPI';
        //                this.saveFn = this.deliverEpi;
        this.saveFn = this.deliverEquipments;
        this.saveMsg = this.deliverySuccess;
        this.epiDeliveryReturnForm.controls.returnDate.disable();
        break;
      }
      case 3: {
        this.title = 'devolução e Entrega de EPI';
        /*this.saveFn = () => {
            const subject = new Subject<any>();
            this.deliverEpi().subscribe(response => {
                this.returnEpi().subscribe(response2 => {
                    subject.next();
                },
                    error2 => {
                        subject.error(error2);
                    });
            },
                error => {
                    subject.error(error);
                });
            return subject.asObservable();
        };*/
        this.saveFn = this.deliverAndReturnEquipments;
        this.saveMsg = this.deliveryReturnSuccess;
        break;
      }
    }
  }

  displayFn(worker: Worker): any {
    return worker ? worker.name : worker;
  }

  validateWorker() {
    return (control: FormControl) => {
      return typeof control.value === 'object' || this.workers.find(x => x.name.toLowerCase() === control.value.toLowerCase()) ? null : { invalid: true };
    };
  }

  onDeliveryEpisChange(epis: CaEpi[]) {
    this.quantityComponentData.deliver = epis;
    this.initDeliverControl(epis);
  }

  onReturnEpisChange(epis: CaEpi[]) {
    this.quantityComponentData.return = epis;
    this.initReturnControl(epis);
  }

  onDeliveryIndividualEquipmentListChange(individualEquipmentList: IndividualEquipment[]) {
    this.quantityComponentData.deliveryIndividualEquipmentList = individualEquipmentList;
    this.initDeliveryIndividualEquipmentControls(individualEquipmentList);
  }

  onReturnIndividualEquipmentListChange(individualEquipmentList: IndividualEquipment[]) {
    this.quantityComponentData.returnIndividualEquipmentList = individualEquipmentList;
    this.initReturnIndividualEquipmentControls(individualEquipmentList);
  }

  initDeliverControl(epis: CaEpi[]) {
    const form = new FormGroup({});
    let index = 0;
    for (const epi of epis) {
      const i = index;
      this.deliveryControls.set('deliverAmount' + index, new FormControl());
      this.quantityComponentData.availableDeliverEpi.set(epi.id, { available: epi.quantity, amount: null });
      index++;
    }
    this.setupFormControls();
  }

  initReturnControl(epis: CaEpi[]) {
    let workerId = 0;
    if (typeof this.worker == 'object') {
      workerId = this.worker.id;
    }
    const form = new FormGroup({});
    let index = 0;
    for (const epi of epis) {
      const i = index;
      this.returnControls.set('returnAmount' + index, new FormControl());
      this.epiWorkersService.getLoanedEpiAmountByUser(epi.id, workerId).subscribe(amount => {
        this.quantityComponentData.availableReturnEpi.set(epi.id, { available: amount, amount: null });
      });
      index++;
    }
    this.setupFormControls();
  }

  initDeliveryIndividualEquipmentControls(individualEquipmentList: IndividualEquipment[]) {
    for (const individualEquipment of individualEquipmentList) {
      const index = individualEquipmentList.indexOf(individualEquipment);
      this.deliveryIndividualEquipmentControls.set('deliveryIndividualEquipmentAmount' + index, new FormControl());
      this.quantityComponentData.availableDeliveryIndividualEquipment.set(individualEquipment.id, { available: individualEquipment.quantity, amount: null });
    }
    this.setupFormControls();
  }

  initReturnIndividualEquipmentControls(individualEquipmentList: IndividualEquipment[]) {
    for (const individualEquipment of individualEquipmentList) {
      const index = individualEquipmentList.indexOf(individualEquipment);
      const quantityAvailable = this.individualEquipmentWorkerList.filter(individualEquipmentWorker => individualEquipmentWorker.individualEquipment.id === individualEquipment.id).length;
      this.returnIndividualEquipmentControls.set('returnIndividualEquipmentAmount' + index, new FormControl());
      this.quantityComponentData.availableReturnIndividualEquipment.set(individualEquipment.id, { available: quantityAvailable, amount: null });
    }
    this.setupFormControls();
  }

  setupFormControls() {
    const form = new FormGroup({});
    this.deliveryControls.forEach((value, key) => {
      form.addControl(key.toString(), value);
    });
    this.returnControls.forEach((value, key) => {
      form.addControl(key.toString(), value);
    });
    this.deliveryIndividualEquipmentControls.forEach((value, key) => {
      form.addControl(key.toString(), value);
    });
    this.returnIndividualEquipmentControls.forEach((value, key) => {
      form.addControl(key.toString(), value);
    });
    this.quantityComponentData.form = form;
  }

  deliverAndReturnEquipments(): Observable<any[]> {
    const subject = new Subject<any[]>();

    this.deliverEquipments().subscribe(response => {
      this.returnEquipments().subscribe(response2 => {
        subject.next();
      },
        error2 => {
          subject.error(error2);
        });
    },
      error => {
        subject.error(error);
      });

    return subject.asObservable();
  }

  deliverEquipments(): Observable<any[]> {
    const subject = new Subject<any[]>();

    this.deliverEpi().subscribe(response => {
      this.deliveryIndividualEquipment().subscribe(response2 => {
        subject.next();
      },
        error2 => {
          subject.error(error2);
        });
    },
      error => {
        subject.error(error);
      });

    return subject.asObservable();
  }

  deliverEpi(): Observable<any[]> {
    const toDeliver: EpiWorkers[] = [];
    for (const epi of this.quantityComponentData.deliver) {
      const amount = Number(this.quantityComponentData.availableDeliverEpi.get(epi.id).amount);
      for (let i = 0; i < amount; i++) {
        toDeliver.push(new EpiWorkers(this.deliveryDate, (<Worker>this.worker).id, epi, epi.epiId.id));
      }
      this.caEpisQuantitySum.set(epi.id, -amount);
    }
    return this.epiWorkersService.createEpisWorker(toDeliver);
  }

  deliveryIndividualEquipment(): Observable<any[]> {
    const toDeliver: IndividualEquipmentWorker[] = [];
    for (const individualEquipment of this.quantityComponentData.deliveryIndividualEquipmentList) {
      const amount = Number(this.quantityComponentData.availableDeliveryIndividualEquipment.get(individualEquipment.id).amount);
      for (let i = 0; i < amount; i++) {
        const individualEquipmentWorker = new IndividualEquipmentWorker();
        individualEquipmentWorker.individualEquipment = individualEquipment;
        individualEquipmentWorker.worker = <Worker>this.worker;
        individualEquipmentWorker.loanDate = this.deliveryDate;
        toDeliver.push(individualEquipmentWorker);
      }
    }
    return this.individualEquipmentWorkerService.save(toDeliver);
  }

  returnEquipments(): Observable<any[]> {
    const subject = new Subject<any[]>();

    this.returnEpi().subscribe(response => {
      this.returnIndividualEquipment().subscribe(response2 => {
        subject.next();
      },
        error2 => {
          subject.error(error2);
        });
    },
      error => {
        subject.error(error);
      });

    return subject.asObservable();
  }

  returnEpi(): Observable<any[]> {
    const toReturn: EpiWorkers[] = [];
    for (const epi of this.quantityComponentData.return) {
      const amount = Number(this.quantityComponentData.availableReturnEpi.get(epi.id).amount);
      const returnByType = this.epiWorkers.filter(x => x.caEpiId.id === epi.id).sort((a, b) => {
        return a.dateLoanEquipment < b.dateLoanEquipment ?
          -1 : a.dateLoanEquipment < b.dateLoanEquipment ?
            1 : 0;
      });
      for (let i = 0; i < amount; i++) {
        const ret = returnByType[i];
        ret.dateReturnEquipment = this.returnDate;
        toReturn.push(ret);
      }
    }
    return this.epiWorkersService.updateEpiWorker(toReturn);
  }

  returnIndividualEquipment(): Observable<any[]> {
    const toReturn: IndividualEquipmentWorker[] = [];

    for (const individualEquipment of this.quantityComponentData.returnIndividualEquipmentList) {
      const amount = Number(this.quantityComponentData.availableReturnIndividualEquipment.get(individualEquipment.id).amount);
      const returnByType = this.individualEquipmentWorkerList
        .filter(individualEquipmentWorker => individualEquipmentWorker.individualEquipment.id === individualEquipment.id)
        .sort((a, b) => {
          if (a.loanDate < b.loanDate) { return -1; }
          if (a.loanDate > b.loanDate) { return 1; }
          return 0;
        });

      for (let i = 0; i < amount; i++) {
        const ret = returnByType[i];
        ret.returnDate = this.returnDate;
        toReturn.push(ret);
      }
    }

    return this.individualEquipmentWorkerService.save(toReturn);
  }

  isNextDisabled() {
    let typeDisabled = false;

    if (this.type === 3) {
      if (this.step === 1) {
        typeDisabled = this.quantityComponentData.return.length < 1 && this.quantityComponentData.returnIndividualEquipmentList.length < 1;
      } else if (this.step === 2) {
        typeDisabled = this.quantityComponentData.deliver.length < 1 && this.quantityComponentData.deliveryIndividualEquipmentList.length < 1;
      } else if (this.step === 3) {
        typeDisabled = this.quantityComponentDataDisabled;
      } else if (this.step === 4) {
        typeDisabled = this.isEpiConfirmFormInvalid();
      }
    } else if (this.type === 2) {
      if (this.step === 1) {
        typeDisabled = this.quantityComponentData.deliver.length < 1 && this.quantityComponentData.deliveryIndividualEquipmentList.length < 1;
      } else if (this.step === 2) {
        typeDisabled = this.quantityComponentData.form.invalid;
      } else if (this.step === 3) {
        typeDisabled = this.isEpiConfirmFormInvalid();
      }
    } else {
      typeDisabled = this.quantityComponentData.return.length < 1 && this.quantityComponentData.returnIndividualEquipmentList.length < 1;
    }

    return this.epiDeliveryReturnForm.invalid || typeDisabled || this.onSaveDisable;
  }

  isEpiConfirmFormInvalid(): boolean {
    if (!this.epiConfirmForm) { return true; }

    if (this.epiConfirmForm.onChangePassword) {
      return this.epiConfirmForm.workerPasswordChangeForm.invalid;
    }

    return this.epiConfirmForm.workerPasswordConfirmationForm.invalid;
  }

  onQuantityFormStatusChange(event): void {
    setTimeout(() => {
      this.quantityComponentDataDisabled = !event.valid;
    });
  }
}
